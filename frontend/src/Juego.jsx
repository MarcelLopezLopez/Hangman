import React from 'react';

const Juego = ({ creador, nombreUsuario, identificadorPartida }) => {
  return (
    <div>
      <p>Nombre del Usuario: {nombreUsuario}</p>
      <p>Se encuentra ya en la Partida con id: {identificadorPartida}</p>
    </div>
  );
};

export default Juego;
