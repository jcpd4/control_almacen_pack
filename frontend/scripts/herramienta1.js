let pedido = {};
let cajaActual = 0;

function startPedido() {
  pedido = {};
  cajaActual = 0;
  document.getElementById("pedido-area").innerHTML = `
    <button onclick="nuevaCaja()">➕ Crear caja</button>
    <div id="cajas"></div>
    <button onclick="acabarPedido()" style="margin-top:2rem;">✅ Acabar pedido</button>
  `;
}

function nuevaCaja() {
  cajaActual++;
  const cajaId = "caja" + cajaActual;
  pedido[cajaId] = [];

  const cajaDiv = document.createElement("div");
  cajaDiv.className = "caja";
  cajaDiv.innerHTML = `
    <h3>Caja ${cajaActual}</h3>
    <div id="contenido-${cajaId}"></div>
    <div style="margin-top:10px;">
      <input type="number" min="1" placeholder="Cantidad" id="cantidad-${cajaId}" />
      <span>x</span>
      <input type="text" maxlength="4" placeholder="ASIN (últimos 4)" id="asin-${cajaId}" />
      <button onclick="agregarProducto('${cajaId}')">Agregar</button>
    </div>
    <hr/>
  `;
  document.getElementById("cajas").appendChild(cajaDiv);
}

function agregarProducto(cajaId) {
  const cantidad = parseInt(document.getElementById(`cantidad-${cajaId}`).value);
  const asin = document.getElementById(`asin-${cajaId}`).value.trim().toUpperCase();

  if (!cantidad || !asin || asin.length !== 4) {
    alert("Por favor, introduce una cantidad válida y un ASIN de 4 caracteres.");
    return;
  }

  pedido[cajaId].push({ asin, cantidad });

  const contenidoDiv = document.getElementById(`contenido-${cajaId}`);
  const p = document.createElement("p");
  p.textContent = `${cantidad} x ${asin}`;
  contenidoDiv.appendChild(p);

  document.getElementById(`cantidad-${cajaId}`).value = "";
  document.getElementById(`asin-${cajaId}`).value = "";
}

function acabarPedido() {
  const resumen = {};
  const cajaResumen = {};

  for (let [cajaId, productos] of Object.entries(pedido)) {
    for (let { asin, cantidad } of productos) {
      if (!resumen[asin]) resumen[asin] = 0;
      resumen[asin] += cantidad;

      if (!cajaResumen[asin]) cajaResumen[asin] = {};
      cajaResumen[asin][cajaId] = (cajaResumen[asin][cajaId] || 0) + cantidad;
    }
  }

  const fecha = new Date().toLocaleString();
  let resultadoHTML = `<h3>🧾 Informe de Pedido - ${fecha}</h3>`;

  resultadoHTML += "<h4>Totales por ASIN:</h4><ul>";
  for (let asin in resumen) {
    resultadoHTML += `<li><strong>${asin}</strong>: ${resumen[asin]} unidades</li>`;
  }
  resultadoHTML += "</ul>";

  resultadoHTML += "<h4>Distribución por cajas:</h4><table border='1' cellspacing='0' cellpadding='5'><tr><th>ASIN</th>";
  for (let i = 1; i <= cajaActual; i++) {
    resultadoHTML += `<th>Caja ${i}</th>`;
  }
  resultadoHTML += "</tr>";

  for (let asin in cajaResumen) {
    resultadoHTML += `<tr><td>${asin}</td>`;
    for (let i = 1; i <= cajaActual; i++) {
      const key = "caja" + i;
      resultadoHTML += `<td>${cajaResumen[asin][key] || 0}</td>`;
    }
    resultadoHTML += "</tr>";
  }

  resultadoHTML += "</table>";

  document.getElementById("pedido-area").innerHTML += `<div style="margin-top:2rem;">${resultadoHTML}</div>`;
}
