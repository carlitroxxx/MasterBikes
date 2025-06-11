// src/App.js
import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import VentaForm from './ventas-service/VentaForm';
import VentaList from './ventas-service/VentaList';
import ReporteVentas from './reportes-service/ReporteVentas';

function App() {
    const [actualizar, setActualizar] = useState(false);

    const onVentaCreada = () => setActualizar(!actualizar);

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>Ventas - MasterBikes</Typography>
            <VentaForm onVentaCreada={onVentaCreada} />
            <VentaList key={actualizar} />
        </Container>
    );
}

export default App;



