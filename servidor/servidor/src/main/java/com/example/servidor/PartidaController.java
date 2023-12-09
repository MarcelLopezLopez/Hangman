// PartidaController.java
/* 
package com.example.servidor;

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
                if(partida.numJugadors() >= 2){
                    partida.setEstado(true);
                    // Llamar a la funcion que ejecuta la partida
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

    @PostMapping("/entrar")
    public ResponseEntity<String> entrarPartida(@RequestBody Map<String, String> datos) {
        try {
            String identificadorPartida = datos.get("identificador");
            String nombreUsuario = datos.get("nombreUsuario");

            Partida partida = buscarPartidaPorIdentificador(identificadorPartida);

            if (partida != null) {
                if(partida.getEstado() == true){
                    // Llamar a la funcion que ejecuta la partida
                    return ResponseEntity.ok("Partida iniciada");
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La partida no esta iniciada");
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Partida no encontrada");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al entrar la partida");
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
*/
package com.example.servidor;

import com.corundumstudio.socketio.*;
import com.corundumstudio.socketio.listener.ConnectListener;
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
    private final SocketIOServer socketIoServer;

    public PartidaController() {
        Configuration config = new Configuration();
        config.setHostname("localhost");
        config.setPort(9090); // Puerto para la comunicación de Socket.IO

        socketIoServer = new SocketIOServer(config);

        socketIoServer.addConnectListener(new ConnectListener() {
            @Override
            public void onConnect(SocketIOClient client) {
                System.out.println("Cliente conectado: " + client.getSessionId().toString());
            }
        });

        socketIoServer.start();
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

    @PostMapping("/entrar")
    public ResponseEntity<String> entrarPartida(@RequestBody Map<String, String> datos) {
        try {
            String identificadorPartida = datos.get("identificador");
            String nombreUsuario = datos.get("nombreUsuario");

            Partida partida = buscarPartidaPorIdentificador(identificadorPartida);

            if (partida != null) {
                if(partida.getEstado() == true){
                    // Llamar a la funcion que ejecuta la partida
                    return ResponseEntity.ok("Partida iniciada");
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La partida no esta iniciada");
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Partida no encontrada");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al entrar la partida");
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
