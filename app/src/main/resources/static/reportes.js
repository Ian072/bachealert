const lista = document.getElementById("lista");
const contador = document.getElementById("contador");
const contadorNum = document.getElementById("contador-num");
const contadorTxt = document.getElementById("contador-txt");

// Íconos pequeños para cada dato de la tarjeta
const ICONO_LUGAR = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg>';
const ICONO_NOTA = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M4 4h16v12H7l-3 3V4Zm3 4v2h10V8H7Zm0 4v2h7v-2H7Z"/></svg>';
const ICONO_RELOJ = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 10.4 3.5 2.1-1 1.7L11 13V7h2v5.4Z"/></svg>';

// Guarda los reportes para volver a dibujarlos si cambia el idioma
let reportesCargados = null;

async function cargarReportes() {
  try {
    const respuesta = await fetch("/api/reportes");
    if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
    reportesCargados = await respuesta.json();
    // Más recientes primero
    reportesCargados.sort((a, b) => b.id - a.id);
    dibujar();
  } catch (e) {
    reportesCargados = null;
    lista.innerHTML = `
      <div class="vacio">
        <h2>${t("lista.errorTitulo")}</h2>
        <p>${t("lista.errorTexto")}</p>
      </div>`;
  }
}

function dibujar() {
  const reportes = reportesCargados;
  mostrarContador(reportes.length);

  if (reportes.length === 0) {
    lista.innerHTML = `
      <div class="vacio">
        <h2>${t("lista.vacioTitulo")}</h2>
        <p>${t("lista.vacioTexto")}</p>
        <a class="boton-principal" href="index.html">${t("lista.vacioBoton")}</a>
      </div>`;
    return;
  }

  lista.innerHTML = reportes.map(r => `
      <article class="reporte">
        <div class="reporte-foto">
          <img src="/api/fotos/${encodeURIComponent(r.rutaFoto)}" alt="${t("lista.fotoAlt", { id: r.id })}" loading="lazy">
          <span class="insignia">${t("lista.insignia", { p: r.probBache })}</span>
        </div>
        <div class="reporte-cuerpo">
          <h3>${t("lista.reporte", { id: r.id })} <small>${tiempoRelativo(r.fecha)}</small></h3>
          <p class="dato principal">${ICONO_LUGAR}<span>${escapar(r.ubicacion) || t("lista.sinUbicacion")}</span></p>
          <p class="dato">${ICONO_NOTA}<span>${escapar(r.descripcion) || t("lista.sinDescripcion")}</span></p>
          <p class="dato">${ICONO_RELOJ}<span>${formatearFecha(r.fecha)}</span></p>
        </div>
      </article>
  `).join("");
}

// Al cambiar de idioma, se vuelven a dibujar las tarjetas y el contador
alCambiarIdioma.push(() => {
  if (reportesCargados) dibujar();
  else if (lista.querySelector(".vacio")) cargarReportes();
});

function mostrarContador(total) {
  contadorNum.textContent = total;
  contadorTxt.textContent = t(total === 1 ? "lista.contadorUno" : "lista.contadorVarios");
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
  return fecha ? fecha.toLocaleString(region(), { dateStyle: "medium", timeStyle: "short" }) : t("lista.sinFecha");
}

function tiempoRelativo(iso) {
  const fecha = aFecha(iso);
  if (!fecha) return "";
  const minutos = Math.round((Date.now() - fecha) / 60000);
  const rtf = new Intl.RelativeTimeFormat(region(), { numeric: "auto" });
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
