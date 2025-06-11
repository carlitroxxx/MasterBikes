// src/App.js
import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import VentaForm from './components/VentaForm';
import VentaList from './components/VentaList';

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



