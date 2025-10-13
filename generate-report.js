// generate-report.js
import { execSync } from 'child_process';
import fs from 'fs';

console.log('📊 Generando reporte...');

// --- Ejecutar ESLint ---
let lintResult = '';
try {
  lintResult = execSync('npx eslint . --ext .js --format stylish', { encoding: 'utf8' });
  if (!lintResult.trim()) lintResult = '✅ No se encontraron problemas de lint';
} catch (error) {
  lintResult = error.stdout || '⚠️ Errores encontrados en ESLint';
}

// --- Ejecutar Jest con ESM de forma segura ---
let testDetails = '';
let coverageSummary = '';
try {
  // Ejecutar Jest a través de node para soportar ESM en Windows
  const jestCommand = process.platform === 'win32'
    ? 'node --experimental-vm-modules node_modules/jest/bin/jest.js --json --outputFile=tmp-test-results.json --coverage --coverageReporters=text-summary --silent'
    : 'node --experimental-vm-modules ./node_modules/jest/bin/jest.js --json --outputFile=tmp-test-results.json --coverage --coverageReporters=text-summary --silent';

  execSync(jestCommand, { stdio: 'ignore' });

  // Leer resultados JSON
  const testJsonResult = JSON.parse(fs.readFileSync('tmp-test-results.json', 'utf8'));

  if (testJsonResult.testResults) {
    testJsonResult.testResults.forEach(suite => {
      suite.assertionResults.forEach((test, i) => {
        const status = test.status === 'passed' ? '✅ PASÓ' : '❌ FALLÓ';
        testDetails += `${i + 1}. [${status}] ${test.fullName}\n`;
      });
    });
  } else {
    testDetails = '⚠️ No se pudieron capturar los tests';
  }

  // Cobertura resumida
  coverageSummary = execSync(jestCommand.replace('--json --outputFile=tmp-test-results.json', ''), { encoding: 'utf8' });

} catch (error) {
  testDetails = '⚠️ Error al ejecutar Jest: ' + error.message;
  coverageSummary = '⚠️ No se pudo generar cobertura';
}

// --- Crear carpeta reports ---
if (!fs.existsSync('reports')) fs.mkdirSync('reports');

// --- Guardar reporte ---
const report = [
  '=== LINT REPORT ===\n',
  lintResult,
  '\n=== TEST DETAIL ===\n',
  testDetails,
  '\n=== COVERAGE SUMMARY ===\n',
  coverageSummary
].join('\n');

fs.writeFileSync('reports/summary.txt', report);
console.log('✅ Reporte generado en reports/summary.txt');
