// ============================================================
// Idiomas de BacheAlert: español e inglés
// Cada texto tiene una clave; el HTML la marca con data-i18n
// y JavaScript la pide con t("clave").
// ============================================================

const TEXTOS = {
  es: {
    "nav.reportar": "Reportar",
    "nav.reportes": "Ver reportes",
    "nav.inicio": "BacheAlert, inicio",
    "nav.principal": "Principal",
    "idioma.grupo": "Idioma",
    "idioma.es": "Español",
    "idioma.en": "English",

    "inicio.titulo": "BacheAlert — Reporta un bache",
    "inicio.descripcion": "Toma una foto del bache, nuestra IA verifica que lo sea y el reporte queda registrado.",
    "inicio.h1": "Ese bache tiene los días contados.",
    "inicio.intro": "Tómale una foto y súbela aquí. Nuestra IA revisa que de verdad sea un bache y tu reporte queda registrado para que la ciudad lo vea. ¡Gracias por cuidar tus calles!",
    "pasos.aria": "Cómo funciona",
    "paso1.titulo": "Toma la foto",
    "paso1.texto": "Desde tu celular o tu computadora.",
    "paso2.titulo": "La IA la revisa",
    "paso2.texto": "En segundos confirma si es un bache.",
    "paso3.titulo": "Queda registrado",
    "paso3.texto": "Tu reporte aparece en la lista pública.",

    "form.titulo": "Reporta un bache",
    "form.fotoTitulo": "Toma o elige una foto",
    "form.fotoAyuda": "Que el bache se vea completo y con buena luz",
    "form.fotoAlt": "Foto que vas a reportar",
    "form.cambiar": "Cambiar foto",
    "form.faltaFoto": "Primero elige una foto del bache.",
    "form.ubicacion": "¿Dónde está?",
    "form.ubicacionEj": "Ej. Av. Tecnológico y Calle Ejército",
    "form.descripcion": "Cuéntanos más",
    "form.descripcionEj": "Ej. Es grande y está en el carril derecho",
    "form.opcional": "(opcional)",
    "form.enviar": "Enviar reporte",
    "form.revisando": "Revisando tu foto…",

    "res.okTitulo": "¡Listo! Tu reporte #{id} quedó registrado",
    "res.okTexto": "Gracias por ayudar a que tu ciudad tenga mejores calles.",
    "res.okMedidor": "Seguridad de que es un bache",
    "res.verTodos": "Ver todos los reportes",
    "res.noTitulo": "Mmm, esta foto no parece un bache",
    "res.noTexto": "No registramos el reporte. Prueba con una foto más cercana, con buena luz y donde el bache se vea completo.",
    "res.noMedidor": "Probabilidad de bache",
    "res.errorTitulo": "Algo salió mal",
    "res.errorImagen": "El archivo no es una imagen válida. Elige una foto en formato JPG o PNG.",
    "res.errorServidor": "No pudimos revisar la foto. Intenta de nuevo o prueba con otra imagen.",
    "res.errorConexion": "No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo; si la página estuvo inactiva, puede tardar un minuto en despertar.",

    "lista.titulo": "BacheAlert — Reportes de la ciudad",
    "lista.descripcion": "Todos los baches que la comunidad ha reportado y nuestra IA ha verificado.",
    "lista.h1": "Baches reportados",
    "lista.intro": "Cada foto de esta lista fue enviada por alguien como tú y verificada por nuestra IA.",
    "lista.contadorUno": "bache reportado",
    "lista.contadorVarios": "baches reportados",
    "lista.cargando": "Cargando reportes…",
    "lista.vacioTitulo": "Todavía no hay baches reportados",
    "lista.vacioTexto": "¿Viste uno en tu camino? Sé la primera persona en reportarlo.",
    "lista.vacioBoton": "Reportar un bache",
    "lista.errorTitulo": "No pudimos cargar los reportes",
    "lista.errorTexto": "Si la página estuvo inactiva, el servidor puede tardar un minuto en despertar. Recarga la página para intentarlo de nuevo.",
    "lista.reporte": "Reporte #{id}",
    "lista.insignia": "IA: {p}% bache",
    "lista.fotoAlt": "Foto del bache del reporte {id}",
    "lista.sinUbicacion": "Sin ubicación",
    "lista.sinDescripcion": "Sin descripción",
    "lista.sinFecha": "Fecha desconocida",

    "pie": "BacheAlert es un proyecto ciudadano hecho con Java, Spring Boot y un modelo de IA entrenado para reconocer baches."
  },

  en: {
    "nav.reportar": "Report",
    "nav.reportes": "View reports",
    "nav.inicio": "BacheAlert, home",
    "nav.principal": "Main",
    "idioma.grupo": "Language",
    "idioma.es": "Español",
    "idioma.en": "English",

    "inicio.titulo": "BacheAlert — Report a pothole",
    "inicio.descripcion": "Take a photo of the pothole, our AI checks that it is one, and your report is saved.",
    "inicio.h1": "That pothole's days are numbered.",
    "inicio.intro": "Snap a photo and upload it here. Our AI checks that it really is a pothole, and your report is saved so the whole city can see it. Thanks for looking after your streets!",
    "pasos.aria": "How it works",
    "paso1.titulo": "Take the photo",
    "paso1.texto": "From your phone or your computer.",
    "paso2.titulo": "The AI checks it",
    "paso2.texto": "In seconds it confirms whether it's a pothole.",
    "paso3.titulo": "It's on the record",
    "paso3.texto": "Your report shows up in the public list.",

    "form.titulo": "Report a pothole",
    "form.fotoTitulo": "Take or choose a photo",
    "form.fotoAyuda": "Make sure the whole pothole is visible and well lit",
    "form.fotoAlt": "Photo you are about to report",
    "form.cambiar": "Change photo",
    "form.faltaFoto": "Choose a photo of the pothole first.",
    "form.ubicacion": "Where is it?",
    "form.ubicacionEj": "E.g. Tecnológico Ave. and Ejército St.",
    "form.descripcion": "Tell us more",
    "form.descripcionEj": "E.g. It's big and it's in the right lane",
    "form.opcional": "(optional)",
    "form.enviar": "Send report",
    "form.revisando": "Checking your photo…",

    "res.okTitulo": "Done! Your report #{id} has been saved",
    "res.okTexto": "Thanks for helping your city get better streets.",
    "res.okMedidor": "Confidence that it's a pothole",
    "res.verTodos": "View all reports",
    "res.noTitulo": "Hmm, this photo doesn't look like a pothole",
    "res.noTexto": "We didn't save the report. Try a closer photo with good light where the whole pothole is visible.",
    "res.noMedidor": "Pothole probability",
    "res.errorTitulo": "Something went wrong",
    "res.errorImagen": "The file isn't a valid image. Choose a JPG or PNG photo.",
    "res.errorServidor": "We couldn't check the photo. Try again or use a different image.",
    "res.errorConexion": "We couldn't reach the server. Check your connection and try again; if the page has been idle, it may take a minute to wake up.",

    "lista.titulo": "BacheAlert — City reports",
    "lista.descripcion": "Every pothole the community has reported and our AI has verified.",
    "lista.h1": "Reported potholes",
    "lista.intro": "Every photo in this list was sent by someone like you and verified by our AI.",
    "lista.contadorUno": "pothole reported",
    "lista.contadorVarios": "potholes reported",
    "lista.cargando": "Loading reports…",
    "lista.vacioTitulo": "No potholes reported yet",
    "lista.vacioTexto": "Spotted one on your way? Be the first to report it.",
    "lista.vacioBoton": "Report a pothole",
    "lista.errorTitulo": "We couldn't load the reports",
    "lista.errorTexto": "If the page has been idle, the server may take a minute to wake up. Reload the page to try again.",
    "lista.reporte": "Report #{id}",
    "lista.insignia": "AI: {p}% pothole",
    "lista.fotoAlt": "Photo of the pothole in report {id}",
    "lista.sinUbicacion": "No location",
    "lista.sinDescripcion": "No description",
    "lista.sinFecha": "Unknown date",

    "pie": "BacheAlert is a community project built with Java, Spring Boot and an AI model trained to recognize potholes."
  }
};

// Formato regional para fechas y tiempos relativos
const REGION = { es: "es-MX", en: "en-US" };

// Idioma inicial: el que eligió la persona antes, o el de su navegador
let idioma = (() => {
  try {
    const guardado = localStorage.getItem("bachealert-idioma");
    if (guardado === "es" || guardado === "en") return guardado;
  } catch (e) { /* sin acceso a localStorage: seguimos con el del navegador */ }
  return (navigator.language || "es").toLowerCase().startsWith("en") ? "en" : "es";
})();

const alCambiarIdioma = [];

// Devuelve el texto de una clave en el idioma actual, con {variables} sustituidas
function t(clave, valores = {}) {
  const texto = TEXTOS[idioma][clave] ?? TEXTOS.es[clave] ?? clave;
  return texto.replace(/\{(\w+)\}/g, (_, v) => valores[v] ?? "");
}

function region() { return REGION[idioma]; }

// Aplica el idioma a todos los elementos marcados en el HTML
function traducirPagina() {
  document.documentElement.lang = idioma;
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  document.querySelectorAll("[data-i18n-alt]").forEach(el => { el.alt = t(el.dataset.i18nAlt); });
  document.querySelectorAll("[data-i18n-content]").forEach(el => { el.content = t(el.dataset.i18nContent); });
  const titulo = document.querySelector("title[data-i18n]");
  if (titulo) document.title = titulo.textContent;

  document.querySelectorAll(".idiomas button").forEach(b => {
    b.setAttribute("aria-pressed", String(b.dataset.idioma === idioma));
  });
}

function cambiarIdioma(nuevo) {
  if (nuevo === idioma || !TEXTOS[nuevo]) return;
  idioma = nuevo;
  try { localStorage.setItem("bachealert-idioma", nuevo); } catch (e) { /* no se pudo recordar, no pasa nada */ }
  traducirPagina();
  alCambiarIdioma.forEach(fn => fn());
}

document.querySelectorAll(".idiomas button").forEach(b => {
  b.addEventListener("click", () => cambiarIdioma(b.dataset.idioma));
});

traducirPagina();
