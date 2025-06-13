let projectCount = 0;
const MAX_PROJECTS = 5;

document.getElementById("add-project-btn").addEventListener("click", () => {
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
    <label>Inversión Inicial (P):</label>
    <input type="number" class="p" placeholder="Ej: 10000" />

    <label>Valor de Salvamento (S):</label>
    <input type="number" class="s" placeholder="Ej: 2000" />

    <label>Tasa de Interés Anual (i %):</label>
    <input type="number" class="i" placeholder="Ej: 8" />

    <label>Vida útil (n años):</label>
    <input type="number" class="n" placeholder="Ej: 5" />
  `;
  container.appendChild(box);
});

document.getElementById("calculate-btn").addEventListener("click", () => {
  const results = document.getElementById("results");
  results.innerHTML = "";
  const labels = [];
  const values = [];

  document.querySelectorAll(".project-box").forEach((box, index) => {
    const p = parseFloat(box.querySelector(".p").value);
    const s = parseFloat(box.querySelector(".s").value);
    const i = parseFloat(box.querySelector(".i").value) / 100;
    const n = parseInt(box.querySelector(".n").value);

    if (isNaN(p) || isNaN(s) || isNaN(i) || isNaN(n) || n <= 0) {
      alert(`Verifica los datos del Proyecto ${index + 1}`);
      return;
    }

    const factor1 = (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const factor2 = i / (Math.pow(1 + i, n) - 1);
    const caue = p * factor1 - s * factor2;

    const r = document.createElement("p");
    r.innerHTML = `<strong>Proyecto ${index + 1}:</strong> CAUE = $${caue.toFixed(2)}`;
    results.appendChild(r);

    labels.push(`Proyecto ${index + 1}`);
    values.push(caue.toFixed(2));
  });

  results.style.display = "block";

  // Mostrar gráfico
  const canvas = document.getElementById("chart");
  canvas.style.display = "block";
  const ctx = canvas.getContext("2d");
  if (window.caueChart) window.caueChart.destroy();

  window.caueChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "CAUE ($)",
        data: values,
        backgroundColor: "#0077b6"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
});
