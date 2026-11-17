package bachealert;

import org.springframework.data.jpa.repository.JpaRepository;

// Spring genera la implementación: save, findAll, findById, delete...
public interface ReporteRepository extends JpaRepository<Reporte, Long> {
}
