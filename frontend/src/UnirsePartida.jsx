/*import React, { useState } from 'react';
import Juego from './Juego';

const UnirsePartida = ({ identificadorPartida, nombreUsuario }) => {
  //Variable booleana para saber si el usuario es el creador
  const [creador, setCreador] = useState(false);
  //Variable booleana para saber cuando entrar a la partida
  const [entrar, setEntrar] = useState(false);

  const handleEntrarPartida = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/partida/entrar', {
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
        setEntrar(true);
        console.log('Partida iniciada!');
      } else {
        setEntrar(false);
        console.error('Error al iniciar la partida');
      }
    } catch (error) {
      setEntrar(false);
      console.error('Error de red:', error);
    }
  };

  const renderJuego = () => {
    switch (entrar) {
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
            <button onClick={handleEntrarPartida}>Pulse para entrar a la Partida</button>
            <p>Nota: En caso de no funcionar espere a que el creador inicie el Juego</p>
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

export default UnirsePartida;
*/
import React, { useState, useEffect } from 'react';

const UnirsePartida2 = ({ identificadorPartida, nombreUsuario }) => {

  const renderJuego = () => {
    return (
      <div className="container">
        <p>Identificador de la Partida: {identificadorPartida}</p>
        <p>Nombre del Usuario: {nombreUsuario}</p>
      </div>
    );
  }

  return (
    <div>
      {renderJuego()}
    </div>
  );

};

export default UnirsePartida2;
