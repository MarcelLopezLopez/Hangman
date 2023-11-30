import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css'; 

function App() {
  const [nombreJugador, setNombreJugador] = useState('');
  const [identificadorPartida, setIdentificadorPartida] = useState('');
  const socket = io('http://localhost:4567'); // Reemplaza con la URL de tu servidor

  useEffect(() => {
    // Aquí puedes manejar eventos de socket, por ejemplo, para escuchar cambios en el identificador de la partida
    socket.on('identificadorPartida', (identificador) => {
      setIdentificadorPartida(identificador);
    });

    // No olvides limpiar el evento cuando el componente se desmonta
    return () => {
      socket.off('identificadorPartida');
    };
  }, [socket]);

  const handleNombreChange = (event) => {
    setNombreJugador(event.target.value);
  };

  const iniciarPartida = () => {
    // Envia el nombre del jugador al servidor junto con la solicitud de inicio de partida
    socket.emit('iniciarPartida', { nombreJugador });
    // Lógica para manejar la respuesta del servidor y obtener el identificador de la partida
  };

  const unirsePartida = () => {
    // Envia el nombre del jugador al servidor junto con la solicitud de unirse a la partida
    socket.emit('unirsePartida', { nombreJugador });
    // Lógica para manejar la respuesta del servidor y unirse a la partida
  };

  return (
    <div className="container">
      <label className="label">
        Nombre del Jugador:
        <input className="input" type="text" value={nombreJugador} onChange={handleNombreChange} />
      </label>
      <button className="button" onClick={iniciarPartida}>
        Iniciar Partida
      </button>
      <button className="button" onClick={unirsePartida}>
        Unirse a la Partida
      </button>
    </div>
  );
}

export default App;