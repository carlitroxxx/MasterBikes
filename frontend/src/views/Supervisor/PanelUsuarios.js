import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Table, TableHead, TableRow, TableCell,
    TableBody, TableContainer, Paper, Box,
    TextField, Button, FormControl, InputLabel, Select, MenuItem,
    Snackbar, Alert, Grid, Chip,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, InputAdornment
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Refresh as RefreshIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';

const API_URL = 'http://mb-usuario.onrender.com/api/auth';

// Paleta de colores de VentaForm
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

export default function PanelUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtroRol, setFiltroRol] = useState('TODOS');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [dialogAbierto, setDialogAbierto] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [nuevoEstado, setNuevoEstado] = useState(false);

    const roles = ['TODOS', 'SUPERVISOR', 'TECNICO', 'INVENTARIO', 'VENDEDOR', 'CLIENTE'];

    useEffect(() => {
        cargarUsuarios();
    }, []);

    useEffect(() => {
        aplicarFiltros();
    }, [usuarios, busqueda, filtroRol]);

    const cargarUsuarios = async () => {
        try {
            const response = await axios.get(`${API_URL}/users`);
            const usuariosProcesados = response.data.map(user => ({
                ...user,
                enabled: user.enabled !== false,
                fechaFormateada: formatearFecha(user.fechaCreacion)
            }));
            setUsuarios(usuariosProcesados);
            showSnackbar('Usuarios cargados correctamente', 'success');
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            showSnackbar('Error al cargar usuarios', 'error');
        }
    };

    const aplicarFiltros = () => {
        let resultado = [...usuarios];

        if (filtroRol !== 'TODOS') {
            resultado = resultado.filter(user => user.role === filtroRol);
        }

        if (busqueda) {
            const termino = busqueda.toLowerCase();
            resultado = resultado.filter(user =>
                (user.rut && user.rut.toLowerCase().includes(termino)) ||
                (user.nombre && user.nombre.toLowerCase().includes(termino)) ||
                (user.email && user.email.toLowerCase().includes(termino))
            );
        }

        setUsuariosFiltrados(resultado);
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return 'No disponible';
        return dayjs(fecha).format('DD/MM/YYYY HH:mm');
    };

    const handleClickEstado = (usuario) => {
        // Verificar si el usuario es un supervisor
        if (usuario.role === 'SUPERVISOR') {
            showSnackbar('No puedes cambiar el estado de una cuenta de supervisor', 'warning');
            return;
        }

        setUsuarioSeleccionado(usuario);
        setNuevoEstado(!usuario.enabled);
        setDialogAbierto(true);
    };
    const confirmarCambioEstado = async () => {
        // Verificación adicional por seguridad
        if (usuarioSeleccionado?.role === 'SUPERVISOR') {
            showSnackbar('Operación no permitida para cuentas de supervisor', 'error');
            setDialogAbierto(false);
            return;
        }

        try {
            await axios.patch(`${API_URL}/users/${usuarioSeleccionado.id}/status`, {
                enabled: nuevoEstado
            });
            cargarUsuarios();
            showSnackbar(
                `Usuario ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`,
                'success'
            );
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            showSnackbar('Error al cambiar el estado', 'error');
        } finally {
            setDialogAbierto(false);
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const renderEstado = (usuario) => {
        const esSupervisor = usuario.role === 'SUPERVISOR';

        return (
            <Chip
                icon={usuario.enabled ?
                    <CheckCircleIcon fontSize="small" /> :
                    <CancelIcon fontSize="small" />}
                label={usuario.enabled ? "Activo" : "Inactivo"}
                color={usuario.enabled ? "success" : "error"}
                size="small"
                clickable={!esSupervisor}
                onClick={!esSupervisor ? () => handleClickEstado(usuario) : undefined}
                sx={{
                    '&:hover': {
                        opacity: esSupervisor ? 1 : 0.8,
                        cursor: esSupervisor ? 'default' : 'pointer'
                    },
                    opacity: esSupervisor ? 0.7 : 1
                }}
            />
        );
    };

    return (
        <Container maxWidth="lg" sx={{
            mt: 4,
            mb: 4,
            backgroundColor: themeColors.background,
            p: 3,
            borderRadius: '12px'
        }}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold" color={themeColors.primary}>
                        Supervisión de Usuarios
                    </Typography>
                    <Typography variant="body2" color={themeColors.textSecondary}>
                        Total: {usuarios.length} usuarios | Mostrando: {usuariosFiltrados.length}
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={cargarUsuarios}
                    sx={{
                        borderColor: themeColors.primary,
                        color: themeColors.primary,
                        '&:hover': {
                            backgroundColor: themeColors.highlight,
                            borderColor: themeColors.primary
                        }
                    }}
                >
                    Actualizar
                </Button>
            </Box>

            {/* Filtros */}
            <Paper elevation={0} sx={{
                p: 2,
                mb: 3,
                border: `1px solid ${themeColors.border}`,
                backgroundColor: themeColors.paper,
                borderRadius: '8px'
            }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8} width={'35%'}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Buscar usuarios por RUT, nombre o email..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                            }}
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: themeColors.border,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: themeColors.primary,
                                    },
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Filtrar por rol</InputLabel>
                            <Select
                                value={filtroRol}
                                onChange={(e) => setFiltroRol(e.target.value)}
                                label="Filtrar por rol"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <FilterIcon color="action" />
                                    </InputAdornment>
                                }
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: themeColors.border,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: themeColors.primary,
                                        },
                                    }
                                }}
                            >
                                {roles.map((rol) => (
                                    <MenuItem key={rol} value={rol}>
                                        {rol}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabla de usuarios */}
            <Paper elevation={0} sx={{
                border: `1px solid ${themeColors.border}`,
                backgroundColor: themeColors.paper,
                borderRadius: '8px'
            }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{
                                backgroundColor: themeColors.primary,
                                '& th': {
                                    color: '#fff',
                                    fontWeight: 'bold'
                                }
                            }}>
                                <TableCell>Rol</TableCell>
                                <TableCell>RUT</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Fecha Creación</TableCell>
                                <TableCell>Estado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {usuariosFiltrados.length > 0 ? (
                                usuariosFiltrados.map((usuario) => (
                                    <TableRow
                                        key={usuario.id}
                                        hover
                                        sx={{
                                            '&:nth-of-type(odd)': {
                                                backgroundColor: themeColors.highlight
                                            }
                                        }}
                                    >
                                        <TableCell>
                                            <Chip
                                                label={usuario.role}
                                                color={
                                                    usuario.role === 'SUPERVISOR' ? 'primary' :
                                                        usuario.role === 'TECNICO' ? 'secondary' :
                                                            usuario.role === 'INVENTARIO' ? 'info' :
                                                                usuario.role === 'VENDEDOR' ? 'warning' :
                                                                    'default'
                                                }
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{usuario.rut || 'No especificado'}</TableCell>
                                        <TableCell>{usuario.nombre || 'No especificado'}</TableCell>
                                        <TableCell>{usuario.email || 'No especificado'}</TableCell>
                                        <TableCell>{usuario.fechaFormateada}</TableCell>
                                        <TableCell>
                                            {renderEstado(usuario)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body1" color={themeColors.textSecondary}>
                                            No se encontraron usuarios
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Diálogo de confirmación */}
            <Dialog
                open={dialogAbierto}
                onClose={() => setDialogAbierto(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{
                        backgroundColor: themeColors.primary,
                        color: '#fff',
                        fontWeight: 'bold'
                    }}
                >
                    Confirmar cambio de estado
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={{ mt: 2 }}>
                        ¿Estás seguro que deseas {nuevoEstado ? 'activar' : 'desactivar'} la cuenta de {usuarioSeleccionado?.nombre} ({usuarioSeleccionado?.email})?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDialogAbierto(false)}
                        sx={{
                            color: themeColors.textSecondary,
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={confirmarCambioEstado}
                        variant="contained"
                        sx={{
                            backgroundColor: nuevoEstado ? themeColors.success : themeColors.error,
                            '&:hover': {
                                backgroundColor: nuevoEstado ? '#1B5E20' : '#B71C1C'
                            },
                            fontWeight: 'bold'
                        }}
                        autoFocus
                    >
                        {nuevoEstado ? 'Activar' : 'Desactivar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notificación */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}