package bachealert;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

// Cada objeto Reporte es una fila en la tabla "reporte" de la base de datos
@Entity
public class Reporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;              // lo asigna la base de datos: 1, 2, 3...

    private String rutaFoto;      // nombre del archivo guardado en uploads/
    private String descripcion;   // texto opcional del usuario
    private String ubicacion;     // texto opcional del usuario
    private double probBache;     // qué tan seguro estaba el modelo
    private LocalDateTime fecha;  // cuándo se hizo el reporte

    // JPA necesita un constructor vacío para reconstruir objetos desde la tabla
    public Reporte() {}

    public Reporte(String rutaFoto, String descripcion, String ubicacion, double probBache) {
        this.rutaFoto = rutaFoto;
        this.descripcion = descripcion;
        this.ubicacion = ubicacion;
        this.probBache = probBache;
        this.fecha = LocalDateTime.now();
    }

    // Getters: Spring los usa para convertir el objeto a JSON en B6
    public Long getId() { return id; }
    public String getRutaFoto() { return rutaFoto; }
    public String getDescripcion() { return descripcion; }
    public String getUbicacion() { return ubicacion; }
    public double getProbBache() { return probBache; }
    public LocalDateTime getFecha() { return fecha; }
}
