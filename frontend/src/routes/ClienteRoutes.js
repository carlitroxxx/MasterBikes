import { Routes, Route, Link } from 'react-router-dom';
import { Box, Button, Container, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import Catalogo from '../views/Cliente/Catalogo';
import Carrito from '../views/Cliente/Carrito';
import GestionCuenta from '../views/Cliente/GestionCuenta';
import Reparaciones from '../views/Cliente/Reparaciones';
import HistorialView from '../views/Cliente/HistorialView';

export default function ClienteRoutes() {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleHistorialClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Container
            sx={{
                mx : "8%",
                maxWidth: '84% !important'
            }}
        >
            <Routes>
                <Route path="catalogo" element={<Catalogo />} />
                <Route path="carrito" element={<Carrito />} />
                <Route path="reparaciones" element={<Reparaciones />} />
                <Route path="gestion" element={<GestionCuenta />} />
                <Route path="historial" element={<HistorialView />} />
            </Routes>
        </Container>
    );
}
