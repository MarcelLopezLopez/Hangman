import React, { useState, useEffect } from 'react';

const CrearPartida = ({ identificadorPartida, nombreUsuario }) => {

  const handleIniciarPartida = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/partida/iniciar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identificador: identificadorPartida,
          nombreUsuario: nombreUsuario,
        }),
      });

      if (response.ok) {
        console.log('Partida iniciada!');
      } else {
        console.error('Error al iniciar la partida');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  return (
    <div>
      <div className="container">
        <p>ID de la Partida: {identificadorPartida}</p>
        <p>Nombre de Usuario: {nombreUsuario}</p>
        <button onClick={handleIniciarPartida}>Iniciar Partida</button>
      </div>
    </div>
  );
};

export default CrearPartida;
