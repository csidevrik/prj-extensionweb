window.addEventListener('activarSeleccionDocumentos', () => {
    const hoy = new Date();
    const elementos = document.querySelectorAll('.Nombre');
  
    elementos.forEach(el => {
      el.style.border = '2px dashed green';
    });
  
    const archivosRecientes = [];
  
    elementos.forEach(nombreEl => {
      const contenedor = nombreEl.closest('div');
      const fechaEl = contenedor.querySelector('.Fecha');
      const iconoDescarga = contenedor.querySelector('img');
  
      if (fechaEl && iconoDescarga) {
        const fechaTexto = fechaEl.textContent.trim();
        const fecha = new Date(fechaTexto);
        const diferenciaDias = Math.floor((hoy - fecha) / (1000 * 60 * 60 * 24));
  
        if (diferenciaDias <= 2) {
          const link = iconoDescarga.closest('a')?.href || iconoDescarga.src;
          if (link.match(/\.(pdf|zip|rar)$/i)) {
            archivosRecientes.push({
              nombre: nombreEl.textContent.trim(),
              url: link
            });
          }
        }
      }
    });
  
    archivosRecientes.forEach(item => {
      chrome.runtime.sendMessage({
        action: 'descargar',
        url: item.url,
        filename: item.nombre
      });
    });
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "activarSeleccion") {
      const hoy = new Date();
      const archivosRecientes = [];
  
      // Buscamos todos los íconos de descarga (flechas verdes)
      const iconos = Array.from(document.querySelectorAll("img"))
        .filter(img => img.src.includes("descargar") || img.src.includes("download") || img.alt.toLowerCase().includes("descargar"));
  
      iconos.forEach(icono => {
        const fila = icono.closest("tr");
        if (!fila) return;
  
        // Buscamos el nombre del archivo más cercano
        const filaText = fila.innerText;
        const nombreMatch = filaText.match(/Nombre Archivo:\s*(.+)/i);
        const fechaMatch = filaText.match(/Fecha:\s*([\d\-:\s]+)/i);
  
        const nombre = nombreMatch?.[1]?.trim();
        const fechaTexto = fechaMatch?.[1]?.trim();
  
        if (!nombre || !fechaTexto) return;
  
        const fecha = new Date(fechaTexto.replace(" ", "T"));
        if (isNaN(fecha)) return;
  
        const diferenciaDias = Math.floor((hoy - fecha) / (1000 * 60 * 60 * 24));
        if (diferenciaDias <= 2) {
          archivosRecientes.push({
            nombre,
            fecha: fecha.toISOString(),
            elemento: icono.closest("a") || icono
          });
        }
      });
  
      if (archivosRecientes.length === 0) {
        alert("❌ No se encontraron archivos recientes. XXX");
      } else {
        archivosRecientes.forEach(item => {
          console.log("📥 Descargando:", item.nombre);
          item.elemento.click(); // Simula el clic
        });
  
        alert(`✅ Se descargaron ${archivosRecientes.length} archivos recientes.`);
      }
    }
  });
  