import { execSync } from 'child_process';
import fs from 'fs';

console.log('📊 Generando reporte completo...');

// --- Crear carpeta reports si no existe ---
if (!fs.existsSync('reports')) fs.mkdirSync('reports');

var asd = 5;

// --- ESLint ---
let lintErrors = 0,
  lintWarnings = 0,
  lintDetails = '',
  lintTime = new Date().toLocaleString();

try {
  console.log('🔍 Analizando código con ESLint...');

  // Ejecutar ESLint en JSON para obtener resumen
  let lintJson;
  try {
    lintJson = execSync('npx eslint . --ext .js -f json', { encoding: 'utf8' });
  } catch (err) {
    // Si ESLint devuelve código distinto de 0 (errores), aún capturamos la salida
    lintJson = err.stdout.toString();
  }

  const lintData = JSON.parse(lintJson);

  lintData.forEach(file => {
    lintErrors += file.errorCount;
    lintWarnings += file.warningCount;
    file.messages.forEach(msg => {
      lintDetails += `[${msg.severity === 2 ? '❌' : '⚠️'}] Línea ${msg.line}, Col ${msg.column}: ${msg.message} (${msg.ruleId})\n`;
    });
  });

  // Generar HTML aunque haya errores
  try {
    execSync('npx eslint . --ext .js -f html -o reports/eslint-report.html', { stdio: 'ignore' });
  } catch (err) {
    // ignoramos errores para no romper el flujo
  }

  console.log(`✅ ESLint completado: ${lintErrors} errores, ${lintWarnings} advertencias`);
} catch (err) {
  console.log('⚠️ Problemas inesperados en ESLint:', err);
}

// Guardar resumen en archivo
fs.writeFileSync(
  'reports/lint-summary.txt',
  `Fecha: ${lintTime}\nErrores: ${lintErrors}\nAdvertencias: ${lintWarnings}\nDetalles:\n${lintDetails}`
);

// --- Jest ---
let testsPassed = 0, testsFailed = 0, jestTime = new Date().toLocaleString(), jestDetails = '';
let coveragePct = 'N/A';
try {
  console.log('🧪 Ejecutando tests con Jest...');
  const jestCmd = process.platform === 'win32'
    ? 'set NODE_OPTIONS=--experimental-vm-modules && npx jest --coverage --coverageReporters=json --json --outputFile=reports/jest-results.json'
    : 'NODE_OPTIONS=--experimental-vm-modules npx jest --coverage --coverageReporters=json --json --outputFile=reports/jest-results.json';
  execSync(jestCmd, { stdio: 'inherit' });

  // Leer resultados de tests
  const jestResults = JSON.parse(fs.readFileSync('reports/jest-results.json', 'utf8'));
  jestResults.testResults.forEach(suite => {
    //jestDetails += `Suite: ${suite.name}\n`;
    suite.assertionResults.forEach(test => {
      const status = test.status === 'passed' ? '✅ PASÓ' : '❌ FALLÓ';
      jestDetails += `[${status}] ${test.fullName}\n`;
      if (test.status === 'passed') testsPassed++;
      else testsFailed++;
    });
  });

// --- Leer cobertura desde JSON ---
try {
  const coverageJson = JSON.parse(fs.readFileSync('coverage/coverage-final.json', 'utf8'));

  let totalStatements = 0;
  let executedStatements = 0;

  for (const filePath in coverageJson) {

    const fileCov = coverageJson[filePath];

    // Excluir archivos generados automáticamente si quieres
    if (filePath.includes('jest-html-reporters-attach')) continue;

    const statements = fileCov.s;
    for (const stmtId in statements) {
      totalStatements++;
      if (statements[stmtId] > 0) executedStatements++;
    }
  }

  if (totalStatements > 0) {
    coveragePct = ((executedStatements / totalStatements) * 100).toFixed(2) + '%';
  } else {
    coveragePct = 'N/A';
  }

} catch (err) {
  console.log('⚠️ No se pudo leer la cobertura desde coverage-final.json');
  coveragePct = 'N/A';
}
  console.log(`✅ Jest completado: ${testsPassed} pasados, ${testsFailed} fallidos, cobertura ${coveragePct}`);
} catch (err) {
  console.log('⚠️ Algunos tests fallaron', err);
}

// --- Generar resumen ---
const summary = `
=== RESUMEN DEL ANÁLISIS ===
📌 Lint generado: ${lintTime}
ESLint Errors: ${lintErrors}
ESLint Warnings: ${lintWarnings}
Detalles:
${lintDetails}

📌 Jest generado: ${jestTime}
Tests Passed: ${testsPassed}
Tests Failed: ${testsFailed}
Detalles:
${jestDetails}

Cobertura: ${coveragePct}
`;

fs.writeFileSync('reports/summary.txt', summary);
console.log('📄 Resumen guardado en reports/summary.txt');
