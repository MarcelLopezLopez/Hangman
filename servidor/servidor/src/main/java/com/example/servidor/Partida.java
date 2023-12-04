// Partida.java
package com.example.servidor;

public class Partida {
    private String identificador;
    private String nombreUsuario;
    private String nombreUsuario2;

    // Constructor, getters y setters
    public Partida(String identificador, String nombreUsuario, String nombreUsuario2) {
        this.identificador = identificador;
        this.nombreUsuario = nombreUsuario;
        this.nombreUsuario2 = nombreUsuario2;

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

    public String getNombreUsuario2() {
        return nombreUsuario2;
    }

    public void setNombreUsuario2(String nombreUsuario2) {
        this.nombreUsuario2 = nombreUsuario2;
    }
}
