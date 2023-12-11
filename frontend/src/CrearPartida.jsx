// Importamos React, useState y useEffect desde la librería 'react'
import React, { useState, useEffect } from 'react';

// Define el componente funcional 'CrearPartida' que recibe propiedades 
const CrearPartida = ({ identificadorPartida, nombreUsuario }) => {
  
  // Función para manejar el inicio de la partida
  const handleIniciarPartida = async () => {
    try {
      // Realizamos una solicitud POST al servidor para iniciar la partida
      const response = await fetch('http://localhost:8080/api/partida/iniciar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Enviamos datos JSON en el cuerpo de la solicitud
        body: JSON.stringify({
          identificador: identificadorPartida,
          nombreUsuario: nombreUsuario,
        }),
      });

      // Verificamos si la respuesta del servidor es exitosa
      if (response.ok) {
        console.log('Partida iniciada!'); // Muestra un mensaje en la consola si la partida se inicia con éxito
      } else {
        console.error('Error al iniciar la partida'); // Muestra un mensaje de error si la partida no se inicia correctamente
      }
    } catch (error) {
      console.error('Error de red:', error); // Captura y muestra errores de red, como problemas de conexión
    }
  };

  // Renderizamos el componente con la información de la partida y un botón para iniciarla
  return (
    <div>
      <div className="container">
        {/* Muestra el ID de la partida y el nombre de usuario */}
        <p>ID de la Partida: {identificadorPartida}</p>
        <p>Nombre de Usuario: {nombreUsuario}</p>
        {/* Agrega un botón que llama a la función handleIniciarPartida al hacer clic */}
        <button onClick={handleIniciarPartida}>Iniciar Partida</button>
      </div>
    </div>
  );
};

// Exporta el componente 'CrearPartida' como el componente predeterminado de este archivo
export default CrearPartida;
