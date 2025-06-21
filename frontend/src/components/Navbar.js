import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);



    const handleHistorialClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleHistorialClose = () => {
        setAnchorEl(null);
    };

    const handleHistorialOptionClick = (tipo) => {
        navigate('/cliente/historial', { state: { tipo } }); // Navega a /cliente/historial con el tipo en el estado
        handleHistorialClose();
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ flexGrow: 1 }} display="flex" gap={2}>
                    <>
                        <Button color="inherit" component={Link} to="/cliente/catalogo">Catálogo</Button>
                        <Button color="inherit" component={Link} to="/cliente/carrito">Carrito</Button>
                        <Button color="inherit" component={Link} to="/cliente/reparaciones">Reparaciones</Button>
                        <Button color="inherit" component={Link} to="/cliente/gestion">Cuenta</Button>

                        <Button color="inherit" onClick={handleHistorialClick}>Historial</Button>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleHistorialClose}>
                            <MenuItem onClick={() => handleHistorialOptionClick('compras')}>Historial Compras</MenuItem>
                            <MenuItem onClick={() => handleHistorialOptionClick('arriendos')}>Historial Arriendos</MenuItem>
                            <MenuItem onClick={() => handleHistorialOptionClick('reparaciones')}>Historial Reparaciones</MenuItem>
                        </Menu>
                    </>
                    <>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/registro">Registro</Button>
                    </>
                </Box>
                <Button color="inherit">Cerrar sesión</Button>
            </Toolbar>
        </AppBar>
    );
}