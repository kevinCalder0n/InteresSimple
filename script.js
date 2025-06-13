let projectCount = 0;
const MAX_PROJECTS = 5;

// Utilidades
const formatCurrency = (value) => new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN'
}).format(value);

const validateInputs = (p, s, i, n) => {
  if (isNaN(p) || isNaN(s) || isNaN(i) || isNaN(n) || n <= 0) {
    return false;
  }
  return true;
};

// Gestión de proyectos
const addProject = () => {
  if (projectCount >= MAX_PROJECTS) {
    alert("Solo puedes agregar hasta 5 proyectos.");
    return;
  }

  projectCount++;
  const container = document.getElementById("projects-container");

  const box = document.createElement("div");
  box.className = "project-box";
  box.setAttribute("data-id", projectCount);
  box.innerHTML = `
    <h3>Proyecto ${projectCount}</h3>
    <div class="input-group">
      <label>Inversión Inicial (P):</label>
      <input type="number" class="p" placeholder="Ej: 10000" min="0" step="1000" />
      <small class="input-hint">Ingresa el monto inicial de inversión</small>
    </div>

    <div class="input-group">
      <label>Valor de Salvamento (S):</label>
      <input type="number" class="s" placeholder="Ej: 2000" min="0" step="100" />
      <small class="input-hint">Valor residual al final del período</small>
    </div>

    <div class="input-group">
      <label>Tasa de Interés Anual (i %):</label>
      <input type="number" class="i" placeholder="Ej: 8" min="0" max="100" step="0.1" />
      <small class="input-hint">Porcentaje anual (0-100)</small>
    </div>

    <div class="input-group">
      <label>Vida útil (n años):</label>
      <input type="number" class="n" placeholder="Ej: 5" min="1" step="1" />
      <small class="input-hint">Duración del proyecto en años</small>
    </div>
  `;
  container.appendChild(box);
};

// Cálculos
const calculateCAUE = (p, s, i, n) => {
  const iDecimal = i / 100;
  const factor1 = (iDecimal * Math.pow(1 + iDecimal, n)) / (Math.pow(1 + iDecimal, n) - 1);
  const factor2 = iDecimal / (Math.pow(1 + iDecimal, n) - 1);
  return p * factor1 - s * factor2;
};

// Visualización
const showResults = (results) => {
  const resultsDiv = document.getElementById("results");
  const resultsContent = resultsDiv.querySelector(".results-content");
  const chartContainer = document.querySelector(".chart-container");
  
  resultsDiv.style.display = "block";
  chartContainer.style.display = "block";
  
  // Mostrar resultados en texto
  resultsContent.innerHTML = results.map((result, index) => 
    `<p>Proyecto ${index + 1}: CAUE = ${formatCurrency(result)}</p>`
  ).join('');

  // Crear gráfico
  const canvas = document.getElementById("chart");
  if (window.caueChart) window.caueChart.destroy();

  window.caueChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: results.map((_, i) => `Proyecto ${i + 1}`),
      datasets: [{
        label: "CAUE",
        data: results,
        backgroundColor: "#0077b6",
        borderColor: "#005f8a",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => formatCurrency(context.raw)
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatCurrency(value)
          }
        }
      }
    }
  });
};

// Event Listeners
document.getElementById("add-project-btn").addEventListener("click", addProject);

document.getElementById("calculate-btn").addEventListener("click", () => {
  const results = [];
  let hasError = false;

  document.querySelectorAll(".project-box").forEach((box, index) => {
    const p = parseFloat(box.querySelector(".p").value);
    const s = parseFloat(box.querySelector(".s").value);
    const i = parseFloat(box.querySelector(".i").value);
    const n = parseInt(box.querySelector(".n").value);

    if (!validateInputs(p, s, i, n)) {
      alert(`Verifica los datos del Proyecto ${index + 1}`);
      hasError = true;
      return;
    }

    results.push(calculateCAUE(p, s, i, n));
  });

  if (!hasError && results.length > 0) {
    showResults(results);
  }
});
