// src/App.js
import React from 'react';
import { Container, Typography } from '@mui/material';
import ReporteVentas from './reportes-service/ReporteVentas';

function App() {
  return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Panel de Reportes - Supervisor
        </Typography>
        <ReporteVentas />
      </Container>
  );
}

export default App;
