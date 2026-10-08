package bachealert;

import ai.onnxruntime.OnnxTensor;
import ai.onnxruntime.OrtEnvironment;
import ai.onnxruntime.OrtSession;
import javax.imageio.ImageIO;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.Map;

public class Clasificador {

    // Los mismos números que usamos en Colab (Normalize). Deben ser idénticos.
    static final float[] MEDIA = {0.485f, 0.456f, 0.406f};
    static final float[] DESV  = {0.229f, 0.224f, 0.225f};

    public static void main(String[] args) throws Exception {
        if (args.length < 1) {
            System.out.println("Uso: mvn exec:java -Dexec.args=\"fotos/mi_foto.jpg\"");
            return;
        }
        String rutaFoto = args[0];
        String rutaModelo = "modelo/bachealert.onnx";

        // 1. Convertir la foto en números, igual que lo hacía transform() en Colab
        float[][][][] entrada = prepararImagen(rutaFoto);

        // 2. Abrir el modelo y pasarle la foto
        try (OrtEnvironment env = OrtEnvironment.getEnvironment();
             OrtSession sesion = env.createSession(rutaModelo, new OrtSession.SessionOptions());
             OnnxTensor tensor = OnnxTensor.createTensor(env, entrada)) {

            String nombreEntrada = sesion.getInputNames().iterator().next();
            try (OrtSession.Result resultado = sesion.run(Map.of(nombreEntrada, tensor))) {

                // 3. Leer la respuesta: 2 números crudos, uno por clase
                float[][] salida = (float[][]) resultado.get(0).getValue();
                float[] probs = softmax(salida[0]);

                System.out.printf("No bache: %.1f%%%n", probs[0] * 100);
                System.out.printf("Bache:    %.1f%%%n", probs[1] * 100);
                System.out.println("Veredicto: " + (probs[1] > 0.5 ? "ES BACHE" : "NO ES BACHE"));
            }
        }
    }

    // Hace lo mismo que Resize + ToTensor + Normalize en Colab
    static float[][][][] prepararImagen(String ruta) throws Exception {
        BufferedImage original = ImageIO.read(new File(ruta));

        // Redimensionar a 224x224
        BufferedImage img = new BufferedImage(224, 224, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = img.createGraphics();
        g.drawImage(original, 0, 0, 224, 224, null);
        g.dispose();

        // Forma [1][3][224][224]: 1 foto, 3 canales (R,G,B), 224 filas, 224 columnas
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

    // Convierte los 2 números crudos en porcentajes que suman 100%
    static float[] softmax(float[] v) {
        float max = Math.max(v[0], v[1]);
        float e0 = (float) Math.exp(v[0] - max);
        float e1 = (float) Math.exp(v[1] - max);
        float suma = e0 + e1;
        return new float[]{e0 / suma, e1 / suma};
    }
}
