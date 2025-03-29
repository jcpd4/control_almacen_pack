let pedido = {};
let cajaActual = 0;
let pedidosGuardados = [];
let editandoIndex = null;

//para escanear
let escaner;


// cargamos la variable del json puro
//⚠️ Importante
// Este método solo funciona si estás sirviendo la web desde un servidor local (como con Live Server de VS Code o Netlify). 
// Si estás abriendo el HTML desde file:///, fetch dará error por CORS o bloqueo de seguridad.

let asinData = {};

fetch('../data/asins.json')
.then(response => response.json())
.then(data => {
  asinData = data;
})
.catch(error => {
  console.error("Error cargando el JSON de ASINs:", error);
});


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
// nueva caja
function nuevaCaja() {
  cajaActual++;
  const cajaId = "caja" + cajaActual;
  pedido[cajaId] = [];

  const cajaDiv = document.createElement("div");
  cajaDiv.className = "caja";
  cajaDiv.innerHTML = `
    <div class="Titulo_caja">
      <h3>Caja ${cajaActual}</h3>
      <button onclick="editarCaja('${cajaId}')" class="icon-btn">✏️</button>
    </div>
    <div id="contenido-${cajaId}"></div>
    <div class="input-line">
      <input type="number" min="1" placeholder="Cantidad" id="cantidad-${cajaId}" />
      <span>x</span>
      <input type="text" maxlength="20" placeholder="FNSKU (últimos 4)" id="asin-${cajaId}" />
      <button onclick="escanearFnsku('${cajaId}')">📷 Escanear</button>
      <button onclick="agregarProducto('${cajaId}')">Agregar</button>
    </div>
    <hr/>
  `;

  document.getElementById("cajas").appendChild(cajaDiv);
}



// agregarProducto
function agregarProducto(cajaId) {
  const cantidad = parseInt(document.getElementById(`cantidad-${cajaId}`).value);
  let input = document.getElementById(`asin-${cajaId}`).value.trim().toUpperCase();

  if (!cantidad || !input) {
    alert("Por favor, introduce una cantidad válida");
    return;
  }

  // Si el input tiene más de 4 caracteres, nos quedamos con los últimos 4
  const ultimos4 = input.length > 4 ? input.slice(-4) : input;

  let fnskuCompleto = input;
  let asin = "";
  let sku = "";

  for (const [asinKey, data] of Object.entries(asinData)) {
    if (data.codigoInterno.slice(-4).toUpperCase() === ultimos4) {
      fnskuCompleto = data.codigoInterno;
      asin = asinKey;
      sku = data.sku;
      break;
    }
  }
  pedido[cajaId].push({ fnsku: fnskuCompleto, cantidad });

  const contenidoDiv = document.getElementById(`contenido-${cajaId}`);
  const p = document.createElement("p");
  p.innerHTML = `${cantidad} x <strong>${fnskuCompleto}</strong>` + 
    (sku && asin ? `<br><small>SKU: ${sku} | ASIN: ${asin}</small>` : '');
  contenidoDiv.appendChild(p);

  document.getElementById(`cantidad-${cajaId}`).value = "";
  document.getElementById(`asin-${cajaId}`).value = "";
}



// acabarPedido
function acabarPedido(modoEdicion = false) {
  const resumen = {};
  const cajaResumen = {};

  for (let [cajaId, productos] of Object.entries(pedido)) {
    for (let { fnsku, cantidad } of productos) {
      if (!resumen[fnsku]) resumen[fnsku] = 0;
      resumen[fnsku] += cantidad;

      if (!cajaResumen[fnsku]) cajaResumen[fnsku] = {};
      cajaResumen[fnsku][cajaId] = (cajaResumen[fnsku][cajaId] || 0) + cantidad;
    }
  }

  const fecha = new Date().toLocaleString();
  const totalUnidades = Object.values(resumen).reduce((acc, val) => acc + val, 0);

  let resultadoHTML = `<h3>🧾 Informe de Pedido - ${fecha}</h3>`;
  resultadoHTML += "<h4>Totales por FNSKU:</h4><ul>";
  for (let fnsku in resumen) {
    let extra = "";
    for (const [asin, data] of Object.entries(asinData)) {
      if (data.codigoInterno === fnsku) {
        extra = ` <small>(SKU: ${data.sku}, ASIN: ${asin})</small>`;
        break;
      }
    }
    resultadoHTML += `<li><strong>${fnsku}</strong>: ${resumen[fnsku]} unidades${extra}</li>`;
  }
  resultadoHTML += "</ul>";

  resultadoHTML += "<h4>Distribución por cajas:</h4><table border='1' cellspacing='0' cellpadding='5'><tr><th>FNSKU</th>";
  for (let i = 1; i <= cajaActual; i++) {
    resultadoHTML += `<th>Caja ${i}</th>`;
  }
  resultadoHTML += "</tr>";

  for (let fnsku in cajaResumen) {
    resultadoHTML += `<tr><td>${fnsku}</td>`;
    for (let i = 1; i <= cajaActual; i++) {
      const key = "caja" + i;
      resultadoHTML += `<td>${cajaResumen[fnsku][key] || 0}</td>`;
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
  } else {
    pedidosGuardados.push(nuevoPedido);
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
    productos.forEach(({ fnsku, cantidad }) => {
      const p = document.createElement("p");
      p.textContent = `${cantidad} x ${fnsku}`;
      contenidoDiv.appendChild(p);
    });
  });
}

// editar pedido
function editarPedido(index) {
  const p = pedidosGuardados[index];
  pedido = p.pedido;
  editandoIndex = index;

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
        <input type="text" placeholder="FNSKU (últimos 4)" id="asin-${nuevaCajaId}" />
        <button onclick="agregarProducto('${nuevaCajaId}')">Agregar</button>
      </div>
      <hr/>
    `;

    document.getElementById("cajas").appendChild(cajaDiv);

    const contenidoDiv = document.getElementById(`contenido-${nuevaCajaId}`);
    productos.forEach(({ fnsku, cantidad }) => {
      const p = document.createElement("p");
      p.textContent = `${cantidad} x ${fnsku}`;
      contenidoDiv.appendChild(p);
    });

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
// descargarPedido
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

  doc.text("Totales por FNSKU:", 10, y);
  y += 7;

  const resumen = {};
  const cajaResumen = {};

  for (let [cajaId, productos] of Object.entries(pedido)) {
    for (let { fnsku, cantidad } of productos) {
      if (!resumen[fnsku]) resumen[fnsku] = 0;
      resumen[fnsku] += cantidad;

      if (!cajaResumen[fnsku]) cajaResumen[fnsku] = {};
      cajaResumen[fnsku][cajaId] = (cajaResumen[fnsku][cajaId] || 0) + cantidad;
    }
  }

  for (let fnsku in resumen) {
    let extra = "";
    for (const [asin, data] of Object.entries(asinData)) {
      if (data.codigoInterno === fnsku) {
        extra = ` (SKU: ${data.sku}, ASIN: ${asin})`;
        break;
      }
    }
    doc.text(`- ${fnsku}: ${resumen[fnsku]} unidades${extra}`, 15, y);
    y += 6;
  }

  y += 6;
  doc.text("Distribución por cajas:", 10, y);
  y += 7;

  const cajas = Object.keys(pedido);
  let header = "FNSKU";
  for (let i = 1; i <= cajas.length; i++) {
    header += ` | Caja ${i}`;
  }
  doc.text(header, 10, y);
  y += 6;

  for (let fnsku in cajaResumen) {
    let row = fnsku;
    for (let i = 1; i <= cajas.length; i++) {
      const key = "caja" + i;
      row += ` | ${cajaResumen[fnsku][key] || 0}`;
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
      <input type="text" value="${producto.fnsku}" id="edit-asin-${cajaId}-${index}"  style="width: 60px;" />
    `;

    contenidoDiv.appendChild(wrapper);
  });

  const guardarBtn = document.createElement("button");
  guardarBtn.textContent = "💾 Guardar cambios";
  guardarBtn.style.marginTop = "10px";
  guardarBtn.onclick = () => guardarCambiosCaja(cajaId, productos.length);

  contenidoDiv.appendChild(guardarBtn);
}
// guardarCambiosCaja
function guardarCambiosCaja(cajaId, total) {
  const nuevosProductos = [];

  for (let i = 0; i < total; i++) {
    const cantidad = parseInt(document.getElementById(`edit-cantidad-${cajaId}-${i}`).value);
    const fnsku = document.getElementById(`edit-asin-${cajaId}-${i}`).value.trim().toUpperCase();

    // Si la cantidad es 0 o no válida, lo eliminamos (no se agrega)
    if (!cantidad || cantidad === 0) {
      continue;
    }

    nuevosProductos.push({ fnsku, cantidad });
  }

  // Actualiza la caja con productos válidos
  pedido[cajaId] = nuevosProductos;

  // Mostrar la caja de nuevo
  const contenidoDiv = document.getElementById(`contenido-${cajaId}`);
  contenidoDiv.innerHTML = "";

  nuevosProductos.forEach(producto => {
    // Buscar información del producto para mostrar el SKU y nombre
    let sku = "";
    let asin = "";
    for (const [key, data] of Object.entries(asinData)) {
      if (data.codigoInterno === producto.fnsku) {
        sku = data.sku;
        asin = key;
        break;
      }
    }

    const p = document.createElement("p");
    p.innerHTML = `${producto.cantidad} x <strong>${producto.fnsku}</strong>` + 
      (sku ? ` <br><small>SKU: ${sku} | ASIN: ${asin}</small>` : '');
    contenidoDiv.appendChild(p);
  });

  alert("✅ Cambios guardados correctamente.");
}

// Escanear fnsku
function escanearFnsku(cajaId) {
  document.getElementById("modal-escaner").style.display = "flex";

  escaner = new Html5Qrcode("lector");
  escaner.start(
    { facingMode: "environment" }, // cámara trasera
    {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    },
    qrCodeMessage => {
      document.getElementById(`asin-${cajaId}`).value = qrCodeMessage.trim().toUpperCase();
      escaner.stop().then(() => {
        document.getElementById("modal-escaner").style.display = "none";
        escaner.clear();
      });
    },
    errorMessage => {
      // Puedes mostrar errores si quieres
    }
  ).catch(err => {
    alert("No se pudo acceder a la cámara: " + err);
  });
}

function cerrarEscaner() {
  if (escaner) {
    escaner.stop().then(() => {
      escaner.clear();
      document.getElementById("modal-escaner").style.display = "none";
    });
  }
}



