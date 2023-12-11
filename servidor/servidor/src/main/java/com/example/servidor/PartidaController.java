
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
@RequestMapping("/api/partida")
@CrossOrigin(origins = "http://localhost:3000")
public class PartidaController {

    private List<Partida> partidasEnJuego = new ArrayList<>();
    private List<SocketIOClient> connectedClients = new ArrayList<>();
    private final SocketIOServer socketIoServer;
    private List<Character> errores = new ArrayList<>();

    public PartidaController() {
        Configuration config = new Configuration();
        config.setHostname("localhost");
        config.setPort(9090); // Puerto para la comunicación de Socket.IO

        socketIoServer = new SocketIOServer(config);

        socketIoServer.addConnectListener(new ConnectListener() {
            @Override
            public void onConnect(SocketIOClient client) {
                System.out.println("Cliente conectado: " + client.getSessionId().toString());
                connectedClients.add(client);
            }
        });

        socketIoServer.addDisconnectListener(new DisconnectListener() {
            @Override
            public void onDisconnect(SocketIOClient client) {
                System.out.println("Cliente desconectado: " + client.getSessionId().toString());
                connectedClients.remove(client);
            }
        });

        socketIoServer.start();
    }

    private void printConnectedClients() {
        System.out.println("Clientes conectados:");
        for (SocketIOClient client : connectedClients) {
            System.out.println(client.getSessionId().toString());
        }
    }

    @GetMapping("/lista")
    public ResponseEntity<String> mensajeBienvenida() {
        try {
            return ResponseEntity.ok("¡Bienvenido!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar la solicitud");
        }
    }

    @PostMapping("/crear")
    public ResponseEntity<String> crearPartida(@RequestBody String nombreUsuario) {
        try {
            String identificadorGenerado = generarIdentificador();
            Partida nuevaPartida = new Partida(identificadorGenerado, nombreUsuario);
            partidasEnJuego.add(nuevaPartida);
            System.out.println("Partida Creada con ID: " + identificadorGenerado + " Actualmente hay: " + partidasEnJuego.size() + " partidas");
            return ResponseEntity.ok(identificadorGenerado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear la partida");
        }
    }

    @PostMapping("/unirse")
    public ResponseEntity<String> unirsePartida(@RequestBody Map<String, String> datos) {
        try {
            String nombreUsuario = datos.get("nombre");
            String identificadorPartida = datos.get("identificador");

            Partida partida = buscarPartidaPorIdentificador(identificadorPartida);

            if (partida != null) {
                partida.agregarUsuario(nombreUsuario);
                System.out.println(nombreUsuario + " se ha unido a la partida con ID: " + identificadorPartida);
                return ResponseEntity.ok("Te has unido a la partida");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Partida no encontrada");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al unirse a la partida");
        }
    }

    @PostMapping("/iniciar")
    public ResponseEntity<String> iniciarPartida(@RequestBody Map<String, String> datos) {
        try {
            String identificadorPartida = datos.get("identificador");
            String nombreUsuario = datos.get("nombreUsuario");

            Partida partida = buscarPartidaPorIdentificador(identificadorPartida);

            if (partida != null) {
                if (partida.numJugadors() >= 2) {
                    partida.setEstado(true);

                    // Enviar un evento de inicio de partida a todos los clientes conectados a esta partida
                    socketIoServer.getBroadcastOperations().sendEvent("partidaIniciada", identificadorPartida);
                    System.out.println("La partida con ID: " + identificadorPartida + " ha empezado!!!");
                    return ResponseEntity.ok("Partida iniciada");
                } else {
                    partida.setEstado(false);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Faltan jugadores");
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Partida no encontrada");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al iniciar la partida");
        }
    }

    @PostMapping("/letra")
    public ResponseEntity<String> handleEnviarLetra(@RequestBody Map<String, String> datos) {
        try {
            String identificadorPartida = datos.get("identificadorPartida");
            String letra = datos.get("letra");

            // Buscamos la partida con el identifiacdor que nos mandan
            Partida partida = buscarPartidaPorIdentificador(identificadorPartida);

            // Variables locales necesarias para evaluacion
            String direccion = "letra" + identificadorPartida;
            String direccion2 = "vidas" + identificadorPartida;
            String direccion3 = "fin" + identificadorPartida;
            String direccion4 = "error" + identificadorPartida;
            int vidas0 = partida.getVidas();

            // Aplicamos la funcion para ver si la letra es correcta
            int vidas = partida.adivinarLetra(letra.charAt(0));
            System.out.println("Los jugadores tiene: " + vidas + " vidas");
            
            // Enviar un evento de nueva letra a todos los clientes conectados a esta partida
            socketIoServer.getBroadcastOperations().sendEvent(direccion, partida.arrayToString());
            // Enviar un evento de vidas a todos los clientes conectados a esta partida
            socketIoServer.getBroadcastOperations().sendEvent(direccion2, vidas);

            if(vidas0 != vidas) {
                errores.add(letra.charAt(0));
                errores.add('-');
                socketIoServer.getBroadcastOperations().sendEvent(direccion4, errores);
            }
            if(partida.palabraAdivinada()){
                int partidaAcabada = 1;
                socketIoServer.getBroadcastOperations().sendEvent(direccion3, partidaAcabada);
                System.out.println("Se ha adivinado la PALABRA");
                // Reiniciar letrasErroneas cuando la partida termina en victoria
                errores.clear();
            }
            if(partida.getVidas() <= 0){
                int partidaAcabada = 2;
                socketIoServer.getBroadcastOperations().sendEvent(direccion3, partidaAcabada);
                System.out.println("Se ha PERDIDO la partida");
                // Reiniciar letrasErroneas cuando la partida termina en derrota)
                errores.clear();
            }

            System.out.println("Letra '" + letra + "' enviada a la partida con ID: " + identificadorPartida);
            
            return ResponseEntity.ok("Letra enviada con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al enviar la letra");
        }
    }

    @PostMapping("/palabra")
    public ResponseEntity<String> handleElegirPalabra(@RequestBody Map<String, String> datos) {
        try {
            String identificadorPartida = datos.get("identificadorPartida");
            String palabraAdivinar = datos.get("palabraAdivinar");

            Partida partida = buscarPartidaPorIdentificador(identificadorPartida);

            partida.setPalabraAdivinar(palabraAdivinar);

            String direccion = "palabraRecibida" + identificadorPartida;

            // Enviar un evento de nueva palabra a todos los clientes conectados a esta partida
            // Enviar un evento de inicio de partida a todos los clientes conectados a esta partida
            socketIoServer.getBroadcastOperations().sendEvent(direccion, palabraAdivinar.length());
            System.out.println("Palabra '" + palabraAdivinar + "' elegida en la partida con ID: " + identificadorPartida);
            printConnectedClients();
            return ResponseEntity.ok("Palabra elegida con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al elegir la palabra");
        }
    }

    private String generarIdentificador() {
        Random random = new Random();
        int numeroAleatorio = 100000 + random.nextInt(900000);
        return String.valueOf(numeroAleatorio);
    }

    private Partida buscarPartidaPorIdentificador(String identificador) {
        for (Partida partida : partidasEnJuego) {
            if (partida.getIdentificador().equals(identificador)) {
                return partida;
            }
        }
        return null;
    }

}
