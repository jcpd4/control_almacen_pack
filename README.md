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

# Otro dia Martes 9 de Septiembre 2025
## 🚀 Funcionalidades
- Doble verificación y advertencias: Cuando un producto sea escaneado, una pantalla de doble verificación mostrará su imagen, título y FNSKU para confirmar que es el correcto. Si un producto no se reconoce, se preguntará al usuario si desea crearlo en el momento. Además, la herramienta enviará una advertencia si se añade un producto que no está en la lista de preparación.

- Guardado en tiempo real: La información se guardará automáticamente en cada paso, permitiendo al usuario cerrar la aplicación y continuar su trabajo más tarde sin perder ningún dato.
- Gestión de pedidos en la nube: Los usuarios podrán registrarse con su cuenta de Google. Cada cuenta tendrá su propio apartado de productos e historial, el cual será accesible desde cualquier dispositivo.

- Reportes mejorados: El PDF final será más claro y estético. Incluirá un recuento de FNSKUs distintos para verificar que coincidan con la lista de preparación, y los productos se mostrarán en una tabla ordenada de mayor a menor según sus unidades.

- Cálculo de peso: La herramienta calculará el peso total de cada caja. Si se añade un producto sin peso definido, la caja mostrará el mensaje "peso no disponible".

- Visualización optimizada: La tabla de productos tendrá un diseño mejorado para una lectura más cómoda.

## 🛠 Mejoras Futuras
- Lista de preparación inteligente: Se creará un nuevo apartado donde el usuario pueda ingresar FNSKUs y unidades. La herramienta mostrará una lista con los títulos, fotos y un enlace a un PDF imprimible para la preparación.

- Sugerencia de cajas: En base al peso y prioridad de los productos, la herramienta ofrecerá sugerencias sobre la distribución ideal en las cajas.

- Exportación de datos: Se añadirá la opción de exportar los datos a otros formatos como Excel o CSV.

- Integración con Amazon: Se explorará la posibilidad de integrar la herramienta directamente con Amazon Seller Central para una gestión más eficiente.