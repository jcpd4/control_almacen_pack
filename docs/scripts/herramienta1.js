let pedido = {};
let cajaActual = 0;
let pedidosGuardados = [];
let editandoIndex = null;

document.addEventListener("DOMContentLoaded", () => {
  cargarPedidosGuardados();
});

function startPedido() {
  pedido = {};
  cajaActual = 0;
  editandoIndex = null;
  document.getElementById("pedido-area").innerHTML = `
    <h2>📦 Crear Pedido para Amazon</h2>
    <button onclick="nuevaCaja()">Crear caja</button>
    <div id="cajas"></div>
    <button onclick="acabarPedido(true)" style="margin-top:2rem;">Acabar pedido</button>
    <div id="informe"></div>
  `;
}

function nuevaCaja() {
  cajaActual++;
  const cajaId = "caja" + cajaActual;
  pedido[cajaId] = [];

  const cajaDiv = document.createElement("div");
  cajaDiv.className = "caja";
  cajaDiv.innerHTML = `
    <h3>
			Caja ${cajaActual}
			<button onclick="editarCaja('${cajaId}')">✏️</button>
		</h3>
    <div id="contenido-${cajaId}"></div>
    <div class="input-line">
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

function acabarPedido(modoEdicion = false) {
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
  const totalUnidades = Object.values(resumen).reduce((acc, val) => acc + val, 0);

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

  if (modoEdicion) {
    resultadoHTML += `<button onclick="guardarPedido('${fecha}', ${totalUnidades})" style="margin-top:1rem;">💾 ${editandoIndex !== null ? 'Actualizar pedido' : 'Guardar pedido'}</button>`;
  }

  resultadoHTML += `<button onclick="descargarPedido('${fecha}')" style="margin-left:1rem;">⬇️ Descargar</button>`;

  document.getElementById("informe").innerHTML = resultadoHTML;
}

function guardarPedido(fecha, totalUnidades) {
  const nuevoPedido = {
    fecha,
    totalUnidades,
    pedido
  };

  if (editandoIndex !== null) {
    pedidosGuardados[editandoIndex] = nuevoPedido;
    editandoIndex = null;
    alert("✏️ Pedido actualizado correctamente.");
  } else {
    pedidosGuardados.push(nuevoPedido);
    alert("📦 Pedido guardado correctamente.");
  }

  localStorage.setItem("pedidos", JSON.stringify(pedidosGuardados));
  mostrarPedidosGuardados();
}

function cargarPedidosGuardados() {
  const data = localStorage.getItem("pedidos");
  if (data) {
    pedidosGuardados = JSON.parse(data);
    mostrarPedidosGuardados();
  }
}
// mostrarPedidosGuardados
function mostrarPedidosGuardados() {
  const container = document.getElementById("pedidos-guardados");
  if (!container) {
    const nuevoDiv = document.createElement("div");
    nuevoDiv.id = "pedidos-guardados";
    nuevoDiv.style.marginTop = "2rem";
    document.getElementById("main-content").insertBefore(nuevoDiv, document.getElementById("pedido-area"));
  }

  const lista = pedidosGuardados.map((p, index) => `
    <div class="pedido-item">
      <button class="pedido-btn" onclick="verPedido(${index})">
        📁 ${p.fecha} - ${p.totalUnidades} unidades
      </button>
      <div class="acciones">
        <button class="icon-btn" onclick="editarPedido(${index})">✏️</button>
        <button class="icon-btn" onclick="eliminarPedido(${index})">🗑️</button>
      </div>
    </div>
  `).join("");

  document.getElementById("pedidos-guardados").innerHTML = `
    <h4>📁 Pedidos guardados:</h4>
    ${lista}
  `;
}

// ver pedido
function verPedido(index) {
  const p = pedidosGuardados[index];
  pedido = p.pedido;
  const cajas = Object.keys(pedido);
  cajaActual = cajas.length;

  document.getElementById("pedido-area").innerHTML = `
    <h3>📂 Pedido guardado del ${p.fecha}</h3>
    <button onclick="acabarPedido(false)">🔁 Ver informe</button>
    <div id="cajas"></div>
    <div id="informe" style="margin-top: 2rem;"></div>
  `;

  cajas.forEach((cajaId, i) => {
    const productos = pedido[cajaId];

    const cajaDiv = document.createElement("div");
    cajaDiv.className = "caja";
    cajaDiv.innerHTML = `
      <div class="Titulo_caja">
        <h3>Caja ${i + 1}</h3>
        <button onclick="editarCaja('${cajaId}')" class="icon-btn">✏️</button>
      </div>
      <div id="contenido-${cajaId}"></div>
    `;

    document.getElementById("cajas").appendChild(cajaDiv);

    const contenidoDiv = document.getElementById(`contenido-${cajaId}`);
    productos.forEach(({ asin, cantidad }) => {
      const p = document.createElement("p");
      p.textContent = `${cantidad} x ${asin}`;
      contenidoDiv.appendChild(p);
    });
  });
}

// editar pedido
function editarPedido(index) {
  const p = pedidosGuardados[index];
  pedido = p.pedido;
  editandoIndex = index;

  // Reiniciar el valor real
  cajaActual = 0;

  document.getElementById("pedido-area").innerHTML = `
    <button onclick="nuevaCaja()">Crear caja</button>
    <div id="cajas"></div>
    <button onclick="acabarPedido(true)" style="margin-top:2rem;">Actualizar pedido</button>
    <div id="informe"></div>
  `;

  Object.entries(pedido).forEach(([cajaId, productos], index) => {
    cajaActual++;
    const nuevaCajaId = "caja" + cajaActual;

    const cajaDiv = document.createElement("div");
    cajaDiv.className = "caja";
    cajaDiv.innerHTML = `
      <div class="Titulo_caja">
        <h3>Caja ${cajaActual}</h3>
        <button onclick="editarCaja('${nuevaCajaId}')" class="icon-btn">✏️</button>
      </div>
      <div id="contenido-${nuevaCajaId}"></div>
      <div class="input-line">
        <input type="number" min="1" placeholder="Cantidad" id="cantidad-${nuevaCajaId}" />
        <span>x</span>
        <input type="text" maxlength="4" placeholder="ASIN (últimos 4)" id="asin-${nuevaCajaId}" />
        <button onclick="agregarProducto('${nuevaCajaId}')">Agregar</button>
      </div>
      <hr/>
    `;
    document.getElementById("cajas").appendChild(cajaDiv);

    const contenidoDiv = document.getElementById(`contenido-${nuevaCajaId}`);
    productos.forEach(({ asin, cantidad }) => {
      const p = document.createElement("p");
      p.textContent = `${cantidad} x ${asin}`;
      contenidoDiv.appendChild(p);
    });

    // Renombrar la caja internamente para mantener coherencia
    delete pedido[cajaId];
    pedido[nuevaCajaId] = productos;
  });
}


function eliminarPedido(index) {
  if (!confirm("¿Seguro que quieres eliminar este pedido?")) return;
  pedidosGuardados.splice(index, 1);
  localStorage.setItem("pedidos", JSON.stringify(pedidosGuardados));
  mostrarPedidosGuardados();
  document.getElementById("pedido-area").innerHTML = "";
}

function descargarPedido(fecha) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;
  doc.setFontSize(16);
  doc.text("Informe de Pedido - Galileo Tools", 10, y);
  y += 10;
  doc.setFontSize(12);
  doc.text(`Fecha: ${fecha}`, 10, y);
  y += 10;

  // Resumen
  doc.text("Totales por ASIN:", 10, y);
  y += 7;

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

  for (let asin in resumen) {
    doc.text(`- ${asin}: ${resumen[asin]} unidades`, 15, y);
    y += 6;
  }

  y += 6;
  doc.text("Distribución por cajas:", 10, y);
  y += 7;

  // Encabezado
  const cajas = Object.keys(pedido);
  let header = "ASIN";
  for (let i = 1; i <= cajas.length; i++) {
    header += ` | Caja ${i}`;
  }
  doc.text(header, 10, y);
  y += 6;

  for (let asin in cajaResumen) {
    let row = asin;
    for (let i = 1; i <= cajas.length; i++) {
      const key = "caja" + i;
      row += ` | ${cajaResumen[asin][key] || 0}`;
    }
    doc.text(row, 10, y);
    y += 6;
    if (y > 280) {
      doc.addPage();
      y = 10;
    }
  }

  doc.save(`pedido-${fecha.replace(/[^\d]/g, "_")}.pdf`);
}

function editarCaja(cajaId) {
  const productos = pedido[cajaId];

  const contenidoDiv = document.getElementById(`contenido-${cajaId}`);
  contenidoDiv.innerHTML = ""; // limpiamos

  productos.forEach((producto, index) => {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = `
      <input type="number" value="${producto.cantidad}" id="edit-cantidad-${cajaId}-${index}" style="width: 60px;" />
      x
      <input type="text" value="${producto.asin}" id="edit-asin-${cajaId}-${index}" maxlength="4" style="width: 60px;" />
    `;

    contenidoDiv.appendChild(wrapper);
  });

  const guardarBtn = document.createElement("button");
  guardarBtn.textContent = "💾 Guardar cambios";
  guardarBtn.style.marginTop = "10px";
  guardarBtn.onclick = () => guardarCambiosCaja(cajaId, productos.length);

  contenidoDiv.appendChild(guardarBtn);
}

function guardarCambiosCaja(cajaId, total) {
  const nuevosProductos = [];

  for (let i = 0; i < total; i++) {
    const cantidad = parseInt(document.getElementById(`edit-cantidad-${cajaId}-${i}`).value);
    const asin = document.getElementById(`edit-asin-${cajaId}-${i}`).value.trim().toUpperCase();

    if (!cantidad || !asin || asin.length !== 4) {
      alert("Todos los productos deben tener una cantidad válida y un ASIN de 4 letras.");
      return;
    }

    nuevosProductos.push({ asin, cantidad });
  }

  // Actualiza la caja
  pedido[cajaId] = nuevosProductos;

  // Vuelve a mostrar los productos de forma normal
  const contenidoDiv = document.getElementById(`contenido-${cajaId}`);
  contenidoDiv.innerHTML = "";

  nuevosProductos.forEach(producto => {
    const p = document.createElement("p");
    p.textContent = `${producto.cantidad} x ${producto.asin}`;
    contenidoDiv.appendChild(p);
  });

}

