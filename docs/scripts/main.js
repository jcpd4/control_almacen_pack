function loadTool(path) {
    fetch(path)
      .then(response => response.text())
      .then(html => {
        document.getElementById("main-content").innerHTML = html;
      })
      .catch(error => {
        console.error('Error cargando herramienta:', error);
      });
  }
  
  function goHome() {
    document.getElementById("main-content").innerHTML = `
      <h2>Bienvenido a Galileo Tools</h2>
      <p>Selecciona una herramienta desde el menú lateral.</p>
    `;
  }

  