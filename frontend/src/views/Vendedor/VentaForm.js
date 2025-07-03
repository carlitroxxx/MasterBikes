// src/components/VentaForm.js
import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Grid,
    Typography,
    InputAdornment,
    CircularProgress,
    Alert,
    Paper,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Autocomplete,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const themeColors = {
    primary: '#0A2E5A',      // Azul marino profundo (90% más oscuro que el anterior)
    secondary: '#FFA000',    // Ámbar dorado (un toque más suave que el naranja)
    accent: '#26A69A',       // Verde turquesa (más sobrio)
    background: '#F5F7FA',   // Gris azulado claro (10% más frío)
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
export default function VentaForm({ onVentaCreada }) {
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [openBoletaModal, setOpenBoletaModal] = useState(false);
    const API_BASE_URL = "http://localhost:8082/api/ventas";
    const [productoActual, setProductoActual] = useState({
        id: '',
        nombre: '',
        cantidad: 1,
        precioUnitario: '',
        precioTotal: ''
    });
    const [cliente, setCliente] = useState({
        rut: '',
        nombre: '',
        telefono: '',
        email: '',
        direccion: ''
    });
    const [clienteGuardado, setClienteGuardado] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Simulando carga de productos desde API
        const fetchProductos = async () => {
            try {
                const mockProductos = [
                    { id: 1, nombre: 'Bicicleta MTB', precio: 1200, stock: 10 },
                    { id: 2, nombre: 'Bicicleta Ruta', precio: 1500, stock: 5 },
                    { id: 3, nombre: 'Casco Profesional', precio: 80, stock: 20 },
                    { id: 4, nombre: 'Guantes', precio: 25, stock: 30 },
                    { id: 5, nombre: 'Luz Delantera', precio: 35, stock: 15 },
                ];
                setProductosDisponibles(mockProductos);
                setProductosFiltrados(mockProductos);
            } catch (err) {
                setError('Error al cargar los productos');
            }
        };

        fetchProductos();
    }, []);

    const handleProductoChange = (event, newValue) => {
        if (newValue) {
            setProductoActual({
                id: newValue.id,
                nombre: newValue.nombre,
                cantidad: 1,
                precioUnitario: newValue.precio,
                precioTotal: newValue.precio
            });
            setError('');
        } else {
            setProductoActual({
                id: '',
                nombre: '',
                cantidad: 1,
                precioUnitario: '',
                precioTotal: ''
            });
        }
    };

    const handleFilterChange = (event, value) => {
        if (value) {
            const filtered = productosDisponibles.filter(producto =>
                producto.id.toString().includes(value) ||
                producto.nombre.toLowerCase().includes(value.toLowerCase())
            );
            setProductosFiltrados(filtered);
        } else {
            setProductosFiltrados(productosDisponibles);
        }
    };

    const handleCantidadChange = (e) => {
        const cantidad = parseInt(e.target.value) || 0;
        const precioTotal = cantidad * productoActual.precioUnitario;

        setProductoActual(prev => ({
            ...prev,
            cantidad,
            precioTotal
        }));
    };

    const agregarProducto = () => {
        if (!productoActual.id || productoActual.cantidad <= 0) {
            setError('Selecciona un producto y una cantidad válida');
            return;
        }

        const productoExistente = productosSeleccionados.find(p => p.id === productoActual.id);

        if (productoExistente) {
            setProductosSeleccionados(prev =>
                prev.map(p =>
                    p.id === productoActual.id
                        ? { ...p, cantidad: p.cantidad + productoActual.cantidad, precioTotal: (p.cantidad + productoActual.cantidad) * p.precioUnitario }
                        : p
                )
            );
        } else {
            setProductosSeleccionados(prev => [
                ...prev,
                {
                    id: productoActual.id,
                    nombre: productoActual.nombre,
                    cantidad: productoActual.cantidad,
                    precioUnitario: productoActual.precioUnitario,
                    precioTotal: productoActual.precioTotal
                }
            ]);
        }

        setProductoActual({
            id: '',
            nombre: '',
            cantidad: 1,
            precioUnitario: '',
            precioTotal: ''
        });
    };

    const eliminarProducto = (id) => {
        setProductosSeleccionados(prev => prev.filter(p => p.id !== id));
    };

    const calcularTotal = () => {
        return productosSeleccionados.reduce((total, producto) => total + producto.precioTotal, 0);
    };

    const handleClienteChange = (e) => {
        const { name, value } = e.target;
        setCliente(prev => ({ ...prev, [name]: value }));
    };

    const formatRut = (rut) => {
        const cleanRut = rut.replace(/[.-]/g, '');
        if (cleanRut.length <= 1) return cleanRut;
        if (cleanRut.length <= 4) return `${cleanRut.slice(0, -1)}.${cleanRut.slice(-1)}`;
        if (cleanRut.length <= 7) return `${cleanRut.slice(0, -4)}.${cleanRut.slice(-4, -1)}.${cleanRut.slice(-1)}`;
        return `${cleanRut.slice(0, -7)}.${cleanRut.slice(-7, -4)}.${cleanRut.slice(-4, -1)}-${cleanRut.slice(-1)}`;
    };

    const handleRutChange = (e) => {
        const { value } = e.target;
        const cleanValue = value.replace(/[^0-9kK]/g, '');
        const formattedValue = formatRut(cleanValue);
        setCliente(prev => ({ ...prev, rut: formattedValue }));
    };

    const handleOpenModal = () => {
        if (productosSeleccionados.length === 0) {
            setError('Debes agregar al menos un producto');
            return;
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSaveCliente = () => {
        if (!cliente.rut || !cliente.nombre) {
            setError('RUT y nombre del cliente son obligatorios');
            return;
        }
        setClienteGuardado({ ...cliente });
        setOpenModal(false);
        setError('');
    };

    const handleEditCliente = () => {
        setCliente(clienteGuardado || {
            rut: '',
            nombre: '',
            telefono: '',
            email: '',
            direccion: ''
        });
        setOpenModal(true);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            if (!clienteGuardado) {
                throw new Error('Debes ingresar los datos del cliente');
            }

            if (productosSeleccionados.length === 0) {
                throw new Error('Debes agregar al menos un producto');
            }

            // Preparar los datos para enviar al backend
            const ventaRequest = {
                cliente: clienteGuardado,
                productos: productosSeleccionados.map(p => ({
                    idProducto: p.id,
                    nombre: p.nombre,
                    cantidad: p.cantidad,
                    precioUnitario: p.precioUnitario,
                    precioTotal: p.precioTotal
                }))
            };

            // Enviar la solicitud al backend
            const response = await axios.post(API_BASE_URL, ventaRequest);

            // Mostrar la respuesta del backend
            setSuccess(response.data.mensaje);
            setOpenBoletaModal(true);

        } catch (err) {
            // Manejar errores de la API o de validación
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                'Error al registrar la venta';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // En el componente VentaForm
    const handleCloseBoleta = () => {
        setOpenBoletaModal(false);
        // Verificar si es función antes de llamar
        if (typeof onVentaCreada === 'function') {
            onVentaCreada(); // Recargar lista de ventas
        }
        // Resetear formulario
        setProductosSeleccionados([]);
        setClienteGuardado(null);
        setCliente({
            rut: '',
            nombre: '',
            telefono: '',
            email: '',
            direccion: ''
        });
    };

// Al final del componente, antes del export
    VentaForm.defaultProps = {
        onVentaCreada: () => console.log('Callback de venta creada no proporcionado')
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            width: '100%',
            backgroundColor: themeColors.background,
            p: { xs: 2, md: 3 },
            minHeight: '100vh'
        }}>
            {/* Panel izquierdo - Formulario de productos */}
            <Paper elevation={3} sx={{
                p: 3,
                flex: 1,
                minWidth: { md: '50%' },
                backgroundColor: themeColors.paper,
                border: `1px solid ${themeColors.border}`,
                borderRadius: '12px',
                maxHeight: "fit-content"
            }}>
                <Typography variant="h5" gutterBottom sx={{
                    fontWeight: 'bold',
                    mb: 3,
                    color: themeColors.primary,
                    borderBottom: `2px solid ${themeColors.primary}`,
                    pb: 1
                }}>
                    Agregar Productos
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2, backgroundColor: themeColors.error }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2, backgroundColor: themeColors.success }}>{success}</Alert>}

                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Autocomplete
                        options={productosFiltrados}
                        getOptionLabel={(option) => `${option.id} - ${option.nombre}`}
                        value={productosDisponibles.find(p => p.id === productoActual.id) || null}
                        onChange={handleProductoChange}
                        onInputChange={handleFilterChange}
                        filterOptions={(options) => options}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Buscar producto por ID o nombre"
                                fullWidth
                                margin="normal"
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
                        )}
                        noOptionsText="No se encontraron productos"
                    />

                    <TextField
                        label="Nombre del Producto"
                        fullWidth
                        margin="normal"
                        value={productoActual.nombre}
                        InputProps={{
                            readOnly: true
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: themeColors.highlight,
                                '& fieldset': {
                                    borderColor: themeColors.border,
                                },
                            }
                        }}
                    />

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Precio Unitario"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={productoActual.precioUnitario}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    readOnly: true
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: themeColors.highlight,
                                        '& fieldset': {
                                            borderColor: themeColors.border,
                                        },
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                label="Cantidad"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={productoActual.cantidad}
                                onChange={handleCantidadChange}
                                inputProps={{ min: 1 }}
                                required
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
                    </Grid>

                    <Button
                        variant="contained"
                        onClick={agregarProducto}
                        startIcon={<AddIcon />}
                        fullWidth
                        sx={{
                            mt: 1,
                            mb: 3,
                            backgroundColor: themeColors.secondary,
                            '&:hover': {
                                backgroundColor: '#E65100',
                            },
                            py: 1.5,
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '1rem'
                        }}
                        disabled={!productoActual.id}
                    >
                        Agregar Producto
                    </Button>
                </Box>
            </Paper>

            {/* Panel derecho - Resumen de venta */}
            <Paper elevation={3} sx={{
                p: 3,
                flex: 1,
                minWidth: { md: '50%' },
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: themeColors.paper,
                border: `1px solid ${themeColors.border}`,
                borderRadius: '12px',
                maxHeight: "fit-content"
            }}>
                <Typography variant="h5" gutterBottom sx={{
                    fontWeight: 'bold',
                    mb: 3,
                    color: themeColors.primary,
                    borderBottom: `2px solid ${themeColors.primary}`,
                    pb: 1
                }}>
                    Resumen de Venta
                </Typography>

                {productosSeleccionados.length === 0 ? (
                    <Typography variant="body1" sx={{
                        textAlign: 'center',
                        py: 4,
                        flexGrow: 1,
                        color: themeColors.textSecondary
                    }}>
                        No hay productos agregados
                    </Typography>
                ) : (
                    <>
                        <TableContainer sx={{ flexGrow: 1 }}>
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
                                        <TableCell align="right">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {productosSeleccionados.map((producto) => (
                                        <TableRow
                                            key={producto.id}
                                            sx={{
                                                '&:nth-of-type(odd)': {
                                                    backgroundColor: themeColors.highlight
                                                },
                                                '&:last-child td': {
                                                    borderBottom: 'none'
                                                }
                                            }}
                                        >
                                            <TableCell>{producto.nombre}</TableCell>
                                            <TableCell align="right">{producto.cantidad}</TableCell>
                                            <TableCell align="right">${producto.precioUnitario.toFixed(2)}</TableCell>
                                            <TableCell align="right">${producto.precioTotal.toFixed(2)}</TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    onClick={() => eliminarProducto(producto.id)}
                                                    size="small"
                                                    sx={{
                                                        color: themeColors.error,
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(211, 47, 47, 0.08)'
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Divider sx={{
                            my: 2,
                            borderColor: themeColors.border
                        }} />

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 2,
                            p: 1,
                            backgroundColor: themeColors.highlight,
                            borderRadius: '4px'
                        }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Subtotal:</Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>${calcularTotal().toFixed(2)}</Typography>
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 2,
                            p: 1,
                            backgroundColor: themeColors.highlight,
                            borderRadius: '4px'
                        }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>IVA (16%):</Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>${(calcularTotal() * 0.16).toFixed(2)}</Typography>
                        </Box>

                        <Divider sx={{
                            my: 2,
                            borderColor: themeColors.border
                        }} />

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 3,
                            p: 2,
                            backgroundColor: themeColors.primary,
                            color: '#fff',
                            borderRadius: '8px'
                        }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total:</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>${(calcularTotal() * 1.16).toFixed(2)}</Typography>
                        </Box>
                    </>
                )}

                {/* Sección de información del cliente */}
                {clienteGuardado && (
                    <Box sx={{
                        mt: 'auto',
                        p: 2,
                        backgroundColor: themeColors.highlight,
                        borderRadius: '8px',
                        position: 'relative',
                        border: `1px solid ${themeColors.border}`
                    }}>
                        <IconButton
                            onClick={handleEditCliente}
                            size="small"
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: themeColors.accent,
                                '&:hover': {
                                    backgroundColor: 'rgba(21, 101, 192, 0.08)'
                                }
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>

                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Cliente: {clienteGuardado.nombre}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            <Box component="span" sx={{ fontWeight: 'bold' }}>RUT:</Box> {clienteGuardado.rut}
                        </Typography>
                        {clienteGuardado.telefono && (
                            <Typography variant="body2" gutterBottom>
                                <Box component="span" sx={{ fontWeight: 'bold' }}>Teléfono:</Box> {clienteGuardado.telefono}
                            </Typography>
                        )}
                        {clienteGuardado.email && (
                            <Typography variant="body2" gutterBottom>
                                <Box component="span" sx={{ fontWeight: 'bold' }}>Email:</Box> {clienteGuardado.email}
                            </Typography>
                        )}
                        {clienteGuardado.direccion && (
                            <Typography variant="body2">
                                <Box component="span" sx={{ fontWeight: 'bold' }}>Dirección:</Box> {clienteGuardado.direccion}
                            </Typography>
                        )}
                    </Box>
                )}

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={clienteGuardado ? handleSubmit : handleOpenModal}
                    disabled={productosSeleccionados.length === 0 || loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                    sx={{
                        mt: 3,
                        py: 2,
                        backgroundColor: themeColors.success,
                        '&:hover': {
                            backgroundColor: '#2E7D32',
                        },
                        '&:disabled': {
                            backgroundColor: '#BDBDBD',
                            color: '#757575'
                        },
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                    }}
                >
                    {loading ? 'Procesando...' : 'Confirmar Venta'}
                </Button>
            </Paper>

            {/* Modal para datos del cliente */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{
                    backgroundColor: themeColors.primary,
                    color: '#fff',
                    fontWeight: 'bold'
                }}>
                    {clienteGuardado ? 'Editar Cliente' : 'Ingresar Datos del Cliente'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="rut"
                                    label="RUT"
                                    fullWidth
                                    margin="normal"
                                    value={cliente.rut}
                                    onChange={handleRutChange}
                                    required
                                    placeholder="Ej: 12.345.678-9"
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
                            <Grid item xs={12}>
                                <TextField
                                    name="nombre"
                                    label="Nombre Completo"
                                    fullWidth
                                    margin="normal"
                                    value={cliente.nombre}
                                    onChange={handleClienteChange}
                                    required
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
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="telefono"
                                    label="Teléfono"
                                    fullWidth
                                    margin="normal"
                                    value={cliente.telefono}
                                    onChange={handleClienteChange}
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
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="email"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    margin="normal"
                                    value={cliente.email}
                                    onChange={handleClienteChange}
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
                            <Grid item xs={12}>
                                <TextField
                                    name="direccion"
                                    label="Dirección"
                                    fullWidth
                                    margin="normal"
                                    value={cliente.direccion}
                                    onChange={handleClienteChange}
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
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseModal}
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
                        onClick={handleSaveCliente}
                        variant="contained"
                        sx={{
                            backgroundColor: themeColors.success,
                            '&:hover': {
                                backgroundColor: '#2E7D32',
                            },
                            fontWeight: 'bold'
                        }}
                    >
                        Guardar Cliente
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openBoletaModal} onClose={handleCloseBoleta} maxWidth="sm" fullWidth>
                <DialogTitle sx={{
                    backgroundColor: themeColors.primary,
                    color: '#fff',
                    fontWeight: 'bold'
                }}>
                    Boleta de Venta
                </DialogTitle>
                <DialogContent>
                    <Paper elevation={0} sx={{
                        p: 2,
                        border: `1px dashed ${themeColors.border}`,
                        backgroundColor: themeColors.paper
                    }}>
                        <Typography variant="h6" align="center" gutterBottom sx={{
                            color: themeColors.primary,
                            fontWeight: 'bold'
                        }}>
                            TIENDA DE BICICLETAS
                        </Typography>
                        <Typography variant="body2" align="center" gutterBottom sx={{
                            color: themeColors.textSecondary
                        }}>
                            RUT: 12.345.678-9
                        </Typography>
                        <Typography variant="body2" align="center" gutterBottom sx={{
                            color: themeColors.textSecondary
                        }}>
                            Dirección: Av. Principal 1234
                        </Typography>
                        <Typography variant="body2" align="center" gutterBottom sx={{
                            color: themeColors.textSecondary
                        }}>
                            Teléfono: +56 9 8765 4321
                        </Typography>

                        <Divider sx={{
                            my: 2,
                            borderColor: themeColors.border
                        }} />

                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            <Box component="span" sx={{ color: themeColors.primary }}>Boleta N°:</Box> 0001-00000001
                        </Typography>
                        <Typography variant="body2">
                            <Box component="span" sx={{ fontWeight: 'bold', color: themeColors.primary }}>Fecha:</Box> {new Date().toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                            <Box component="span" sx={{ fontWeight: 'bold', color: themeColors.primary }}>Cliente:</Box> {clienteGuardado?.nombre || 'No especificado'}
                        </Typography>
                        <Typography variant="body2">
                            <Box component="span" sx={{ fontWeight: 'bold', color: themeColors.primary }}>RUT:</Box> {clienteGuardado?.rut || 'No especificado'}
                        </Typography>

                        <Divider sx={{
                            my: 2,
                            borderColor: themeColors.border
                        }} />

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
                                    <TableCell align="right">Cant.</TableCell>
                                    <TableCell align="right">P.Unit</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productosSeleccionados.map((producto) => (
                                    <TableRow
                                        key={producto.id}
                                        sx={{
                                            '&:nth-of-type(odd)': {
                                                backgroundColor: themeColors.highlight
                                            }
                                        }}
                                    >
                                        <TableCell>{producto.nombre}</TableCell>
                                        <TableCell align="right">{producto.cantidad}</TableCell>
                                        <TableCell align="right">${producto.precioUnitario.toFixed(2)}</TableCell>
                                        <TableCell align="right">${producto.precioTotal.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Divider sx={{
                            my: 2,
                            borderColor: themeColors.border
                        }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Subtotal:</Typography>
                            <Typography variant="body2">${calcularTotal().toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>IVA (16%):</Typography>
                            <Typography variant="body2">${(calcularTotal() * 0.16).toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 2,
                            backgroundColor: themeColors.highlight,
                            p: 1,
                            borderRadius: '4px'
                        }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>${(calcularTotal() * 1.16).toFixed(2)}</Typography>
                        </Box>

                        <Divider sx={{
                            my: 2,
                            borderColor: themeColors.border
                        }} />

                        <Typography variant="body2" align="center" gutterBottom sx={{
                            fontWeight: 'bold',
                            color: themeColors.primary
                        }}>
                            ¡Gracias por su compra!
                        </Typography>
                        <Typography variant="caption" align="center" display="block" sx={{
                            color: themeColors.textSecondary
                        }}>
                            Este es un comprobante de ejemplo para demostración
                        </Typography>
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseBoleta}
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: themeColors.primary,
                            '&:hover': {
                                backgroundColor: '#1B5E20',
                            },
                            fontWeight: 'bold',
                            py: 1.5
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