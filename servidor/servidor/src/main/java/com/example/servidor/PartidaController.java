
package com.example.servidor;

import com.corundumstudio.socketio.*;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DisconnectListener;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
// Direccion para realizar las solicitudes
@RequestMapping("/api/partida")
// Direccion orgen desde la cual se aceptaran solicitudes, en nuestro caso la direccion de la web de los clientes
@CrossOrigin(origins = "http://localhost:3000")
public class PartidaController {

    // ArrayList para guardar todas las partidas en juego
    private List<Partida> partidasEnJuego = new ArrayList<>();
    // ArrayList con todos los clientes conectados (los sockets)
    private List<SocketIOClient> connectedClients = new ArrayList<>();
    // Variable del servidor para poder manejar comunicacion
    private final SocketIOServer socketIoServer;

    public PartidaController() {
        // Seleccionamos la configuracion de nuestro servidor
        Configuration config = new Configuration();
        config.setHostname("localhost");
        // Puerto para la comunicación de Socket.IO
        config.setPort(9090);

        // Creamos el socket del servidor con la configuracion realizada
        socketIoServer = new SocketIOServer(config);

        // Añadimos los clientes que se conectan al servidor
        socketIoServer.addConnectListener(new ConnectListener() {
            @Override
            public void onConnect(SocketIOClient client) {
                System.out.println("Cliente conectado: " + client.getSessionId().toString());
                connectedClients.add(client);
            }
        });

        // Borramos los clientes que se desconectan del servidor
        socketIoServer.addDisconnectListener(new DisconnectListener() {
            @Override
            public void onDisconnect(SocketIOClient client) {
                System.out.println("Cliente desconectado: " + client.getSessionId().toString());
                connectedClients.remove(client);
            }
        });

        socketIoServer.start();
    }

    // Funcion para mostrar todos los clientes conectados
    private void printConnectedClients() {
        System.out.println("Clientes conectados:");
        for (SocketIOClient client : connectedClients) {
            System.out.println(client.getSessionId().toString());
        }
    }

    // Funcion que controla el crear una partida
    @PostMapping("/crear")
    public ResponseEntity<String> crearPartida(@RequestBody String nombreUsuario) {
        try {
            // Generamos un identificador de partida
            String identificadorGenerado = generarIdentificador();
            // Creamos una nueva partida con el identificador y el nombre del creador
            Partida nuevaPartida = new Partida(identificadorGenerado, nombreUsuario);
            // Añadimos la partida a la lista de partidas en juego
            partidasEnJuego.add(nuevaPartida);
            // Para hacer control mostramos por pamtalla el ID de la partida y el numero de partidas en juego
            System.out.println("Partida Creada con ID: " + identificadorGenerado + " Actualmente hay: " + partidasEnJuego.size() + " partidas");
            // Devolvemos un OK y el identifiacdor de la partida ya que la comunicacion ha sido correcta
            return ResponseEntity.ok(identificadorGenerado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear la partida");
        }
    }

    // Funcion que controla el unirse a una partida
    @PostMapping("/unirse")
    public ResponseEntity<String> unirsePartida(@RequestBody Map<String, String> datos) {
        try {
            // Recibimos los datos que se nos mandan
            String nombreUsuario = datos.get("nombre");
            String identificadorPartida = datos.get("identificador");

            // Buscamos si existe una partida con el identificador al que se quiere unir el usuario
            Partida partida = buscarPartidaPorIdentificador(identificadorPartida);

            // Si la partida existe:
            if (partida != null) {
                // Agregamos el nombre de usuario a la partida
                partida.agregarUsuario(nombreUsuario);
                // Mostramos por terminal un mensaje de control
                System.out.println(nombreUsuario + " se ha unido a la partida con ID: " + identificadorPartida);
                // Devolvemos un OK
                return ResponseEntity.ok("Te has unido a la partida");
            // Manjeo de errores
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Partida no encontrada");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al unirse a la partida");
        }
    }

    // Funcion que controla el inicio de una partida
    @PostMapping("/iniciar")
    public ResponseEntity<String> iniciarPartida(@RequestBody Map<String, String> datos) {
        try {
            // Recibimos los parametros que nos manda el usuario
            String identificadorPartida = datos.get("identificador");
            String nombreUsuario = datos.get("nombreUsuario");

            // Buscamos si la partida existe
            Partida partida = buscarPartidaPorIdentificador(identificadorPartida);

            // Si la partida existe:
            if (partida != null) {
                // Si el numero de jugadores es >= 2 podemos empezar, si es inferior solo esta el creador
                if (partida.numJugadors() >= 2) {
                    // Cambiamos el estado de la partida
                    partida.setEstado(true);
                    // Enviar un evento de inicio de partida a todos los clientes conectados a esta partida
                    socketIoServer.getBroadcastOperations().sendEvent("partidaIniciada", identificadorPartida);
                    // Mensaje de control por teminal
                    System.out.println("La partida con ID: " + identificadorPartida + " ha empezado!!!");
                    // Devolvemos un OK
                    return ResponseEntity.ok("Partida iniciada");
                } else {
                    // Caso en que solo esta el creador en la partida
                    partida.setEstado(false);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Faltan jugadores");
                }
            // Manejo de errores
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Partida no encontrada");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al iniciar la partida");
        }
    }

    // Funcion que controla cuando se elige una letra en una partida
    @PostMapping("/letra")
    public ResponseEntity<String> handleEnviarLetra(@RequestBody Map<String, String> datos) {
        try {
            // Recibimos los parametros del usuario
            String identificadorPartida = datos.get("identificadorPartida");
            String letra = datos.get("letra");

            // Buscamos la partida con el identifiacdor que nos mandan
            Partida partida = buscarPartidaPorIdentificador(identificadorPartida);

            // Variables locales necesarias para evaluacion, direcciones y numero de vidas al inicio del turno
            String direccion = "letra" + identificadorPartida;
            String direccion2 = "vidas" + identificadorPartida;
            String direccion3 = "fin" + identificadorPartida;
            String direccion4 = "error" + identificadorPartida;
            int vidas0 = partida.getVidas();

            // Aplicamos la funcion para ver si la letra es correcta y obtenemos el nuevo numero de vidas
            int vidas = partida.adivinarLetra(letra.charAt(0));
            // Mostrasmos mensaje de control por terminal
            System.out.println("Los jugadores tiene: " + vidas + " vidas");
            
            // Enviar un evento de nueva letra a todos los clientes conectados a esta partida
            socketIoServer.getBroadcastOperations().sendEvent(direccion, partida.arrayToString());
            // Enviar un evento de vidas a todos los clientes conectados a esta partida
            socketIoServer.getBroadcastOperations().sendEvent(direccion2, vidas);

            // Si el numero de vidas ha cambiado es que se ha perdido una vida
            if(vidas0 != vidas) {
                // Enviamos evento de perdida de vida y mandamos las letras erroneas
                socketIoServer.getBroadcastOperations().sendEvent(direccion4, partida.getErrores());
            }
            // Miramos si la palabra ha sido adivinada
            if(partida.palabraAdivinada()){
                // En caso correcto cambiamos el estado de la partida 1 = has ganado
                int partidaAcabada = 1;
                // Enviamos el evneto de fin de partida con el estado
                socketIoServer.getBroadcastOperations().sendEvent(direccion3, partidaAcabada);
                // Mensaje de control
                System.out.println("Se ha adivinado la PALABRA");
                // Reiniciar letrasErroneas cuando la partida termina en victoria
                partida.vaciarErrores();
            }
            // Miramos si se han agotado las vidas
            if(partida.getVidas() <= 0){
                // En caso correcto cambiamos el estado de la partida a 2 = has perdido
                int partidaAcabada = 2;
                // Enviamos evento de fin de partida con el estado
                socketIoServer.getBroadcastOperations().sendEvent(direccion3, partidaAcabada);
                // Mensaje de control por terminal
                System.out.println("Se ha PERDIDO la partida");
                // Reiniciar letrasErroneas cuando la partida termina en derrota)
                partida.vaciarErrores();
            }
            // Mensaje de control por terminal con la letra enviada
            System.out.println("Letra '" + letra + "' enviada a la partida con ID: " + identificadorPartida);
            // Responemos con un OK
            return ResponseEntity.ok("Letra enviada con éxito");
        // Manejo de errores
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al enviar la letra");
        }
    }

    // Funcion que controla cuando se elige la palabra ha adivinar en una partida
    @PostMapping("/palabra")
    public ResponseEntity<String> handleElegirPalabra(@RequestBody Map<String, String> datos) {
        try {
            // Recivimos los parametros del usuario
            String identificadorPartida = datos.get("identificadorPartida");
            String palabraAdivinar = datos.get("palabraAdivinar");

            // Buscamos la partida con el identificador que se nos pasa por parametro
            Partida partida = buscarPartidaPorIdentificador(identificadorPartida);

            // Hacemos un set en la palabra que se debe adivinar en la partida
            partida.setPalabraAdivinar(palabraAdivinar);

            // Creamos la vairable con la direccion a la que se enviaran los avisos
            String direccion = "palabraRecibida" + identificadorPartida;

            // Enviar un evento de nueva palabra a todos los clientes conectados a esta partida
            socketIoServer.getBroadcastOperations().sendEvent(direccion, palabraAdivinar.length());
            // Mensaje de control por terminal
            System.out.println("Palabra '" + palabraAdivinar + "' elegida en la partida con ID: " + identificadorPartida);
            // Mostramos los clientes conectados a la partida, tambien para el control
            printConnectedClients();
            // Responemos con un OK
            return ResponseEntity.ok("Palabra elegida con éxito");
        // Control de errores
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al elegir la palabra");
        }
    }

    // Funcion para generar un identificador de partida aleatorio
    private String generarIdentificador() {
        Random random = new Random();
        int numeroAleatorio = 100000 + random.nextInt(900000);
        return String.valueOf(numeroAleatorio);
    }

    // Funcion que busca si hay alguna partida en juego con el identificador que se pasa por parametro
    private Partida buscarPartidaPorIdentificador(String identificador) {
        for (Partida partida : partidasEnJuego) {
            if (partida.getIdentificador().equals(identificador)) {
                return partida;
            }
        }
        return null;
    }

}
