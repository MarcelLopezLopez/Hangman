// App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import PartidaCreada from './PartidaCreada';
import './App.css';

// Funcion para generar aleatoriamente un ID de 4 digitos
function generarID() {
  // Genera un número aleatorio entre 1000 y 9999
  return Math.floor(Math.random() * 9000) + 1000;
}

function App() {
  //Funcion para guardar el nombre del usuario
  const [nombreJugador, setNombreJugador] = useState('');
  //FUncion para guardar el identificador de una partida creada
  const [identificadorPartida, setIdentificadorPartida] = useState(null);
  //Funcion para validar si se muestra o no la partida creada
  const [mostrarPartidaCreada, setMostrarPartidaCreada] = useState(false);
  //Funcion para validar si se muestra o no la partida existente
  const [mostrarPartidaExistente, setMostrarPartidaExistente] = useState(false);
  //FUncion para guardar el identificador de una partida existente
  const [identificadorPartidaExistente, setIdentificadorPartidaExistente] = useState('');
  const socket = io('http://localhost:4567');

  useEffect(() => {
    socket.on('identificadorPartida', (identificador) => {
      setIdentificadorPartida(identificador);
      setMostrarPartidaCreada(true);
    });

    return () => {
      socket.off('identificadorPartida');
    };
  }, [socket]);

  const handleNameChange = (event) => {
    setNombreJugador(event.target.value);
  };

  const iniciarPartida = () => {
    const nuevoIdentificador = generarID();

    // Aquí podrías agregar lógica adicional para asegurar que el ID sea único
    // por ejemplo, verificando si ya existe una partida con ese ID

    socket.emit('CrearPartida', { nombreJugador, identificadorPartida: nuevoIdentificador });
  };

  const unirsePartidaExistente = () => {
    socket.emit('UnirsePartida', { nombreJugador, identificadorPartidaExistente });
  };

  return (
    <div className="container">
      {mostrarPartidaCreada ? (
        <PartidaCreada
          socket={socket}
          identificadorPartida={identificadorPartida}
          nombreCreador={nombreJugador}
        />
      ) : mostrarPartidaExistente ? (
        <>
          <label className="label">
            Nombre del Jugador:
            <input className="input" type="text" value={nombreJugador} onChange={handleNameChange} />
          </label>
          <label className="label">
            Identificador de la Partida Existente:
            <input
              className="input"
              type="text"
              value={identificadorPartidaExistente}
              onChange={(event) => setIdentificadorPartidaExistente(event.target.value)}
            />
          </label>
          <button className="button" onClick={unirsePartidaExistente}>
            Unirse a Partida Existente
          </button>
        </>
      ) : (
        <>
          <label className="label">
            Nombre del Jugador:
            <input className="input" type="text" value={nombreJugador} onChange={handleNameChange} />
          </label>
          <button className="button" onClick={iniciarPartida}>
            Crear Partida
          </button>
          {identificadorPartida !== null && (
            <p>ID de la Partida: {identificadorPartida}</p>
          )}
          <button
            className="button"
            onClick={() => setMostrarPartidaExistente(true)}
          >
            Unirse a Partida Existente
          </button>
        </>
      )}
    </div>
  );
}

export default App;
