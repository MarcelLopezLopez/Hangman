// Inicio.js
import React, { useState } from 'react';
import CrearPartida from './CrearPartida';
import UnirsePartida from './UnirsePartida';

const Inicio = () => {
  const [nombre, setNombre] = useState('');
  const [pantalla, setPantalla] = useState('inicio');
  const [identificadorPartida, setIdentificadorPartida] = useState('');

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
        const identificadorGenerado = await response.text();
        setIdentificadorPartida(identificadorGenerado);
        setPantalla('crearPartida');
      } else {
        console.error('Error al crear la partida');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const handleUnirsePartida = async () => {
    // Asumiendo que ya tienes el identificador de partida ingresado por el usuario
    // (puedes almacenarlo en un estado similar a `nombre` y actualizarlo en el input)
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
        const estadoPartida = await response.text();
        console.log('Estado de la partida:', estadoPartida);
        setPantalla('unirsePartida');
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
        return <CrearPartida identificadorPartida={identificadorPartida} />;
      case 'unirsePartida':
        return <UnirsePartida />;
      default:
        return (
          <div>
            <label>
              Nombre:
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
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
