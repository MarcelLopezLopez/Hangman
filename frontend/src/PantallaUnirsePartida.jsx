import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const PantallaUnirsePartida = ({ nombreJugador }) => {
    return (
      <div>
        <p>Contenido de PantallaUnirsePartida</p>
        <p>Nombre del Jugador: {nombreJugador}</p>
      </div>
    );
  };