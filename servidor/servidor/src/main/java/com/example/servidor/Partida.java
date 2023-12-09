// Partida.java
package com.example.servidor;

import java.util.ArrayList;
import java.util.List;

public class Partida {
    // Variable con el identificador de la partida
    private String identificador;
    // Lista con todos los nombres de los usuarios conectados a la partida
    private List<String> nombresUsuarios;
    // Boolean para saber si la partida esta iniciada o solo creada
    private boolean iniciada;
    // Variable para guardar la palabara a adivinar
    private String palabraAdivinar;
    // Lista de char para saber que letras han sido adivinadas
    private List<Character> letrasAdivinadas;

    // Constructor, getters y setters
    public Partida(String identificador, String primerUsuario) {
        this.identificador = identificador;
        this.nombresUsuarios = new ArrayList<>();
        this.nombresUsuarios.add(primerUsuario);
        this.iniciada = false;
        this.palabraAdivinar = null;
        this.letrasAdivinadas = new ArrayList<>();
    }

    public String getPalabraAdivinar() {
        return palabraAdivinar;
    }

    public void setPalabraAdivinar(String palabra){
        this.palabraAdivinar = palabra;
    }

    public List<Character> getLetrasAdivinadas() {
        return letrasAdivinadas;
    }

    public boolean getEstado(){
        return iniciada;
    }

    public void setEstado(boolean estado){
        this.iniciada = estado;
    }
    
    public String getIdentificador() {
        return identificador;
    }

    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }

    public List<String> getNombreUsuarios() {
        return nombresUsuarios;
    }

    public void agregarUsuario(String nombreUsuario) {
        this.nombresUsuarios.add(nombreUsuario);
    }

    public int numJugadors(){
        return this.nombresUsuarios.size();
    }

    public boolean adivinarLetra(char letra) {
        // Lógica para verificar si la letra está en la palabra, indexOf devuleve la primera aparicion de letra en palabraAdivinar
        // CUIDADO, NO SABEMOS SI APARECE DOS VECES
        int pos = palabraAdivinar.indexOf(letra);
        // Si la letra no se encunetra en la lista acierto valdra false
        boolean acierto = (pos != -1);

        if (acierto) {
            letrasAdivinadas.add(pos, letra);
        }
        
        // Para saber si el usuario ha acertado o no
        return acierto;
    }

    public boolean palabraAdivinada() {
        // Convierte la palabra a adivinar en una lista de caracteres
        // Para asi poderla comparar con la otra lista de caracteres
        List<Character> listaPalabra = new ArrayList<>();
        for (char letra : palabraAdivinar.toCharArray()) {
            listaPalabra.add(letra);
        }
    
        // Compara las letras adivinadas con la palabra a adivinar
        return letrasAdivinadas.equals(listaPalabra);
    }

}
