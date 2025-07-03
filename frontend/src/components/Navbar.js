import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Box, Menu, MenuItem, Typography, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Definir la misma paleta de colores que en VentaForm
const themeColors = {
    primary: '#0A2E5A',      // Azul marino profundo
    secondary: '#FFA000',    // Ámbar dorado
    accent: '#26A69A',       // Verde turquesa
    background: '#F5F7FA',   // Gris azulado claro
    paper: '#FFFFFF',
    textPrimary: '#212121',  // Negro suavizado
    textSecondary: '#455A64',
    success: '#2E7D32',      // Verde bosque
    error: '#C62828',        // Rojo vino
    warning: '#F57F17',      // Naranja mostaza
    info: '#1565C0',         // Azul estándar
    highlight: '#E8EAF6',    // Azul lavanda claro
    border: '#90A4AE'        // Gris azulado
};

export default function Navbar() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const { user, logout } = useAuth();
    const [historialAnchorEl, setHistorialAnchorEl] = useState(null);

    const handleHistorialClick = (event) => {
        setHistorialAnchorEl(event.currentTarget);
    };

    const handleHistorialClose = () => {
        setHistorialAnchorEl(null);
    };

    const handleHistorialOptionClick = (tipo) => {
        navigate('/cliente/historial', { state: { tipo } });
        handleHistorialClose();
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
        navigate('/login');
    };

    if (!user) {
        return (
            <AppBar position="static" sx={{ backgroundColor: themeColors.primary }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Button color="inherit" component={Link} to="/">Inicio</Button>
                        <Button color="inherit" component={Link} to="/login/emp">EMPLEADO</Button>
                        <Button color="inherit" component={Link} to="/shop">Catálogo</Button>
                    </Box>
                    <Box>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/login"
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            Login
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/registro"
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            Registro
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
        );
    }

    // Render para cliente
    if (user.role === 'CLIENTE') {
        return (
            <AppBar position="static" sx={{ backgroundColor: themeColors.primary }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }} display="flex" gap={2}>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/cliente/shop"
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            Catálogo
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/cliente/cart"
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            Carrito
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/cliente/reparacion"
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            Reparaciones
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/cliente/cuenta"
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            Cuenta
                        </Button>

                        <Button
                            color="inherit"
                            onClick={handleHistorialClick}
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            Historial
                        </Button>
                        <Menu
                            anchorEl={historialAnchorEl}
                            open={Boolean(historialAnchorEl)}
                            onClose={handleHistorialClose}
                            PaperProps={{
                                style: {
                                    backgroundColor: themeColors.paper,
                                    color: themeColors.textPrimary,
                                    border: `1px solid ${themeColors.border}`
                                }
                            }}
                        >
                            <MenuItem
                                onClick={() => handleHistorialOptionClick('compras')}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: themeColors.highlight
                                    }
                                }}
                            >
                                Historial Compras
                            </MenuItem>
                            <MenuItem
                                onClick={() => handleHistorialOptionClick('arriendos')}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: themeColors.highlight
                                    }
                                }}
                            >
                                Historial Arriendos
                            </MenuItem>
                            <MenuItem
                                onClick={() => handleHistorialOptionClick('reparaciones')}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: themeColors.highlight
                                    }
                                }}
                            >
                                Historial Reparaciones
                            </MenuItem>
                        </Menu>
                    </Box>
                    <Box>
                        <Button
                            color="inherit"
                            onClick={handleMenuClick}
                            startIcon={<Avatar sx={{
                                width: 24,
                                height: 24,
                                backgroundColor: themeColors.secondary,
                                color: themeColors.textPrimary
                            }}>{user.nombre.charAt(0)}</Avatar>}
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            {user.nombre}
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{
                                style: {
                                    backgroundColor: themeColors.paper,
                                    color: themeColors.textPrimary,
                                    border: `1px solid ${themeColors.border}`
                                }
                            }}
                        >
                            <MenuItem
                                onClick={handleLogout}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: themeColors.highlight
                                    }
                                }}
                            >
                                Cerrar sesión
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        );
    }

    // Render para inventario
    if (user.role === 'INVENTARIO') {
        return (
            <AppBar position="static" sx={{ backgroundColor: themeColors.primary }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }} display="flex" gap={2}>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/inventario/recepcion"
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            Bicicletas
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/inventario/ingresos"
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            Componentes
                        </Button>
                    </Box>
                    <Box>
                        <Button
                            color="inherit"
                            onClick={handleMenuClick}
                            startIcon={<Avatar sx={{
                                width: 24,
                                height: 24,
                                backgroundColor: themeColors.secondary,
                                color: themeColors.textPrimary
                            }}>{user.nombre.charAt(0)}</Avatar>}
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            {user.nombre}
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{
                                style: {
                                    backgroundColor: themeColors.paper,
                                    color: themeColors.textPrimary,
                                    border: `1px solid ${themeColors.border}`
                                }
                            }}
                        >
                            <MenuItem
                                onClick={handleLogout}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: themeColors.highlight
                                    }
                                }}
                            >
                                Cerrar sesión
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        );
    }
    if (user.role === 'VENDEDOR'){
        return(
            <AppBar position="static" sx={{ backgroundColor: themeColors.primary }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }} display="flex" gap={2}>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/vendedor/recepcion"
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            BICICLETAS
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/vendedor/ingresos"
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            COMPONENTES
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/vendedor/ventas"
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            REGISTRAR VENTAS
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/vendedor/ventas/resumen"
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            RESUMEN VENTAS
                        </Button>

                    </Box>
                    <Box>
                        <Button
                            color="inherit"
                            onClick={handleMenuClick}
                            startIcon={<Avatar sx={{
                                width: 24,
                                height: 24,
                                backgroundColor: themeColors.secondary,
                                color: themeColors.textPrimary
                            }}>{user.nombre.charAt(0)}</Avatar>}
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            {user.nombre}
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{
                                style: {
                                    backgroundColor: themeColors.paper,
                                    color: themeColors.textPrimary,
                                    border: `1px solid ${themeColors.border}`
                                }
                            }}
                        >
                            <MenuItem
                                onClick={handleLogout}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: themeColors.highlight
                                    }
                                }}
                            >
                                Cerrar sesión
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        );
    }
    if (user.role === 'TECNICO'){
        return(
            <AppBar position="static" sx={{ backgroundColor: themeColors.primary }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }} display="flex" gap={2}>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/tecnico/reparaciones"
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            REPARACIONES
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/tecnico/recepcion"
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            BICICLETAS
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/tecnico/ingresos"
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            COMPONENTES
                        </Button>
                    </Box>
                    <Box>
                        <Button
                            color="inherit"
                            onClick={handleMenuClick}
                            startIcon={<Avatar sx={{
                                width: 24,
                                height: 24,
                                backgroundColor: themeColors.secondary,
                                color: themeColors.textPrimary
                            }}>{user.nombre.charAt(0)}</Avatar>}
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            {user.nombre}
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{
                                style: {
                                    backgroundColor: themeColors.paper,
                                    color: themeColors.textPrimary,
                                    border: `1px solid ${themeColors.border}`
                                }
                            }}
                        >
                            <MenuItem
                                onClick={handleLogout}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: themeColors.highlight
                                    }
                                }}
                            >
                                Cerrar sesión
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        );
    }
    if(user.role === 'SUPERVISOR'){
        return(
            <AppBar position="static" sx={{ backgroundColor: themeColors.primary }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }} display="flex" gap={2}>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/supervisor/panel"
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            PANEL USUARIOS
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/supervisor/registro"
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            CREAR USUARIOS
                        </Button>

                        <Button
                            color="inherit"
                            component={Link}
                            to="/supervisor/ventas/resumen"
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            RESUMEN VENTAS
                        </Button>

                    </Box>

                    <Box>
                        <Button
                            color="inherit"
                            onClick={handleMenuClick}
                            startIcon={<Avatar sx={{
                                width: 24,
                                height: 24,
                                backgroundColor: themeColors.secondary,
                                color: themeColors.textPrimary
                            }}>{user.nombre.charAt(0)}</Avatar>}
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.secondary,
                                    color: themeColors.textPrimary
                                }
                            }}
                        >
                            {user.nombre}
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{
                                style: {
                                    backgroundColor: themeColors.paper,
                                    color: themeColors.textPrimary,
                                    border: `1px solid ${themeColors.border}`
                                }
                            }}
                        >
                            <MenuItem
                                onClick={handleLogout}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: themeColors.highlight
                                    }
                                }}
                            >
                                Cerrar sesión
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        );
    }

    // Render para otros roles
    return (
        <AppBar position="static" sx={{ backgroundColor: themeColors.primary }}>
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" color="inherit">
                        Panel de {user.role.toLowerCase()}
                    </Typography>
                </Box>
                <Box>
                    <Button
                        color="inherit"
                        onClick={handleMenuClick}
                        startIcon={<Avatar sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: themeColors.secondary,
                            color: themeColors.textPrimary
                        }}>{user.nombre.charAt(0)}</Avatar>}
                        sx={{
                            '&:hover': {
                                backgroundColor: themeColors.secondary,
                                color: themeColors.textPrimary
                            }
                        }}
                    >
                        {user.nombre}
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            style: {
                                backgroundColor: themeColors.paper,
                                color: themeColors.textPrimary,
                                border: `1px solid ${themeColors.border}`
                            }
                        }}
                    >
                        <MenuItem
                            onClick={handleLogout}
                            sx={{
                                '&:hover': {
                                    backgroundColor: themeColors.highlight
                                }
                            }}
                        >
                            Cerrar sesión
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}