package bachealert;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ReporteController {

    private final ReporteRepository repositorio;

    public ReporteController(ReporteRepository repositorio) {
        this.repositorio = repositorio;
    }

    // GET /api/reportes -> todos los reportes en JSON
    @GetMapping("/reportes")
    public List<Reporte> listar() {
        return repositorio.findAll();
    }

    // GET /api/fotos/{nombre} -> devuelve la imagen guardada en uploads/
    @GetMapping("/fotos/{nombre}")
    public ResponseEntity<byte[]> foto(@PathVariable String nombre) throws IOException {
        Path ruta = Paths.get("uploads").resolve(nombre).normalize();
        if (!ruta.startsWith(Paths.get("uploads")) || !Files.exists(ruta)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(Files.readAllBytes(ruta));
    }
}
