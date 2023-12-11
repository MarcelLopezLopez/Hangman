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

  useEffect(() => {
    // Manejar eventos del servidor
    socket.on('letra', (mensaje) => {
      // Actualizar el estado del juego en el cliente
      setLetra(mensaje);
    });
    // Limpia los listeners al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, []);

  // Enviar la letra adivinada al servidor
  const handleEnviarLetra = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/partida/letra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombreUsuario: letra }),
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
  const handleElegirPalabara = () => {
    socket.emit('/app/submitWord', palabraAdivinar);
  };

  return (
    <div>
      <p>Nombre del Usuario: {nombreUsuario}</p>
      <p>Se encuentra ya en la Partida con id: {identificadorPartida}</p>
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
        <div>
          <p>Número de letras en la palabra: {longitudPalabra}</p>
          <p>Palabra actual: {palabraAdivinar}</p>
          <input
            type="text"
            maxLength={1}
            value={letra}
            onChange={(e) => setLetra(e.target.value)}
          />
          <button onClick={handleEnviarLetra}>Adivinar</button>
        </div>
      )}
    </div>
  );
};

export default Juego;
