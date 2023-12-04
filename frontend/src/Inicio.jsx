// Inicio.js
import React, { useState } from 'react';
import CrearPartida from './CrearPartida';
import UnirsePartida from './UnirsePartida';

const Inicio = () => {
  //Variable para guardar el nombre del usuario
  const [nombre, setNombre] = useState('');
  // Estado para almacenar el ID de la partida del que se une
  const [idPartida, setIdPartida] = useState('');
  // Estado de las pantallas
  const [pantalla, setPantalla] = useState('inicio');
  //Variable para guardar el identificador que devuelve el server al crear la partida
  const [identificadorPartida, setIdentificadorPartida] = useState('');
  //Variable para saber si se puede iniciar una partida
  const [iniciarPartida, setIniciarPartida] = useState(false);

  //funcion que manda solicitud de crear partida al server y el nombre
  const handleCrearPartida = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/partida/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombreUsuario: nombre }),
      });

      if (response.ok) {
        // guardamos el ID de la partida
        const identificadorGenerado = await response.text();
        setIdentificadorPartida(identificadorGenerado);
        // Marcamos la partida como que aun no esta lista para iniciar ya que se acaba de crear
        setIniciarPartida(false);
        //actualizamos la pantalla
        setPantalla('crearPartida');
      } else {
        console.error('Error al crear la partida');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  //funcion que manda solicitud de unirse a partida al server, manda el nombre y un ID que se introduce por teclado
  const handleUnirsePartida = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/partida/unirse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre,
          identificador: idPartida, // Enviar el ID de la partida al backend
        }),
      });

      if (response.ok) {
        const estadoPartida = await response.text();
        console.log('Estado de la partida:', estadoPartida);
        // Marcamos la partida como lista para iniciar, ya que tenemos 2 o mas usuarios
        setIniciarPartida(true);
        //actualizamos el estado de la pantalla
        setPantalla('unirsePartida');
      } else {
        console.error('Error al unirse a la partida');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  //funcion que manda solicitud para iniciar partida al server
  const handleIniciarPartida = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/partida/iniciar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identificador: identificadorPartida,
          nombreUsuario: nombre,
        }),
      });

      if (response.ok) {
        // Per completar el que fer al iniciar partida
        console.log('Partida iniciada!');
      } else {
        console.error('Error al iniciar la partida');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const renderPantallaActual = () => {
    switch (pantalla) {
      case 'crearPartida':
        return (
          <>
            <CrearPartida identificadorPartida={identificadorPartida} />;
            {iniciarPartida && (
              <button onClick={handleIniciarPartida}>Iniciar Partida</button>
            )}
          </>
        );
      case 'unirsePartida':
        return <UnirsePartida />;
      default:
        return (
          <div>
            <label>
              Nombre:
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </label>
            <label>
              ID de Partida para Unirse:
              <input type="text" value={idPartida} onChange={(e) => setIdPartida(e.target.value)} />
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
