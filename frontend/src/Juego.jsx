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
      socket.off('partidaIniciada');
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
      socket.emit('/app/submitWord', wordState);
    };

    return () => {
      // Desconectar el socket cuando el componente se desmonta
      socket.disconnect();
    };
  }, [guessedLetter, wordState, creador]);

  return (
    <div>
      <p>Nombre del Usuario: {nombreUsuario}</p>
      <p>Se encuentra ya en la Partida con id: {identificadorPartida}</p>
    </div>
  );
};

export default Juego;
