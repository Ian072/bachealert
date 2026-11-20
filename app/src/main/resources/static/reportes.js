const lista = document.getElementById("lista");
const contador = document.getElementById("contador");
const contadorNum = document.getElementById("contador-num");
const contadorTxt = document.getElementById("contador-txt");

// Íconos pequeños para cada dato de la tarjeta
const ICONO_LUGAR = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg>';
const ICONO_NOTA = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M4 4h16v12H7l-3 3V4Zm3 4v2h10V8H7Zm0 4v2h7v-2H7Z"/></svg>';
const ICONO_RELOJ = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 10.4 3.5 2.1-1 1.7L11 13V7h2v5.4Z"/></svg>';

async function cargarReportes() {
  try {
    const respuesta = await fetch("/api/reportes");
    if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
    const reportes = await respuesta.json();

    mostrarContador(reportes.length);

    if (reportes.length === 0) {
      lista.innerHTML = `
        <div class="vacio">
          <h2>Todavía no hay baches reportados</h2>
          <p>¿Viste uno en tu camino? Sé la primera persona en reportarlo.</p>
          <a class="boton-principal" href="index.html">Reportar un bache</a>
        </div>`;
      return;
    }

    // Más recientes primero
    reportes.sort((a, b) => b.id - a.id);

    lista.innerHTML = reportes.map(r => `
      <article class="reporte">
        <div class="reporte-foto">
          <img src="/api/fotos/${encodeURIComponent(r.rutaFoto)}" alt="Foto del bache del reporte ${r.id}" loading="lazy">
          <span class="insignia">IA: ${r.probBache}% bache</span>
        </div>
        <div class="reporte-cuerpo">
          <h3>Reporte #${r.id} <small>${tiempoRelativo(r.fecha)}</small></h3>
          <p class="dato principal">${ICONO_LUGAR}<span>${escapar(r.ubicacion) || "Sin ubicación"}</span></p>
          <p class="dato">${ICONO_NOTA}<span>${escapar(r.descripcion) || "Sin descripción"}</span></p>
          <p class="dato">${ICONO_RELOJ}<span>${formatearFecha(r.fecha)}</span></p>
        </div>
      </article>
    `).join("");
  } catch (e) {
    lista.innerHTML = `
      <div class="vacio">
        <h2>No pudimos cargar los reportes</h2>
        <p>Si la página estuvo inactiva, el servidor puede tardar un minuto en despertar. Recarga la página para intentarlo de nuevo.</p>
      </div>`;
  }
}

function mostrarContador(total) {
  contadorNum.textContent = total;
  contadorTxt.textContent = total === 1 ? "bache reportado" : "baches reportados";
  contador.hidden = false;
}

// El servidor guarda la hora en UTC sin indicarlo; agregamos la "Z"
// para que el navegador la convierta a la hora local de quien la ve
function aFecha(iso) {
  if (!iso) return null;
  const tieneZona = /Z|[+-]\d{2}:\d{2}$/.test(iso);
  const fecha = new Date(tieneZona ? iso : iso + "Z");
  return isNaN(fecha) ? null : fecha;
}

function formatearFecha(iso) {
  const fecha = aFecha(iso);
  return fecha ? fecha.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" }) : "Fecha desconocida";
}

function tiempoRelativo(iso) {
  const fecha = aFecha(iso);
  if (!fecha) return "";
  const minutos = Math.round((Date.now() - fecha) / 60000);
  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  if (minutos < 60) return rtf.format(-Math.max(minutos, 0), "minute");
  const horas = Math.round(minutos / 60);
  if (horas < 24) return rtf.format(-horas, "hour");
  return rtf.format(-Math.round(horas / 24), "day");
}

// Convierte el texto del usuario en texto seguro: <, >, & y comillas
// se muestran como caracteres y no se interpretan como HTML
function escapar(texto) {
  if (!texto) return "";
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

cargarReportes();
