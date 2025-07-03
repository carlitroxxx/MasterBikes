
import React from 'react';
import ReparacionForm from '../Reparacion/ReparacionForm';
import ReparacionesList from '../Reparacion/ReparacionesList';

const ReparacionesPage = () => {
  return (
    <div style={{ padding: 20 }}>
      <h2>Solicitar Reparación (Cliente)</h2>
      <ReparacionForm />
      <h2 style={{ marginTop: '40px' }}>Solicitudes de Reparación (Técnico)</h2>
      <ReparacionesList />
    </div>
  );
};

export default ReparacionesPage;
