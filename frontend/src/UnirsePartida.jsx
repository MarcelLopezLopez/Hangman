import React, { useState, useEffect } from 'react';

const UnirsePartida2 = ({ identificadorPartida, nombreUsuario }) => {

  const renderJuego = () => {
    return (
      <div className="container">
        <p>ID de la Partida: {identificadorPartida}</p>
        <p>Nombre de Usuario: {nombreUsuario}</p>
        <p>Esperando a que el Creador Inicie la partida</p>
      </div>
    );
  }

  return (
    <div>
      {renderJuego()}
    </div>
  );

};

export default UnirsePartida2;
