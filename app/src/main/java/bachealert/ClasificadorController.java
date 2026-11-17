package bachealert;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ClasificadorController {

    private final Clasificador clasificador;
    private final ReporteRepository repositorio;

    // Spring inyecta las dos piezas
    public ClasificadorController(Clasificador clasificador, ReporteRepository repositorio) {
        this.clasificador = clasificador;
        this.repositorio = repositorio;
    }

    @PostMapping("/clasificar")
    public ResponseEntity<?> clasificar(
            @RequestParam("foto") MultipartFile foto,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam(value = "ubicacion", required = false) String ubicacion) {
        try {
            Clasificador.Resultado r = clasificador.clasificar(foto.getBytes());
            double probBache = Math.round(r.probBache() * 1000) / 10.0;

            Map<String, Object> respuesta = new LinkedHashMap<>();
            respuesta.put("esBache", r.esBache());
            respuesta.put("probBache", probBache);
            respuesta.put("probNoBache", Math.round(r.probNoBache() * 1000) / 10.0);

            if (r.esBache()) {
                String nombreArchivo = guardarFoto(foto);
                Reporte reporte = repositorio.save(
                        new Reporte(nombreArchivo, descripcion, ubicacion, probBache));
                respuesta.put("reporteId", reporte.getId());
                respuesta.put("mensaje", "Reporte registrado. Gracias.");
            } else {
                respuesta.put("mensaje", "La foto no parece mostrar un bache. No se registró reporte.");
            }
            return ResponseEntity.ok(respuesta);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "No se pudo procesar la imagen"));
        }
    }

    // Guarda la foto en la carpeta uploads/ con un nombre único y devuelve ese nombre
    private String guardarFoto(MultipartFile foto) throws IOException {
        Path carpeta = Paths.get("uploads");
        Files.createDirectories(carpeta);

        String original = foto.getOriginalFilename();
        String extension = (original != null && original.contains("."))
                ? original.substring(original.lastIndexOf('.'))
                : ".jpg";
        String nombre = UUID.randomUUID() + extension;

        foto.transferTo(carpeta.resolve(nombre).toAbsolutePath());
        return nombre;
    }
}
