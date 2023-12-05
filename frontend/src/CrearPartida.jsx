import React, { useState } from 'react';
import Juego from './Juego';

const CrearPartida = ({ identificadorPartida, nombreUsuario }) => {
  //Variable booleana para saber cuando iniciar la partida
  const [iniciarPartida, setIniciarPartida] = useState(false);
  //Variable booleana para saber quien es el creador
  const [creador, setCreador] = useState(true);

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
        setIniciarPartida(true);
        console.log('Partida iniciada!');
      } else {
        setIniciarPartida(false);
        console.error('Error al iniciar la partida');
      }
    } catch (error) {
      setIniciarPartida(false);
      console.error('Error de red:', error);
    }
  };

  const renderJuego = () => {
    switch (iniciarPartida) {
      case true:
        return (
          <div className="container">
            <Juego creador={creador} nombreUsuario={nombreUsuario} identificadorPartida={identificadorPartida} />
          </div>
        );
      default:
        return (
          <div className="container">
            <p>Identificador de la Partida: {identificadorPartida}</p>
            <p>Nombre del Usuario: {nombreUsuario}</p>
            <button onClick={handleIniciarPartida}>Iniciar Partida</button>
            <p>Esperando iniciar partida</p>
          </div>
        );
    }
  };

  return (
    <div>
      {renderJuego()}
    </div>
  );

};

export default CrearPartida;
