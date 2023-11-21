import static spark.Spark.*;
import com.google.gson.Gson;

public class AhorcadoServidor {
    private static final Gson gson = new Gson();

    public static void main(String[] args) {
        // ... (configuración del puerto y otras configuraciones)

        // Estructura para almacenar información de las partidas en curso
        Map<String, String[]> partidasEnCurso = new HashMap<>();

        // Manejo de solicitud para iniciar una nueva partida
        post("/iniciarPartida", (req, res) -> {
            // Parsea los datos enviados por el cliente
            Map<String, String> datosCliente = gson.fromJson(req.body(), Map.class);
            String nombreJugador = datosCliente.get("nombreJugador");

            // Genera un identificador único para la partida
            String identificadorPartida = generarIdentificadorUnico();

            // Almacena la información de la partida en curso
            partidasEnCurso.put(identificadorPartida, new String[]{nombreJugador, null});

            // Muestra la lista de partidas en curso en el terminal
            mostrarPartidasEnCurso(partidasEnCurso);

            // Retorna el identificador de la partida al cliente
            return identificadorPartida;
        });

        // Manejo de solicitud para unirse a una partida existente
        post("/unirsePartida", (req, res) -> {
            // Parsea los datos enviados por el cliente
            Map<String, String> datosCliente = gson.fromJson(req.body(), Map.class);
            String nombreJugador = datosCliente.get("nombreJugador");

            // Lógica para unirse a una partida existente usando el identificador proporcionado
            String identificadorPartida = req.body();
            String[] participantes = partidasEnCurso.get(identificadorPartida);

            // Verifica si la partida existe y hay espacio para otro jugador
            if (participantes != null && participantes[1] == null) {
                participantes[1] = nombreJugador;

                // Muestra la lista de partidas en curso en el terminal
                mostrarPartidasEnCurso(partidasEnCurso);

                // Retorna un mensaje de éxito al cliente
                return "Unido a la partida " + identificadorPartida;
            } else {
                // Retorna un mensaje de error al cliente
                return "La partida no existe o está llena.";
            }
        });
    }

    private static String generarIdentificadorUnico() {
        // Lógica para generar un identificador único
        return "ID_" + System.currentTimeMillis();
    }

    private static void mostrarPartidasEnCurso(Map<String, String[]> partidasEnCurso) {
        // Muestra la lista de partidas en curso en el terminal
        System.out.println("Partidas en Curso:");
        for (Map.Entry<String, String[]> entry : partidasEnCurso.entrySet()) {
            String identificadorPartida = entry.getKey();
            String[] participantes = entry.getValue();
            System.out.println(identificadorPartida + ": " + participantes[0] + " vs " + participantes[1]);
        }
        System.out.println();
    }
}
