package bachealert;

import ai.onnxruntime.OnnxTensor;
import ai.onnxruntime.OrtEnvironment;
import ai.onnxruntime.OrtException;
import ai.onnxruntime.OrtSession;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Map;

@Service
public class Clasificador {

    // Mismos números que en Colab. Deben ser idénticos.
    static final float[] MEDIA = {0.485f, 0.456f, 0.406f};
    static final float[] DESV  = {0.229f, 0.224f, 0.225f};
    static final String RUTA_MODELO = "modelo/bachealert.onnx";

    private OrtEnvironment env;
    private OrtSession sesion;
    private String nombreEntrada;

    // Lo que devuelve el clasificador: dos porcentajes y el veredicto
    public record Resultado(float probNoBache, float probBache, boolean esBache) {}

    // Se ejecuta UNA vez, al arrancar el servidor: carga el modelo en memoria
    @PostConstruct
    void cargarModelo() throws OrtException {
        env = OrtEnvironment.getEnvironment();
        sesion = env.createSession(RUTA_MODELO, new OrtSession.SessionOptions());
        nombreEntrada = sesion.getInputNames().iterator().next();
    }

    // Se ejecuta al apagar el servidor: libera el modelo
    @PreDestroy
    void cerrar() throws OrtException {
        if (sesion != null) sesion.close();
    }

    // Recibe los bytes de una foto y responde. Se llama cada vez que llega una foto.
    public Resultado clasificar(byte[] bytesFoto) throws IOException, OrtException {
        float[][][][] entrada = prepararImagen(bytesFoto);

        try (OnnxTensor tensor = OnnxTensor.createTensor(env, entrada);
             OrtSession.Result resultado = sesion.run(Map.of(nombreEntrada, tensor))) {

            float[][] salida = (float[][]) resultado.get(0).getValue();
            float[] probs = softmax(salida[0]);
            return new Resultado(probs[0], probs[1], probs[1] > 0.5f);
        }
    }

    // Igual que antes, pero ahora recibe bytes en vez de una ruta de archivo
    static float[][][][] prepararImagen(byte[] bytes) throws IOException {
        BufferedImage original = ImageIO.read(new ByteArrayInputStream(bytes));
        if (original == null) {
            throw new IllegalArgumentException("El archivo no es una imagen válida");
        }

        BufferedImage img = new BufferedImage(224, 224, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = img.createGraphics();
        g.drawImage(original, 0, 0, 224, 224, null);
        g.dispose();

        float[][][][] datos = new float[1][3][224][224];
        for (int y = 0; y < 224; y++) {
            for (int x = 0; x < 224; x++) {
                int rgb = img.getRGB(x, y);
                int r  = (rgb >> 16) & 0xFF;
                int gr = (rgb >> 8) & 0xFF;
                int b  = rgb & 0xFF;
                datos[0][0][y][x] = (r  / 255f - MEDIA[0]) / DESV[0];
                datos[0][1][y][x] = (gr / 255f - MEDIA[1]) / DESV[1];
                datos[0][2][y][x] = (b  / 255f - MEDIA[2]) / DESV[2];
            }
        }
        return datos;
    }

    static float[] softmax(float[] v) {
        float max = Math.max(v[0], v[1]);
        float e0 = (float) Math.exp(v[0] - max);
        float e1 = (float) Math.exp(v[1] - max);
        float suma = e0 + e1;
        return new float[]{e0 / suma, e1 / suma};
    }
}