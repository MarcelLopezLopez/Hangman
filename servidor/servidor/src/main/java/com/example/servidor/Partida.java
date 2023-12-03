// Partida.java
package com.example.servidor;

public class Partida {
    private String identificador;
    private String nombreUsuario;

    // Constructor, getters y setters

    public Partida(String identificador, String nombreUsuario) {
        this.identificador = identificador;
        this.nombreUsuario = nombreUsuario;
    }

    public String getIdentificador() {
        return identificador;
    }

    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }
}
