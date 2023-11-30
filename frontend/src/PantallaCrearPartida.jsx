import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

// Componente para la pantalla de creación de partida
const PantallaCrearPartida = ({ nombreJugador }) => {
  return (
    <div>
      <p>Contenido de PantallaCrearPartida</p>
      <p>Nombre del Jugador: {nombreJugador}</p>
    </div>
  );
};