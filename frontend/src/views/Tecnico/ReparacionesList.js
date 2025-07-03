import React, { useState } from 'react';
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Paper,
    TextField,
    InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Snackbar, Alert } from '@mui/material';
// Definir la misma paleta de colores que en VentaForm.js
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

const ReparacionesList = () => {
    // Datos de ejemplo para el frontend
    const initialReparaciones = [
        {
            id: 1,
            rut: '12.345.678-9',
            fecha: '15-06-2023',
            hora: '10:30',
            tipo: 'Ajuste de frenos',
            telefono: '912345678',
            estado: 'En espera',
            descripcion: 'Los frenos delanteros no responden adecuadamente y hacen ruido al frenar.'
        },
        {
            id: 2,
            rut: '98.765.432-1',
            fecha: '16-06-2023',
            hora: '14:00',
            tipo: 'Cambio de cadena',
            telefono: '987654321',
            estado: 'Recibida',
            descripcion: 'La cadena se salta en ciertos cambios. Necesita reemplazo completo.'
        },
        {
            id: 3,
            rut: '11.222.333-4',
            fecha: '17-06-2023',
            hora: '11:15',
            tipo: 'Reparación de pinchazo',
            telefono: '911222333',
            estado: 'En proceso',
            descripcion: 'Rueda trasera con pinchazo. Necesita parche o posible reemplazo de cámara.'
        }
    ];

    const [reparaciones, setReparaciones] = useState(initialReparaciones);
    const [selectedReparacion, setSelectedReparacion] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [tempEstado, setTempEstado] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    // Filtrar reparaciones por RUT
    const filteredReparaciones = searchTerm
        ? reparaciones.filter(r =>
            r.rut.toLowerCase().includes(searchTerm.toLowerCase()))
        : reparaciones;

    const handleOpenDialog = (reparacion) => {
        setSelectedReparacion(reparacion);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleEstadoChange = (event, reparacion) => {
        setSelectedReparacion(reparacion);
        setTempEstado(event.target.value);
        setConfirmationOpen(true);
    };

    const confirmEstadoChange = () => {
        if (selectedReparacion && tempEstado) {
            const updatedReparaciones = reparaciones.map(r =>
                r.id === selectedReparacion.id ? {...r, estado: tempEstado} : r
            );
            setReparaciones(updatedReparaciones);

            // Actualizar también la reparación seleccionada en el popup
            setSelectedReparacion({...selectedReparacion, estado: tempEstado});

            // Mostrar notificación
            setSnackbarMessage(`Estado cambiado a "${tempEstado}"`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        }
        setConfirmationOpen(false);
        setTempEstado('');
    };

    const cancelEstadoChange = () => {
        setConfirmationOpen(false);
        setTempEstado('');
    };

    const getEstadoColor = (estado) => {
        switch(estado) {
            case 'En espera': return themeColors.warning;
            case 'Recibida': return themeColors.info;
            case 'En proceso': return themeColors.secondary;
            case 'Finalizada': return themeColors.success;
            case 'Cancelada':
            case 'No reparada':
                return themeColors.error;
            default: return themeColors.textPrimary;
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <Box sx={{
            maxWidth: 1200,
            mx: 'auto',
            p: 3,
            backgroundColor: themeColors.background,
            minHeight: '100vh'
        }}>
            <Typography variant="h4" gutterBottom align="center" sx={{
                mb: 4,
                color: themeColors.primary,
                fontWeight: 'bold'
            }}>
                Reparaciones Programadas
            </Typography>

            {/* Campo de búsqueda */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Buscar por RUT"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: themeColors.paper,
                            '& fieldset': {
                                borderColor: themeColors.border,
                            },
                            '&:hover fieldset': {
                                borderColor: themeColors.primary,
                            },
                        }
                    }}
                />
            </Box>

            <Paper elevation={3} sx={{
                overflowX: 'auto',
                backgroundColor: themeColors.paper,
                border: `1px solid ${themeColors.border}`,
                borderRadius: '12px'
            }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{
                            backgroundColor: themeColors.primary,
                            '& th': {
                                color: '#fff',
                                fontWeight: 'bold',
                                py: 1
                            }
                        }}>
                            <TableCell>RUT</TableCell>
                            <TableCell>FECHA</TableCell>
                            <TableCell>HORA</TableCell>
                            <TableCell>TIPO REPARACIÓN</TableCell>
                            <TableCell>TELÉFONO</TableCell>
                            <TableCell>ESTADO</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredReparaciones.map((r) => (
                            <TableRow
                                key={r.id}
                                hover
                                onClick={(e) => {
                                    // Solo abre el diálogo si el click no fue en el Select
                                    if (!e.target.closest('.MuiSelect-select')) {
                                        handleOpenDialog(r);
                                    }
                                }}
                                sx={{
                                    cursor: 'pointer',
                                    '&:nth-of-type(even)': {
                                        backgroundColor: themeColors.highlight
                                    },
                                    '& .MuiTableCell-root': {
                                        py: 1,
                                        color: themeColors.textPrimary
                                    }
                                }}
                            >
                                <TableCell>{r.rut}</TableCell>
                                <TableCell>{r.fecha}</TableCell>
                                <TableCell>{r.hora}</TableCell>
                                <TableCell>{r.tipo}</TableCell>
                                <TableCell>{r.telefono}</TableCell>
                                <TableCell>
                                    <Select
                                        value={r.estado}
                                        onChange={(e) => handleEstadoChange(e, r)}
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{
                                            color: getEstadoColor(r.estado),
                                            minWidth: 120,
                                            height: 32,
                                            '& .MuiSelect-select': {
                                                py: 1
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: getEstadoColor(r.estado)
                                            }
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    maxHeight: 200,
                                                    backgroundColor: themeColors.paper
                                                }
                                            }
                                        }}
                                    >
                                        <MenuItem value="En espera">En espera</MenuItem>
                                        <MenuItem value="Recibida">Recibida</MenuItem>
                                        <MenuItem value="En proceso">En proceso</MenuItem>
                                        <MenuItem value="Finalizada">Finalizada</MenuItem>
                                        <MenuItem value="Cancelada">Cancelada</MenuItem>
                                        <MenuItem value="No reparada">No reparada</MenuItem>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            {/* Diálogo de detalles */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle sx={{
                    backgroundColor: themeColors.primary,
                    color: '#fff',
                    fontWeight: 'bold'
                }}>
                    Detalles de la Reparación
                </DialogTitle>
                <DialogContent dividers sx={{ backgroundColor: themeColors.background }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ color: themeColors.textPrimary }}>
                            <strong>RUT:</strong> {selectedReparacion?.rut} |
                            <strong> FECHA:</strong> {selectedReparacion?.fecha} |
                            <strong> HORA:</strong> {selectedReparacion?.hora}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ color: themeColors.textPrimary }}>
                            <strong>TIPO REPARACIÓN:</strong>
                        </Typography>
                        <Typography sx={{ color: themeColors.textSecondary }}>{selectedReparacion?.tipo}</Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ color: themeColors.textPrimary }}>
                            <strong>DESCRIPCIÓN DETALLADA:</strong>
                        </Typography>
                        <Typography sx={{ color: themeColors.textSecondary }}>{selectedReparacion?.descripcion}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ color: themeColors.textPrimary }}>
                            <strong>TELÉFONO:</strong> {selectedReparacion?.telefono}
                        </Typography>
                        <Select
                            value={selectedReparacion?.estado || ''}
                            onChange={(e) => {
                                setTempEstado(e.target.value);
                                setConfirmationOpen(true);
                            }}
                            sx={{
                                color: getEstadoColor(selectedReparacion?.estado),
                                minWidth: 120,
                                height: 32,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: getEstadoColor(selectedReparacion?.estado)
                                }
                            }}
                        >
                            <MenuItem value="En espera">En espera</MenuItem>
                            <MenuItem value="Recibida">Recibida</MenuItem>
                            <MenuItem value="En proceso">En proceso</MenuItem>
                            <MenuItem value="Finalizada">Finalizada</MenuItem>
                            <MenuItem value="Cancelada">Cancelada</MenuItem>
                            <MenuItem value="No reparada">No reparada</MenuItem>
                        </Select>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: themeColors.background }}>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{
                            color: themeColors.textSecondary,
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
                        }}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de confirmación */}
            <Dialog open={confirmationOpen} onClose={cancelEstadoChange}>
                <DialogTitle sx={{
                    backgroundColor: themeColors.primary,
                    color: '#fff',
                    fontWeight: 'bold'
                }}>
                    Confirmar cambio de estado
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: themeColors.background, py: 3 }}>
                    <Typography sx={{ color: themeColors.textPrimary }}>
                        ¿Estás seguro que deseas cambiar el estado a "{tempEstado}"?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: themeColors.background }}>
                    <Button
                        onClick={cancelEstadoChange}
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
                        onClick={confirmEstadoChange}
                        sx={{
                            backgroundColor: themeColors.success,
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#2E7D32',
                            },
                            fontWeight: 'bold'
                        }}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Notificación Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ReparacionesList;