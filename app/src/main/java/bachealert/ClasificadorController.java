package bachealert;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ClasificadorController {

    private final Clasificador clasificador;

    // Spring ve que necesitamos un Clasificador y nos pasa el que ya creó
    public ClasificadorController(Clasificador clasificador) {
        this.clasificador = clasificador;
    }

    // Puerta: POST /api/clasificar, con una foto en el campo "foto"
    @PostMapping("/clasificar")
    public ResponseEntity<?> clasificar(@RequestParam("foto") MultipartFile foto) {
        try {
            Clasificador.Resultado r = clasificador.clasificar(foto.getBytes());
            return ResponseEntity.ok(Map.of(
                "esBache", r.esBache(),
                "probBache", Math.round(r.probBache() * 1000) / 10.0,
                "probNoBache", Math.round(r.probNoBache() * 1000) / 10.0
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "No se pudo procesar la imagen"));
        }
    }
}
