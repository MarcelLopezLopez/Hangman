// Importamos React, useState y useEffect desde la librería 'react'
import React, { useState, useEffect } from 'react';
// Importamos estilos desde el archivo 'Inicio.css'
import './Inicio.css';
// Importamos componentes adicionales desde archivos locales
import CrearPartida from './CrearPartida';
import UnirsePartida from './UnirsePartida';
import Juego from './Juego';
// Importa el objeto 'socket' desde el archivo 'Socket'
import socket from './Socket';

// Definimos el componente funcional 'Inicio'
const Inicio = () => {
  // Variable para guardar el nombre del usuario que se conecta
  const [nombre, setNombre] = useState('');
  // Variable para gestionar las pantallas
  const [pantalla, setPantalla] = useState('inicio');
  // Variable para guardar el identificador de la partida
  const [identificadorPartida, setIdentificadorPartida] = useState('');
  // Variable para saber si el usuario será el que crea la partida o el que adivina
  const [creador, setCreador] = useState(false);

  // Efecto secundario que se ejecuta después de que el componente ha sido montado
  useEffect(() => {
    // Escucha el evento 'partidaIniciada' desde el servidor
    socket.on('partidaIniciada', () => {
      setPantalla('juego');
    });

    // Limpia los listeners al desmontar el componente
    return () => {
      socket.off('partidaIniciada');
    };
  }, []); // El array vacío significa que el efecto se ejecuta solo una vez al montar el componente

  // Función para crear una partida
  const handleCrearPartida = async () => {
    // Verificamos que el nombre no esté vacío
    if (!nombre) {
      alert('Ingresa un nombre de usuario antes de crear la partida.');
      return;
    }

    // Manejo de errores del fetch
    try {
      // Realizamos una solicitud POST al servidor para crear una partida
      const response = await fetch('http://localhost:8080/api/partida/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Enviamos datos JSON en el cuerpo de la solicitud
        body: JSON.stringify({ nombreUsuario: nombre }),
      });

      // Si la respuesta no es un error
      if (response.ok) {
        // Guardamos el identificador de la partida generado por el servidor
        const identificadorGenerado = await response.text();
        // Actualizamos el estado de las variables identificador, creador y pantalla
        setIdentificadorPartida(identificadorGenerado);
        setCreador(true);
        setPantalla('crearPartida');
        // Enviamos un evento 'nuevaPartida' al servidor a través de socket
        socket.emit('nuevaPartida', { identificadorPartida, nombreUsuario: nombre });
      } else {
        console.error('Error al crear la partida');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  // Función para unirse a una partida
  const handleUnirsePartida = async () => {
    // Verificamos que el nombre no esté vacío
    if (!nombre) {
      alert('Ingresa un nombre de usuario antes de unirte a la partida.');
      return;
    }

    // Manejo de errores del fetch
    try {
      // Realizamos una solicitud POST al servidor para unirse a una partida
      const response = await fetch('http://localhost:8080/api/partida/unirse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Enviamos datos JSON en el cuerpo de la solicitud
        body: JSON.stringify({
          nombre: nombre,
          identificador: identificadorPartida,
        }),
      });

      // Si la respuesta no es un error
      if (response.ok) {
        // Actualizamos el estado de las variables creador y pantalla
        setCreador(false);
        setPantalla('unirsePartida');
        // Envia un evento 'unirsePartida' al servidor a través de socket
        socket.emit('unirsePartida', { identificadorPartida: identificadorPartida, nombreUsuario: nombre });
      } else {
        console.error('Error al unirse a la partida');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  /* Función para renderizar la pantalla actual, dependiendo del estado de la variable pantalla
    se mostrara una componente u otra, pasamos el nombre de uduario y el id de la partida como propiedades
    para que puedans er usadas en ese componente*/
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
            <h1>Bienvenido al juego del ahorcado</h1>
            <p>Implementado por Marcel López y Sergi Ferret</p>
            <img src={require('./logojuego.png')} alt="Logo del juego" style={{ width: '200px' }} />
            <label>
              Nombre:
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </label>
            <hr />
            <label>
              ID de la Partida que quiere unirse:
              <input type="text" value={identificadorPartida} onChange={(e) => setIdentificadorPartida(e.target.value)} />
            </label>
            <button onClick={handleCrearPartida}>Crear Partida</button>
            <button onClick={handleUnirsePartida}>Unirse a Partida</button>
          </div>
        );
    }
  };

  // Renderiza el componente con la pantalla actual
  return (
    <div>
      {renderPantallaActual()}
    </div>
  );
};

// Exporta el componente 'Inicio' como el componente predeterminado de este archivo
export default Inicio;
