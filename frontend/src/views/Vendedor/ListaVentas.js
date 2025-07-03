import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Button
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';

const API_BASE_URL = "http://localhost:8082/api/ventas";

// Paleta de colores idéntica a VentaForm.js
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

export default function ListaVentas() {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedVenta, setSelectedVenta] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const fetchVentas = async () => {
            try {
                const response = await axios.get(API_BASE_URL);
                console.log("Datos recibidos:", response.data);

                const ventasProcesadas = Array.isArray(response.data)
                    ? response.data.map(item => ({
                        ...item,
                        venta: {
                            ...(item.venta || {}),
                            cliente: item.venta?.cliente || {
                                nombre: 'Cliente no especificado',
                                rut: 'Sin RUT'
                            },
                            productos: item.venta?.productos || [],
                            fecha: item.venta?.fecha || new Date().toISOString(),
                            estado: item.venta?.estado || 'DESCONOCIDO'
                        }
                    }))
                    : [];

                setVentas(ventasProcesadas);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching sales:", err);
                setError(err.response?.data?.message || 'Error al cargar las ventas');
                setLoading(false);
            }
        };

        fetchVentas();
    }, []);

    const handleViewDetails = (ventaItem) => {
        setSelectedVenta(ventaItem.venta);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(value || 0);
    };

    const formatDate = (dateString) => {
        return dayjs(dateString).isValid()
            ? dayjs(dateString).format('DD/MM/YYYY HH:mm')
            : 'Fecha no válida';
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                p: 4,
                backgroundColor: themeColors.background,
                minHeight: '100vh'
            }}>
                <CircularProgress sx={{ color: themeColors.primary }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ backgroundColor: themeColors.background, p: 2 }}>
                <Alert severity="error" sx={{
                    backgroundColor: themeColors.error,
                    color: '#fff'
                }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!ventas || ventas.length === 0) {
        return (
            <Box sx={{
                backgroundColor: themeColors.background,
                p: 3,
                minHeight: '100vh'
            }}>
                <Typography variant="body1" sx={{ color: themeColors.textPrimary }}>
                    No hay ventas registradas
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>

        <Box sx={{
            p: 3,
            backgroundColor: themeColors.background,
            minHeight: '100vh'
        }}>
            <Typography variant="h4" gutterBottom sx={{
                mb: 3,
                color: themeColors.primary,
                fontWeight: 'bold'
            }}>
                Ventas Registradas
            </Typography>

            <TableContainer component={Paper} sx={{
                border: `1px solid ${themeColors.border}`,
                borderRadius: '8px',
                boxShadow: 3
            }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{
                            backgroundColor: themeColors.primary,
                            '& th': {
                                color: '#fff',
                                fontWeight: 'bold'
                            }
                        }}>
                            <TableCell>ID</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>RUT</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ventas.map((item) => (
                            <TableRow
                                key={item.id}
                                sx={{
                                    '&:nth-of-type(odd)': {
                                        backgroundColor: themeColors.highlight
                                    },
                                    '&:hover': {
                                        backgroundColor: '#e0e0e0'
                                    }
                                }}
                            >
                                <TableCell sx={{ color: themeColors.textPrimary }}>{item.id?.substring(0, 8) || 'N/A'}</TableCell>
                                <TableCell sx={{ color: themeColors.textPrimary }}>{formatDate(item.venta?.fecha)}</TableCell>
                                <TableCell sx={{ color: themeColors.textPrimary }}>{item.venta?.cliente?.nombre}</TableCell>
                                <TableCell sx={{ color: themeColors.textPrimary }}>{item.venta?.cliente?.rut}</TableCell>
                                <TableCell sx={{ color: themeColors.textPrimary }}>{formatCurrency(item.venta?.total)}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleViewDetails(item)}
                                        sx={{ color: themeColors.primary }}
                                    >
                                        <Visibility />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Diálogo de detalles */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: themeColors.background,
                        border: `1px solid ${themeColors.border}`
                    }
                }}
            >
                <DialogTitle sx={{
                    backgroundColor: themeColors.primary,
                    color: '#fff',
                    fontWeight: 'bold'
                }}>
                    Detalles de Venta
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: themeColors.background }}>
                    {selectedVenta && (
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ color: themeColors.primary }}>
                                Venta ID: {selectedVenta.id || 'N/A'}
                            </Typography>
                            <Typography gutterBottom sx={{ color: themeColors.textPrimary }}>
                                <strong>Fecha:</strong> {formatDate(selectedVenta.fecha)}
                            </Typography>
                            <Typography gutterBottom sx={{ color: themeColors.textPrimary }}>
                                <strong>Estado:</strong> {selectedVenta.estado || 'DESCONOCIDO'}
                            </Typography>

                            <Typography variant="h6" sx={{
                                mt: 3,
                                mb: 2,
                                color: themeColors.primary
                            }}>
                                Datos del Cliente
                            </Typography>
                            <Typography sx={{ color: themeColors.textPrimary }}>
                                <strong>Nombre:</strong> {selectedVenta.cliente?.nombre || 'No especificado'}
                            </Typography>
                            <Typography sx={{ color: themeColors.textPrimary }}>
                                <strong>RUT:</strong> {selectedVenta.cliente?.rut || 'No especificado'}
                            </Typography>
                            {selectedVenta.cliente?.telefono && (
                                <Typography sx={{ color: themeColors.textPrimary }}>
                                    <strong>Teléfono:</strong> {selectedVenta.cliente.telefono}
                                </Typography>
                            )}
                            {selectedVenta.cliente?.email && (
                                <Typography sx={{ color: themeColors.textPrimary }}>
                                    <strong>Email:</strong> {selectedVenta.cliente.email}
                                </Typography>
                            )}

                            <Typography variant="h6" sx={{
                                mt: 3,
                                mb: 2,
                                color: themeColors.primary
                            }}>
                                Productos ({selectedVenta.productos?.length || 0})
                            </Typography>
                            <TableContainer component={Paper} sx={{
                                border: `1px solid ${themeColors.border}`,
                                borderRadius: '8px'
                            }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{
                                            backgroundColor: themeColors.primary,
                                            '& th': {
                                                color: '#fff',
                                                fontWeight: 'bold'
                                            }
                                        }}>
                                            <TableCell>Producto</TableCell>
                                            <TableCell align="right">Cantidad</TableCell>
                                            <TableCell align="right">P. Unitario</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedVenta.productos?.map((producto, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{
                                                    '&:nth-of-type(odd)': {
                                                        backgroundColor: themeColors.highlight
                                                    }
                                                }}
                                            >
                                                <TableCell sx={{ color: themeColors.textPrimary }}>{producto.nombre || 'Producto sin nombre'}</TableCell>
                                                <TableCell align="right" sx={{ color: themeColors.textPrimary }}>{producto.cantidad || 0}</TableCell>
                                                <TableCell align="right" sx={{ color: themeColors.textPrimary }}>{formatCurrency(producto.precioUnitario)}</TableCell>
                                                <TableCell align="right" sx={{ color: themeColors.textPrimary }}>{formatCurrency(producto.precioTotal)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle1" align="right" sx={{ color: themeColors.textPrimary }}>
                                    <strong>Subtotal:</strong> {formatCurrency(selectedVenta.subtotal)}
                                </Typography>
                                <Typography variant="subtitle1" align="right" sx={{ color: themeColors.textPrimary }}>
                                    <strong>IVA (16%):</strong> {formatCurrency(selectedVenta.iva)}
                                </Typography>
                                <Typography variant="h6" align="right" sx={{
                                    mt: 1,
                                    color: themeColors.primary,
                                    fontWeight: 'bold'
                                }}>
                                    <strong>Total:</strong> {formatCurrency(selectedVenta.total)}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ backgroundColor: themeColors.background }}>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{
                            color: themeColors.textPrimary,
                            '&:hover': {
                                backgroundColor: themeColors.highlight
                            }
                        }}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
        </Box>
    );
}