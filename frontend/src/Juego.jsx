import React, { useState, useEffect } from 'react';
import socket from './Socket';

const Juego = ({ creador, nombreUsuario, identificadorPartida }) => {
  const [letra, setLetra] = useState('');
  const [palabraAdivinar, setPalabraAdivinar] = useState('');
  const [longitudPalabra, setLongitudPalabra] = useState(0);
  const [iniciada, setIniciada] = useState(false);
  const [adivinado, setAdivinado] = useState('');
  const [vidas, setVidas] = useState(10);
  // Variable que guarda el estado de la partida, 0 en progreso, 1 se ha ganado, 2 se ha perdido
  const [fin, setFin] = useState(0);
  // Vector que guardara las letras erroneas
  const [letrasErroneas, setLetrasErroneas] = useState([]);
  // Variable para saber si se ha introducido la palabra
  const [palabraIntro, setPalabraIntro] = useState(true);

  useEffect(() => {
    // Manejar eventos del servidor
    socket.on('letra' + identificadorPartida, (adivinadoHastaAhora) => {
      // Actualizar el estado del juego en el cliente
      setAdivinado(adivinadoHastaAhora);
    });

    socket.on('error' + identificadorPartida, (errores) => {
      // Actualizar las letras que han fallado los usuarios
      setLetrasErroneas(errores);
    });

    socket.on('vidas' + identificadorPartida, (misVidas) => {
      // Actualizar las vidas de los usuarios
      setVidas(misVidas);
    });

    socket.on('palabraRecibida' + identificadorPartida, (length) => {
      setLongitudPalabra(length);
      setIniciada(true);
    });

    socket.on('fin' + identificadorPartida, (final) => {
      // Si final vale 0 estamos en la partida, si vale 1 se ha ganado la partida y si vale 2 se ha perdido la partida
      setFin(final);
    });

    // Limpia los listeners al desmontar el componente
    return () => {
      socket.off('palabraRecibida')
      socket.off('letra')
      socket.off('palabraRecibida')
      socket.off('fin')
      socket.off('vidas')
      socket.off('error')
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

  // Funcion para pulsando la tecla enter en vez de pulsar el boton
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEnviarLetra();
    }
  };

  // Enviar la palabra cuando el usuario es el creador
  const handleElegirPalabra = async () => {
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
        setPalabraIntro(false);
      } else {
        console.error('Error al enviar la palabra');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  // Lógica para decidir qué mostrar en función de la variable fin
  const renderContenido = () => {
    if (fin === 0) {
      return (
        <div>
          <p>Número de letras en la palabra: {longitudPalabra}</p>
          <p>Introduzca una letra: {palabraAdivinar}</p>
          <input
            type="text"
            maxLength={1}
            value={letra}
            onChange={(e) => setLetra(e.target.value)}
            onKeyPress={handleKeyPress} // Nuevo manejo de tecla
          />

          <button onClick={handleEnviarLetra}>Adivinar</button>
          <h1>{adivinado}</h1>
          <p>Vidas restantes: {vidas}</p>
          <p>Letras falladas: {letrasErroneas}</p>
        </div>
      );
    } else if (fin === 1) {
      return <h1>¡Has GANADO la partida!</h1>;
    } else if (fin === 2) {
      return <h1>¡Has PERDIDO la partida!</h1>;
    }
  };

  return (
    <div>
      <p>Nombre del Usuario: {nombreUsuario}</p>
      <p>ID de la partida: {identificadorPartida}</p>
      {creador ? (
        <div>
          {fin === 0 ? (
            <div>
              {palabraIntro ? (
                <div>
                  <p>¡Eres el creador! Ingresa la palabra del juego:</p>
                  <input
                    type="text"
                    value={palabraAdivinar}
                    onChange={(e) => setPalabraAdivinar(e.target.value)}
                  />
                  <button onClick={handleElegirPalabra}>Enviar Palabra</button>
                </div>
              ) : (
              <p>Palabra de la partida: {palabraAdivinar}</p>
              )}
            </div>
          ) : (
            <h1>La partida ha terminado. {fin === 1 ? 'Los usuarios han GANADO!' : 'Los usuarios han PERDIDO!'}</h1>
          )}
        </div>
      ) : (
        iniciada ? (
          renderContenido()
        ) : (
          <div></div>
        )
      )}
    </div>
  );
}

export default Juego;
