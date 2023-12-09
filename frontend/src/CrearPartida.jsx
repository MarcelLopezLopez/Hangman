/*import React, { useState } from 'react';
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
*/
import React, { useState, useEffect } from 'react';
import Juego from './Juego';
import socket from './Socket';

const CrearPartida = ({ identificadorPartida, nombreUsuario }) => {
  const [iniciarPartida, setIniciarPartida] = useState(false);
  const [creador, setCreador] = useState(true);

  useEffect(() => {
    // Escucha el evento 'iniciarPartida' desde el servidor
    socket.on('iniciarPartida', () => {
      setIniciarPartida(true);
    });

    // Limpia los listeners al desmontar el componente
    return () => {
      socket.off('iniciarPartida');
    };
  }, []);

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
        socket.emit('iniciarPartida', { identificadorPartida });
      } else {
        console.error('Error al iniciar la partida');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const renderJuego = () => {
    return (
      <div className="container">
        <Juego creador={creador} nombreUsuario={nombreUsuario} identificadorPartida={identificadorPartida} />
      </div>
    );
  };

  return (
    <div>
      {iniciarPartida ? (
        renderJuego()
      ) : (
        <div className="container">
          <p>Identificador de la Partida: {identificadorPartida}</p>
          <p>Nombre del Usuario: {nombreUsuario}</p>
          <button onClick={handleIniciarPartida}>Iniciar Partida</button>
          <p>Esperando iniciar partida</p>
        </div>
      )}
    </div>
  );
};

export default CrearPartida;
