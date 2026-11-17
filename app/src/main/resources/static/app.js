// Busca los elementos de la página por su id
const formulario = document.getElementById("formulario");
const inputFoto = document.getElementById("foto");
const vistaPrevia = document.getElementById("vista-previa");
const resultado = document.getElementById("resultado");
const boton = document.getElementById("boton");

// Cuando el usuario elige una foto, la mostramos antes de enviarla
inputFoto.addEventListener("change", () => {
  const archivo = inputFoto.files[0];
  if (!archivo) return;
  vistaPrevia.src = URL.createObjectURL(archivo);
  vistaPrevia.hidden = false;
});

// Cuando el usuario da clic en "Enviar reporte"
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();   // evita que el navegador recargue la página

  boton.disabled = true;
  boton.textContent = "Analizando...";
  resultado.hidden = true;

  // FormData empaqueta los campos del formulario igual que lo hacía curl -F
  const datos = new FormData(formulario);

  try {
    const respuesta = await fetch("/api/clasificar", { method: "POST", body: datos });
    const json = await respuesta.json();

    if (!respuesta.ok) {
      mostrar("error", json.error || "Ocurrió un error.");
    } else if (json.esBache) {
      mostrar("ok", `✅ ${json.mensaje}<br>Confianza del modelo: ${json.probBache}% · Reporte #${json.reporteId}`);
      formulario.reset();
      vistaPrevia.hidden = true;
    } else {
      mostrar("rechazo", `⚠️ ${json.mensaje}<br>Probabilidad de bache: ${json.probBache}%`);
    }
  } catch (e) {
    mostrar("error", "No se pudo conectar con el servidor.");
  } finally {
    boton.disabled = false;
    boton.textContent = "Enviar reporte";
  }
});

function mostrar(tipo, html) {
  resultado.className = tipo;
  resultado.innerHTML = html;
  resultado.hidden = false;
}
