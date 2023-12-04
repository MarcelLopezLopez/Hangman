import React from 'react';

const CrearPartida = ({ identificadorPartida, nombreUsuario }) => {
  return (
    <div>
      <p>Identificador de la Partida: {identificadorPartida}</p>
      <p>Nombre del Usuario: {nombreUsuario}</p>
    </div>
  );
};

export default CrearPartida;
