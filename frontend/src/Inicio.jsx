import React, { useState, useEffect } from 'react';
import './Inicio.css';
import CrearPartida from './CrearPartida';
import UnirsePartida from './UnirsePartida';
import Juego from './Juego';
import socket from './Socket';

const Inicio = () => {
  const [nombre, setNombre] = useState('');
  const [pantalla, setPantalla] = useState('inicio');
  const [identificadorPartida, setIdentificadorPartida] = useState('');
  const [creador, setCreador] = useState(false);

  useEffect(() => {
    // Escucha el evento 'partidaIniciada' desde el servidor
    socket.on('partidaIniciada', () => {
      setPantalla('juego');
    });

    // Limpia los listeners al desmontar el componente
    return () => {
      socket.off('partidaIniciada');
    };
  }, []);

  const handleCrearPartida = async () => {
    if (!nombre) {
      alert('Ingresa un nombre de usuario antes de crear la partida.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/partida/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombreUsuario: nombre }),
      });

      if (response.ok) {
        const identificadorGenerado = await response.text();
        setIdentificadorPartida(identificadorGenerado);
        setCreador(true);
        setPantalla('crearPartida');
        socket.emit('nuevaPartida', { identificadorPartida, nombreUsuario: nombre });
      } else {
        console.error('Error al crear la partida');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const handleUnirsePartida = async () => {
    if (!nombre) {
      alert('Ingresa un nombre de usuario antes de unirte a la partida.');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/partida/unirse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre,
          identificador: identificadorPartida,
        }),
      });

      if (response.ok) {
        setCreador(false);
        setPantalla('unirsePartida');
        socket.emit('unirsePartida', { identificadorPartida: identificadorPartida, nombreUsuario: nombre });
      } else {
        console.error('Error al unirse a la partida');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const renderPantallaActual = () => {
    switch (pantalla) {
      case 'crearPartida':
        return (
          <div className="container">
            <CrearPartida identificadorPartida={identificadorPartida} nombreUsuario={nombre} />
          </div>
        );
      case 'unirsePartida':
        return (
          <div className="container">
            <UnirsePartida identificadorPartida={identificadorPartida} nombreUsuario={nombre} />
          </div>
        );
      case 'juego':
        return (
          <div className="container">
            <Juego creador={creador} nombreUsuario={nombre} identificadorPartida={identificadorPartida} />
          </div>
        );
      default:
        return (
          <div className="container">
            <label>
              Nombre:
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </label>
            <hr />
            <label>
              ID de la Partida:
              <input type="text" value={identificadorPartida} onChange={(e) => setIdentificadorPartida(e.target.value)} />
            </label>
            <button onClick={handleCrearPartida}>Crear Partida</button>
            <button onClick={handleUnirsePartida}>Unirse a Partida</button>
          </div>
        );
    }
  };

  return (
    <div>
      {renderPantallaActual()}
    </div>
  );
};

export default Inicio;