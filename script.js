import { addAttempt, resetClicks } from './logic.js';

const startBtn = document.getElementById('startBtn');
const btn = document.getElementById('inc');
const counter = document.getElementById('counter');
const status = document.getElementById('status');

const canvasMeter = document.getElementById('meter');
const ctxMeter = canvasMeter.getContext('2d');

const canvasBar = document.getElementById('barChart');
const ctxBar = canvasBar.getContext('2d');

const maxClicksField = document.getElementById('maxClicks');
let bestAttempt = 0; // variable para guardar el mejor intento

let clicks = 0;
let attempts = [];
const attemptDuration = 5000; // 5 segundos
let running = false;
let startTime = null;
let timerInterval = null;

// --- Dibuja pastel basado en porcentaje ---
function drawMeter(percentage) {
  const radius = 80;
  const centerX = canvasMeter.width / 2;
  const centerY = canvasMeter.height / 2;

  ctxMeter.clearRect(0, 0, canvasMeter.width, canvasMeter.height);

  // fondo gris
  ctxMeter.beginPath();
  ctxMeter.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctxMeter.fillStyle = '#eee';
  ctxMeter.fill();

  // pastel verde según porcentaje de tiempo
  ctxMeter.beginPath();
  ctxMeter.moveTo(centerX, centerY);
  ctxMeter.arc(centerX, centerY, radius, -0.5 * Math.PI, -0.5 * Math.PI + 2 * Math.PI * percentage);
  ctxMeter.closePath();
  ctxMeter.fillStyle = '#4CAF50';
  ctxMeter.fill();
}

// --- Dibuja gráfico de barras ---
function drawBarChart(attempts) {
  ctxBar.clearRect(0, 0, canvasBar.width, canvasBar.height);
  const barWidth = 30;
  const spacing = 10;
  const maxHeight = Math.max(...attempts, 10);

  attempts.forEach((clicks, i) => {
    const height = (clicks / maxHeight) * 150;
    ctxBar.fillStyle = '#2196F3';
    ctxBar.fillRect(i * (barWidth + spacing), canvasBar.height - height, barWidth, height);

    ctxBar.fillStyle = '#000';
    ctxBar.fillText(clicks, i * (barWidth + spacing) + 5, canvasBar.height - height - 5);
    ctxBar.fillText(`#${i+1}`, i * (barWidth + spacing) + 5, canvasBar.height - 5);
  });
}

// --- Botón iniciar ---
startBtn.addEventListener('click', () => {
  if (!running) {
    running = true;
    btn.disabled = false;
    startBtn.disabled = true;
    clicks = 0;
    counter.textContent = clicks;
    status.textContent = 'Intento en curso... ¡Click en Incrementar!';
    startTime = Date.now();

    // refresca pastel cada 50ms según tiempo transcurrido
    timerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let percentage = elapsed / attemptDuration;
      if (percentage > 1) percentage = 1;
      drawMeter(percentage);

      // si se termina el intento
      if (elapsed >= attemptDuration) {
        clearInterval(timerInterval);
        running = false;
        attempts = addAttempt(attempts, clicks);
        drawBarChart(attempts);

         // Actualizar mejor intento sin modificar el mensaje principal
        if (clicks > bestAttempt) {
            bestAttempt = clicks;
            maxClicksField.textContent = bestAttempt;
            // animación temporal
            maxClicksField.classList.add('pop');
            setTimeout(() => maxClicksField.classList.remove('pop'), 300);
        }   

        clicks = resetClicks();
        
        counter.textContent = clicks;
        startBtn.disabled = false;
        btn.disabled = true;
        status.textContent = 'Intento finalizado. Presiona "Iniciar" para el siguiente.';
        
      }
    }, 50);
  }
});

// --- Botón incrementar ---
btn.addEventListener('click', () => {
  if (!running) return;
  clicks++;
  counter.textContent = clicks;
});

// --- inicializa gráficos ---
drawMeter(0);
drawBarChart([]);

// Contexto requerido por LaunchDarkly
const context = {
  kind: "user",
  key: "context-key-123abc" // puedes dejarlo así
};

const client = LDClient.initialize("692cf884023b6e09ac4db4af", context);

client.on("ready", () => {
  console.log("LaunchDarkly listo!");

  const flagValue = client.variation("reports-button", true);

  console.log("Flag reports-button =", flagValue);

  const reportsBtn = document.getElementById("reportsBtn");
  const reportsMessage = document.getElementById("reportsMessage");

  if (flagValue) {
    reportsBtn.style.display = "inline-block";
    reportsMessage.textContent = "Reportes habilitados";
  } else {
    reportsBtn.style.display = "none";
    reportsMessage.textContent = "Reportes deshabilitados";
  }
});
