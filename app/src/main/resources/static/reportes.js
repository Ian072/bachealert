const lista = document.getElementById("lista");

async function cargarReportes() {
  try {
    const respuesta = await fetch("/api/reportes");
    const reportes = await respuesta.json();

    if (reportes.length === 0) {
      lista.innerHTML = '<p class="vacio">Todavía no hay reportes.</p>';
      return;
    }

    // Más recientes primero
    reportes.sort((a, b) => b.id - a.id);

    lista.innerHTML = reportes.map(r => `
      <article class="reporte tarjeta" style="padding: 0;">
        <img src="/api/fotos/${r.rutaFoto}" alt="Foto del reporte ${r.id}">
        <div class="cuerpo">
          <strong>Reporte #${r.id}</strong>
          <p class="meta">📍 ${r.ubicacion || "Sin ubicación"}</p>
          <p class="meta">📝 ${r.descripcion || "Sin descripción"}</p>
          <p class="meta">🕒 ${formatearFecha(r.fecha)} · Confianza ${r.probBache}%</p>
        </div>
      </article>
    `).join("");
  } catch (e) {
    lista.innerHTML = '<p class="vacio">No se pudieron cargar los reportes.</p>';
  }
}

function formatearFecha(iso) {
  return new Date(iso).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
}

cargarReportes();
