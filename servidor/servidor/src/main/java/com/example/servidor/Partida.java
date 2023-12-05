// Partida.java
package com.example.servidor;

import java.util.ArrayList;
import java.util.List;

public class Partida {
    private String identificador;
    private List<String> nombresUsuarios;
    private boolean iniciada;

    // Constructor, getters y setters
    public Partida(String identificador, String primerUsuario) {
        this.identificador = identificador;
        this.nombresUsuarios = new ArrayList<>();
        this.nombresUsuarios.add(primerUsuario);
        this.iniciada = false;

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
}
