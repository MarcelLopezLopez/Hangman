// PartidaCreada.js
import React, { useState, useEffect } from 'react';

function PartidaCreada({ socket, identificadorPartida, nombreCreador }) {
  const [numUsuarios, setNumUsuarios] = useState(1);

  useEffect(() => {
    socket.on('numUsuarios', (num) => {
      setNumUsuarios(num);
    });

    return () => {
      socket.off('numUsuarios');
    };
  }, [socket]);

  return (
    <div className="partida-creada">
      <h2>Partida Creada</h2>
      <p>ID de la Partida: {identificadorPartida}</p>
      <p>Nombre del Creador: {nombreCreador}</p>
      <p>Número de Usuarios Conectados: {numUsuarios}</p>
      {/* Puedes agregar más información o elementos según tus necesidades */}
    </div>
  );
}

export default PartidaCreada;
