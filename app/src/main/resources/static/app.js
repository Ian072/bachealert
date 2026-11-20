// Busca los elementos de la página por su id
const formulario = document.getElementById("formulario");
const inputFoto = document.getElementById("foto");
const zonaFoto = document.getElementById("zona-foto");
const zonaVacia = document.getElementById("zona-vacia");
const vista = document.getElementById("vista");
const vistaPrevia = document.getElementById("vista-previa");
const avisoFoto = document.getElementById("aviso-foto");
const resultado = document.getElementById("resultado");
const boton = document.getElementById("boton");

// Tiempo mínimo que se muestra la animación de análisis (milisegundos),
// para que el usuario alcance a ver que su foto se está revisando
const ANALISIS_MINIMO = 1200;

// ---------- Vista previa de la foto ----------
function mostrarVistaPrevia(archivo) {
  if (!archivo) return;
  vistaPrevia.src = URL.createObjectURL(archivo);
  zonaVacia.hidden = true;
  vista.hidden = false;
  avisoFoto.hidden = true;
  resultado.hidden = true;
}

inputFoto.addEventListener("change", () => mostrarVistaPrevia(inputFoto.files[0]));

// En computadora también se puede arrastrar la foto a la zona
["dragenter", "dragover"].forEach(tipo =>
  zonaFoto.addEventListener(tipo, (e) => { e.preventDefault(); zonaFoto.classList.add("arrastrando"); }));
["dragleave", "drop"].forEach(tipo =>
  zonaFoto.addEventListener(tipo, () => zonaFoto.classList.remove("arrastrando")));
zonaFoto.addEventListener("drop", (e) => {
  e.preventDefault();
  const archivo = e.dataTransfer.files[0];
  if (!archivo || !archivo.type.startsWith("image/")) return;
  const dt = new DataTransfer();
  dt.items.add(archivo);
  inputFoto.files = dt.files;
  mostrarVistaPrevia(archivo);
});

// ---------- Enviar el reporte ----------
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();   // evita que el navegador recargue la página

  if (!inputFoto.files[0]) {
    avisoFoto.hidden = false;
    zonaVacia.focus();
    return;
  }

  ocupado(true);
  resultado.hidden = true;

  // FormData empaqueta los campos del formulario igual que lo hacía curl -F
  const datos = new FormData(formulario);
  const inicio = Date.now();

  try {
    const respuesta = await fetch("/api/clasificar", { method: "POST", body: datos });
    const json = await respuesta.json();
    await esperar(ANALISIS_MINIMO - (Date.now() - inicio));

    if (!respuesta.ok) {
      // 400 = el archivo no es una imagen; cualquier otro error = falla al procesar
      mostrarResultado({ tipo: "error", clave: respuesta.status === 400 ? "res.errorImagen" : "res.errorServidor" });
    } else if (json.esBache) {
      mostrarResultado({ tipo: "ok", id: json.reporteId, prob: json.probBache });
      formulario.reset();
      vista.hidden = true;
      zonaVacia.hidden = false;
    } else {
      mostrarResultado({ tipo: "rechazo", prob: json.probBache });
    }
  } catch (e) {
    await esperar(ANALISIS_MINIMO - (Date.now() - inicio));
    mostrarResultado({ tipo: "error", clave: "res.errorConexion" });
  } finally {
    ocupado(false);
  }
});

// ---------- Ayudantes ----------
function ocupado(si) {
  boton.disabled = si;
  boton.innerHTML = si ? `<span class="giro" aria-hidden="true"></span> ${t("form.revisando")}` : t("form.enviar");
  vista.classList.toggle("analizando", si);
}

function medidor(etiqueta, porcentaje) {
  const valor = Math.max(0, Math.min(100, Number(porcentaje) || 0));
  // El relleno empieza en 0 y crece hasta el valor para que se vea el avance
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const relleno = resultado.querySelector(".medidor-relleno");
    if (relleno) relleno.style.width = valor + "%";
  }));
  return `
    <div class="medidor">
      <div class="medidor-etiqueta"><span>${etiqueta}</span><span>${valor}%</span></div>
      <div class="medidor-barra" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${valor}" aria-label="${etiqueta}">
        <div class="medidor-relleno"></div>
      </div>
    </div>`;
}

// Guarda el último resultado para poder volver a dibujarlo si cambia el idioma
let ultimoResultado = null;

function mostrarResultado(datos, desplazar = true) {
  ultimoResultado = datos;
  let html;
  if (datos.tipo === "ok") {
    html = `
      <h3>${t("res.okTitulo", { id: datos.id })}</h3>
      <p>${t("res.okTexto")}</p>
      ${medidor(t("res.okMedidor"), datos.prob)}
      <div class="acciones"><a href="reportes.html">${t("res.verTodos")}</a></div>`;
  } else if (datos.tipo === "rechazo") {
    html = `
      <h3>${t("res.noTitulo")}</h3>
      <p>${t("res.noTexto")}</p>
      ${medidor(t("res.noMedidor"), datos.prob)}`;
  } else {
    html = `<h3>${t("res.errorTitulo")}</h3><p>${escapar(t(datos.clave))}</p>`;
  }
  resultado.className = "resultado " + datos.tipo;
  resultado.innerHTML = html;
  resultado.hidden = false;
  if (desplazar) resultado.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Al cambiar de idioma, se traducen el botón y el resultado que esté en pantalla
alCambiarIdioma.push(() => {
  if (!boton.disabled) boton.textContent = t("form.enviar");
  if (ultimoResultado && !resultado.hidden) mostrarResultado(ultimoResultado, false);
});

function esperar(ms) {
  return new Promise(r => setTimeout(r, Math.max(0, ms)));
}

// Convierte texto en texto seguro para insertarlo como HTML
function escapar(texto) {
  if (!texto) return "";
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
