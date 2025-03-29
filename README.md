# 📦 PACKLIST Amazon Box Tool

Herramienta web interactiva para crear, editar y gestionar pedidos de Amazon con múltiples cajas. Diseñada para facilitar la preparación de envíos con múltiples unidades y productos, esta herramienta permite escanear productos mediante código QR o ingresar FNSKUs manualmente. Genera informes visuales y descargables en PDF con la distribución exacta de productos por caja, SKU, ASIN y más.

---

## 🚀 Funcionalidades

- 📦 Crear pedidos de Amazon divididos en cajas.
- ➕ Añadir productos escaneando el código (FNSKU) o ingresando los 4 últimos caracteres.
- 📤 Escanear códigos usando la cámara del dispositivo (HTML5 QR Scanner).
- 🔍 Autocompletado de datos a partir del JSON de productos.
- 🧾 Generación automática de informes con SKU, ASIN y cantidades.
- 🗃️ Visualización por caja y resumen total por FNSKU.
- ✏️ Edición dinámica de productos dentro de cada caja.
- 💾 Guardado local de pedidos mediante `localStorage`.
- 📂 Visualización y gestión de pedidos anteriores.
- 📄 Exportación de pedidos como archivos PDF listos para impresión.
- 🗑️ Eliminación y edición de pedidos guardados.

---

## 🖥️ Demo

🚧 Netlify --> https://rainbow-treacle-08fec2.netlify.app/


---

## 📂 Estructura del proyecto

```
📁 /data
   └── asins.json           → Base de datos de productos (FNSKU, SKU, ASIN)

📁 /scripts 
   └── herramienta1.js          → logica de la herramienta
   └── main.js                  → main


📁 /pages
   └── herramienta1.html          → Esqueleto de la página de crear pedido para amazon

📁 /styles
   └── styles.css           → Estilos personalizados

📄 index.html               → Página principal de la app
📄 README.md                → Este documento
```

---

## ⚙️ Cómo usarlo localmente

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tuusuario/packlist-amazon-tool.git
   ```

2. Abre la carpeta del proyecto en tu editor de código.

3. Lanza un servidor local (por ejemplo con Live Server de VSCode, o con Python):
   ```bash
   npx serve .
   # o con Python
   python3 -m http.server
   ```

4. Abre tu navegador y accede a:
   ```
   http://localhost:3000
   ```

⚠️ **Importante:** No abras el archivo `index.html` directamente con `file://`, ya que el navegador bloqueará la carga del archivo JSON por seguridad (CORS).

---

## 🔎 Estructura esperada del archivo `asins.json`

```json
{
  "B0BPTRBJDW": {
    "ultimos4": "H2KJ",
    "sku": "PACKLIST Planning Menu FR",
    "codigoInterno": "X001OPH2KJ",
    "peso": 0 // aquí tendremos que poner los pesos
  }
}
```

Este archivo es esencial para que la herramienta pueda autocompletar datos como el SKU y el ASIN a partir del código escaneado o ingresado.

---

## 📸 Capturas de pantalla

> Agrega aquí imágenes si lo deseas, por ejemplo:

```
screenshots/
  └── crear_caja.png
  └── informe_generado.png
  └── escaneo.png
```

```markdown
![Crear Caja](./screenshots/crear_caja.png)
![Informe](./screenshots/informe_generado.png)
```

---

## 🔧 Tecnologías utilizadas

- HTML + CSS + JavaScript
- [jsPDF](https://github.com/parallax/jsPDF) – generación de PDFs
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) – escaneo de códigos QR
- `localStorage` – almacenamiento de pedidos guardados en el navegador

---

## 🧠 Lógica destacada

- Se puede agregar un producto escaneando los **10 caracteres completos** del código interno (FNSKU).
- El sistema extrae automáticamente los **últimos 4 caracteres** para buscar coincidencias en `asins.json`.
- Si hay coincidencia, completa automáticamente el SKU, ASIN y nombre del producto.
- Si no hay coincidencia, se usa el código tal como fue introducido.

---

## 🛠 Mejoras futuras

- 🗃️ Exportar a Excel o CSV
- ☁️ Guardado en la nube con login y autenticación
- 📦 Cálculo automático del peso total por caja
- 🔗 Integración con Amazon Seller Central

---

## 🧑‍💻 Desarrollado por

Juan Carlos Ponce de León Ruiz – [GitHub](https://github.com/tuusuario)  
Packlist © 2025

---

## 📄 Licencia

MIT License