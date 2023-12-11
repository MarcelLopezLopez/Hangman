/*import React from 'react';

const Juego = ({ creador, nombreUsuario, identificadorPartida }) => {
  return (
    <div>
      <p>Nombre del Usuario: {nombreUsuario}</p>
      <p>Se encuentra ya en la Partida con id: {identificadorPartida}</p>
    </div>
  );
};

export default Juego;
*/

import React, { useState, useEffect } from 'react';
import socket from './Socket';

const Juego = ({ creador, nombreUsuario, identificadorPartida }) => {
  const [letra, setLetra] = useState('');
  const [palabraAdivinar, setPalabraAdivinar] = useState('');
  const [longitudPalabra, setLongitudPalabra] = useState(0);
  const [iniciada, setIniciada] = useState(false);
  const [adivinado, setAdivinado] = useState('');
  const [vidas, setVidas] = useState(10);

  useEffect(() => {
    // Manejar eventos del servidor
    socket.on('letra' + identificadorPartida, (adivinadoHastaAhora) => {
      // Actualizar el estado del juego en el cliente
      setAdivinado(adivinadoHastaAhora);
    });

    socket.on('vidas' + identificadorPartida, (misVidas) => {
      // Actualizar el estado del juego en el cliente
      setVidas(misVidas);
    });

    socket.on('palabraRecibida' + identificadorPartida, (length) => {
      setLongitudPalabra(length);
      setIniciada(true);
    });

    // Limpia los listeners al desmontar el componente
    return () => {
      socket.off('palabraRecibida')
      socket.off('letra')
    };
  }, [identificadorPartida, palabraAdivinar]);

  // Enviar la letra adivinada al servidor
  const handleEnviarLetra = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/partida/letra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          letra: letra,
          identificadorPartida: identificadorPartida,
        }),
      });

      if (response.ok) {

      } else {
        console.error('Error al enviar la letra');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  // Enviar la palabra cuando el usuario es el creador
  const handleElegirPalabara = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/partida/palabra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          palabraAdivinar: palabraAdivinar,
          identificadorPartida: identificadorPartida,
        }),
      });

      if (response.ok) {

      } else {
        console.error('Error al enviar la palabra');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  return (
    <div>
      <p>Nombre del Usuario: {nombreUsuario}</p>
      <p>ID de la partida: {identificadorPartida}</p>
      {creador ? (
        <div>
          <p>¡Eres el creador! Ingresa la palabra del juego:</p>
          <input
            type="text"
            value={palabraAdivinar}
            onChange={(e) => setPalabraAdivinar(e.target.value)}
          />
          <button onClick={handleElegirPalabara}>Enviar Palabra</button>
        </div>
      ) : (
        iniciada ? (
          <div>
            <p>Número de letras en la palabra: {longitudPalabra}</p>
            <p>Introduzca una letra: {palabraAdivinar}</p>
            <input
              type="text"
              maxLength={1}
              value={letra}
              onChange={(e) => setLetra(e.target.value)}
            />
            <button onClick={handleEnviarLetra}>Adivinar</button>
            <h1>{adivinado}</h1>
            <p>Vidas restantes: {vidas}</p>
          </div>
        ) : (
          <div></div>
        )
      )}
    </div>
  );
}



export default Juego;
