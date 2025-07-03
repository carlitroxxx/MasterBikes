// src/App.js
import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import VentaForm from './ventas-service/VentaForm';

function App() {

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>Ventas - MasterBikes</Typography>
            <VentaForm/>
        </Container>
    );
}

export default App;



