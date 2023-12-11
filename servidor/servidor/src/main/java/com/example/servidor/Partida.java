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
    // Numero de vidas en una partida
    private int vidas;

    // Constructor, getters y setters
    public Partida(String identificador, String primerUsuario) {
        this.identificador = identificador;
        this.nombresUsuarios = new ArrayList<>();
        this.nombresUsuarios.add(primerUsuario);
        this.iniciada = false;
        this.palabraAdivinar = null;
        this.letrasAdivinadas = new ArrayList<>();
        this.vidas = 10;
    }

    public void setVidas(int num){
        this.vidas = num;
    }

    public int getVidas(){
        return this.vidas;
    }

    public String getPalabraAdivinar() {
        return palabraAdivinar;
    }

    public void setPalabraAdivinar(String palabra){
        this.palabraAdivinar = palabra.toUpperCase();
        // Inicializamos el valor del arrayList para que no de error al añadir luego las letras
        for(int i=0; i < palabraAdivinar.length(); i++){
            letrasAdivinadas.add('_');
        }
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

    public int adivinarLetra(char letra) {
        letra = Character.toUpperCase(letra); // Convierte a mayúscula
        boolean aux = false;

        // recorremos toda la palabra mirando si la letra introducida esta y guardamos la posicion
        for (int i = 0; i < palabraAdivinar.length(); i++) {
            if (palabraAdivinar.charAt(i) == letra) {
                letrasAdivinadas.add(i, letra);
                aux = true;
            }
        }
        if(aux){
            return this.vidas;
        }
        else {
            this.vidas = this.vidas -1;
            return this.vidas;
        }
    }

    public String arrayToString() {
        StringBuilder resultado = new StringBuilder();

        // Iterar sobre la palabra a adivinar y construir la cadena resultante
        for (int i = 0; i < palabraAdivinar.length(); i++) {
            char letraActual = palabraAdivinar.charAt(i);

            // Si la letra está adivinada, agregarla a la cadena resultante
            if (letrasAdivinadas.contains(letraActual)) {
                resultado.append(letraActual);
            } else {
                // Si la letra no está adivinada, agregar "_" a la cadena resultante
                resultado.append("_");
            }

            // Agregar un espacio después de cada letra (excepto la última)
            if (i < palabraAdivinar.length() - 1) {
                resultado.append(" ");
            }
        }

        return resultado.toString();
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
