// Importa React, useState y useEffect desde la librería 'react'
import React, { useState, useEffect } from 'react';

// Define el componente funcional 'UnirsePartida2' que recibe propiedades 
const UnirsePartida2 = ({ identificadorPartida, nombreUsuario }) => {
  // Función que renderiza el contenido cuando se ha unido a la partida
  const renderJuego = () => {
    return (
      <div className="container">
        {/* Muestra el ID de la partida y el nombre de usuario */}
        <p>ID de la Partida: {identificadorPartida}</p>
        <p>Nombre de Usuario: {nombreUsuario}</p>
        {/* Muestra un mensaje indicando que se está esperando a que el creador inicie la partida */}
        <p>Esperando a que el Creador Inicie la partida</p>
      </div>
    );
  }

  // Renderiza el componente con el contenido de la función renderJuego
  return (
    <div>
      {renderJuego()}
    </div>
  );

};

// Exporta el componente 'UnirsePartida2' como el componente predeterminado de este archivo
export default UnirsePartida2;
