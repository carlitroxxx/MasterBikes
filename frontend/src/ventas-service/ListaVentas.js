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
    Alert, Button
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';

const API_BASE_URL = "http://localhost:8081/api/ventas";

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
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error}
            </Alert>
        );
    }

    if (!ventas || ventas.length === 0) {
        return (
            <Typography variant="body1" sx={{ p: 3 }}>
                No hay ventas registradas
            </Typography>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Ventas Registradas
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
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
                            <TableRow key={item.id}>
                                <TableCell>{item.id?.substring(0, 8) || 'N/A'}</TableCell>
                                <TableCell>{formatDate(item.venta?.fecha)}</TableCell>
                                <TableCell>{item.venta?.cliente?.nombre}</TableCell>
                                <TableCell>{item.venta?.cliente?.rut}</TableCell>
                                <TableCell>{formatCurrency(item.venta?.total)}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleViewDetails(item)}
                                        color="primary"
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
            >
                <DialogTitle>Detalles de Venta</DialogTitle>
                <DialogContent>
                    {selectedVenta && (
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Venta ID: {selectedVenta.id || 'N/A'}
                            </Typography>
                            <Typography gutterBottom>
                                <strong>Fecha:</strong> {formatDate(selectedVenta.fecha)}
                            </Typography>
                            <Typography gutterBottom>
                                <strong>Estado:</strong> {selectedVenta.estado || 'DESCONOCIDO'}
                            </Typography>

                            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                                Datos del Cliente
                            </Typography>
                            <Typography><strong>Nombre:</strong> {selectedVenta.cliente?.nombre || 'No especificado'}</Typography>
                            <Typography><strong>RUT:</strong> {selectedVenta.cliente?.rut || 'No especificado'}</Typography>
                            {selectedVenta.cliente?.telefono && (
                                <Typography><strong>Teléfono:</strong> {selectedVenta.cliente.telefono}</Typography>
                            )}
                            {selectedVenta.cliente?.email && (
                                <Typography><strong>Email:</strong> {selectedVenta.cliente.email}</Typography>
                            )}

                            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                                Productos ({selectedVenta.productos?.length || 0})
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Producto</TableCell>
                                            <TableCell align="right">Cantidad</TableCell>
                                            <TableCell align="right">P. Unitario</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedVenta.productos?.map((producto, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{producto.nombre || 'Producto sin nombre'}</TableCell>
                                                <TableCell align="right">{producto.cantidad || 0}</TableCell>
                                                <TableCell align="right">{formatCurrency(producto.precioUnitario)}</TableCell>
                                                <TableCell align="right">{formatCurrency(producto.precioTotal)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle1" align="right">
                                    <strong>Subtotal:</strong> {formatCurrency(selectedVenta.subtotal)}
                                </Typography>
                                <Typography variant="subtitle1" align="right">
                                    <strong>IVA (16%):</strong> {formatCurrency(selectedVenta.iva)}
                                </Typography>
                                <Typography variant="h6" align="right" sx={{ mt: 1 }}>
                                    <strong>Total:</strong> {formatCurrency(selectedVenta.total)}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}