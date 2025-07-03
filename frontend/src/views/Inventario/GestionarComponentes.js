import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Table, TableHead, TableRow, TableCell,
    TableBody, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Button, TableContainer, Paper,
    Box, Tooltip, Alert, Snackbar, Grid, Divider, Drawer,
    FormControl, InputLabel, Select, MenuItem, Chip, Avatar,
    Stack, InputAdornment
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Add as AddIcon,
    Inventory as InventoryIcon,
    Close as CloseIcon,
    CloudUpload as UploadIcon
} from '@mui/icons-material';
import axios from 'axios';

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

const API_URL = 'http://localhost:8080/api/inventario';

export default function GestionarComponentes() {
    const [productos, setProductos] = useState([]);
    const [productoEditar, setProductoEditar] = useState(null);
    const [productoEliminar, setProductoEliminar] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [nuevoProducto, setNuevoProducto] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [formErrors, setFormErrors] = useState({});
    const [openDrawer, setOpenDrawer] = useState(false);
    const [imagenesPreview, setImagenesPreview] = useState([]);
    const [imagenesSubir, setImagenesSubir] = useState([]);
// Agrega estos estados con los demás useState
    const [idDisponible, setIdDisponible] = useState(null);
    const [validandoId, setValidandoId] = useState(false);

    // Cargar productos al montar el componente
    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const response = await axios.get(`${API_URL}/venta/componente`);
            setProductos(response.data);
        } catch (error) {
            showSnackbar('Error al cargar los componentes', 'error');
            console.error('Error fetching data:', error);
        }
    };

    // Agrega esta función con las otras funciones del componente
    const verificarDisponibilidadId = async (id) => {
        if (!id) {
            setIdDisponible(null);
            return;
        }

        setValidandoId(true);
        try {
            const response = await axios.get(`${API_URL}/venta/producto/${id}`);
            // Si el producto existe y es un componente
            if (response.data && response.data.tipo === "componente") {
                setIdDisponible(false);
            } else {
                setIdDisponible(true); // No es un componente (ID disponible)
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setIdDisponible(true); // ID no existe (disponible)
            } else {
                setIdDisponible(null); // Error de conexión
                console.error("Error verificando ID:", error);
            }
        } finally {
            setValidandoId(false);
        }
    };
    const handleGuardarEdicion = async () => {
        // Validación del ID para nuevos productos
        if (nuevoProducto && idDisponible === false) {
            showSnackbar('El ID ingresado ya está en uso para otro componente', 'error');
            return;
        }
        const errors = {};
        if (!productoEditar.nombre) errors.nombre = 'Requerido';
        if (productoEditar.stock < 0) errors.stock = 'No puede ser negativo';
        if (productoEditar.precio <= 0) errors.precio = 'Debe ser mayor a 0';

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            if (nuevoProducto) {
                // Crear nuevo producto (código existente se mantiene igual)
                // ...
                // Crear nuevo producto
                const formData = new FormData();
                const productoData = {
                    ...productoEditar,
                    tipo: 'componente'
                };
                formData.append('producto', JSON.stringify(productoData));

                if (imagenesSubir.length > 0) {
                    imagenesSubir.forEach((file) => {
                        formData.append('imagenes', file);
                    });
                    const response = await axios.post(`${API_URL}/venta/con-imagenes`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    setProductos([...productos, response.data]);
                } else {
                    const response = await axios.post(`${API_URL}/venta`, productoData);
                    setProductos([...productos, response.data]);
                }
            } else {
                // Actualizar producto existente
                if (imagenesSubir.length > 0 || imagenesPreview.length !== productoEditar.imagenesUrls?.length) {
                    // Si hay imágenes nuevas o se eliminaron algunas, usar el endpoint con imágenes
                    const formData = new FormData();
                    const productoData = {
                        ...productoEditar,
                        imagenesUrls: imagenesPreview.filter(url => url.startsWith('http')) // Mantener solo las URLs existentes
                    };
                    formData.append('producto', JSON.stringify(productoData));

                    if (imagenesSubir.length > 0) {
                        imagenesSubir.forEach((file) => {
                            formData.append('imagenes', file);
                        });
                    }

                    const response = await axios.put(
                        `${API_URL}/venta/${productoEditar.id}/con-imagenes`,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );
                    setProductos(productos.map(p => p.id === productoEditar.id ? response.data : p));
                } else {
                    // Si no hay cambios en las imágenes, usar el endpoint normal
                    const response = await axios.put(`${API_URL}/venta/${productoEditar.id}`, productoEditar);
                    setProductos(productos.map(p => p.id === productoEditar.id ? response.data : p));
                }
            }

            setOpenDrawer(false);
            setProductoEditar(null);
            setNuevoProducto(false);
            setFormErrors({});
            setImagenesPreview([]);
            setImagenesSubir([]);
            showSnackbar(nuevoProducto ? 'Componente creado' : 'Componente actualizado', 'success');
        } catch (error) {
            console.error('Error al guardar:', error);
            showSnackbar(`Error al ${nuevoProducto ? 'crear' : 'actualizar'} el componente`, 'error');
        }
    };
    const handleNuevoProducto = () => {
        setProductoEditar({
            id: '',
            nombre: '',
            descripcion: '',
            precio: 0,
            stock: 0,
            imagenesUrls: []
        });
        setNuevoProducto(true);
        setOpenDrawer(true);
    };

    const handleEliminar = async () => {
        try {
            await axios.delete(`${API_URL}/venta/${productoEliminar.id}`);
            setProductos(productos.filter(p => p.id !== productoEliminar.id));
            setProductoEliminar(null);
            showSnackbar('Componente eliminado', 'info');
        } catch (error) {
            console.error('Error al eliminar:', error);
            showSnackbar('Error al eliminar el componente', 'error');
        }
    };

    const handleEditarProducto = (producto) => {
        setProductoEditar({ ...producto });
        setNuevoProducto(false);
        setOpenDrawer(true);
        // Solo establecer las URLs de imágenes existentes (no las previews locales)
        setImagenesPreview(producto.imagenesUrls?.filter(url => url.startsWith('http')) || []);
        setImagenesSubir([]);
    };

    const handleImagenChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const previews = files.map(file => URL.createObjectURL(file));
        setImagenesPreview(prev => [...prev, ...previews]);
        setImagenesSubir(prev => [...prev, ...files]);
    };

    const eliminarImagenPreview = async (index) => {
        try {
            const url = imagenesPreview[index];

            // Si es una URL existente (no una preview local)
            if (url.startsWith('http')) {
                // Eliminar del backend
                await axios.delete(`${API_URL}/venta/${productoEditar.id}/imagenes`, {
                    params: { urlImagen: url }
                });

                // Actualizar el estado del producto editado
                setProductoEditar(prev => ({
                    ...prev,
                    imagenesUrls: prev.imagenesUrls.filter(img => img !== url)
                }));
            }

            // Eliminar de los estados locales
            const nuevasPreviews = [...imagenesPreview];
            nuevasPreviews.splice(index, 1);
            setImagenesPreview(nuevasPreviews);

            const nuevasImagenesSubir = [...imagenesSubir];
            nuevasImagenesSubir.splice(index, 1);
            setImagenesSubir(nuevasImagenesSubir);
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
            showSnackbar('Error al eliminar la imagen', 'error');
        }
    };

    const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.id.toString().toLowerCase().includes(busqueda.toLowerCase())
    );

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(value);
    };

    return (
        <Container maxWidth="lg" sx={{
            mt: 4,
            mb: 4,
            backgroundColor: themeColors.background,
            minHeight: '100vh',
            p: 3
        }}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                p: 2,
                backgroundColor: themeColors.paper,
                borderRadius: '12px',
                border: `1px solid ${themeColors.border}`
            }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold" sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: themeColors.primary
                    }}>
                        <InventoryIcon sx={{ mr: 1, color: themeColors.primary }} /> Gestión de Componentes
                    </Typography>
                    <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
                        Total: {productos.length} componentes | Mostrando: {productosFiltrados.length}
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleNuevoProducto}
                    sx={{
                        height: '40px',
                        backgroundColor: themeColors.secondary,
                        '&:hover': {
                            backgroundColor: '#E65100',
                        },
                        fontWeight: 'bold'
                    }}
                >
                    Nuevo Componente
                </Button>
            </Box>

            {/* Barra de búsqueda */}
            <Paper elevation={0} sx={{
                p: 2,
                mb: 3,
                border: `1px solid ${themeColors.border}`,
                backgroundColor: themeColors.paper,
                borderRadius: '12px'
            }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar componentes..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{
                            mr: 1,
                            color: themeColors.textSecondary
                        }} />,
                        sx: {
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: themeColors.border,
                                },
                                '&:hover fieldset': {
                                    borderColor: themeColors.primary,
                                },
                            }
                        }
                    }}
                    size="small"
                />
            </Paper>

            {/* Tabla de productos */}
            <Paper elevation={0} sx={{
                border: `1px solid ${themeColors.border}`,
                backgroundColor: themeColors.paper,
                borderRadius: '12px'
            }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{
                                bgcolor: themeColors.primary,
                                '& th': {
                                    color: '#fff',
                                    fontWeight: 'bold'
                                }
                            }}>
                                <TableCell>ID</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell align="right">Stock</TableCell>
                                <TableCell align="right">Precio</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {productosFiltrados.length > 0 ? (
                                productosFiltrados.map((producto) => (
                                    <TableRow
                                        key={producto.id}
                                        hover
                                        sx={{
                                            '&:nth-of-type(odd)': {
                                                backgroundColor: themeColors.highlight
                                            }
                                        }}
                                    >
                                        <TableCell>{producto.id}</TableCell>
                                        <TableCell>{producto.nombre}</TableCell>
                                        <TableCell align="right">
                                            <Box
                                                component="span"
                                                sx={{
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    bgcolor: producto.stock < 5 ?
                                                        'rgba(198, 40, 40, 0.1)' :
                                                        'rgba(46, 125, 50, 0.1)',
                                                    color: producto.stock < 5 ?
                                                        themeColors.error :
                                                        themeColors.success
                                                }}
                                            >
                                                {producto.stock}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(producto.precio)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Editar">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditarProducto(producto)}
                                                    sx={{
                                                        color: themeColors.primary,
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(10, 46, 90, 0.08)'
                                                        }
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setProductoEliminar(producto)}
                                                    sx={{
                                                        color: themeColors.error,
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(198, 40, 40, 0.08)'
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body1" sx={{ color: themeColors.textSecondary }}>
                                            No se encontraron componentes
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Drawer para Edición/Creación */}
            <Drawer
                anchor="right"
                open={openDrawer}
                onClose={() => {
                    setOpenDrawer(false);
                    setProductoEditar(null);
                    setIdDisponible(null);
                    setValidandoId(false);
                    imagenesPreview.forEach(preview => {
                        if (preview.startsWith('blob:')) {
                            URL.revokeObjectURL(preview);
                        }
                    });
                    setImagenesPreview([]);
                    setImagenesSubir([]);
                }}
                PaperProps={{
                    sx: {
                        width: '600px',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                        overflow: 'hidden',
                        backgroundColor: themeColors.background
                    }
                }}
            >
                {/* Header */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    flexShrink: 0
                }}>
                    <Typography variant="h6" sx={{
                        fontWeight: 'bold',
                        color: themeColors.primary
                    }}>
                        {nuevoProducto ? 'Nuevo Componente' : 'Editar Componente'}
                    </Typography>
                    <IconButton
                        onClick={() => setOpenDrawer(false)}
                        sx={{
                            color: themeColors.textSecondary
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Contenido principal con scroll */}
                <Box sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    mb: 4,
                    '& > div:not(:last-child)': {
                        borderBottom: `1px solid ${themeColors.border}`,
                        pb: 3,
                        mb: 3
                    }
                }}>
                    {/* Sección 1: ID y Nombre */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{
                            mb: 2,
                            color: themeColors.primary,
                            fontWeight: 'bold'
                        }}>
                            Información básica
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ flex: '0 0 40%' }}>
                                <TextField
                                    label="ID"
                                    fullWidth
                                    size="small"
                                    value={productoEditar?.id || ''}
                                    onChange={e => {
                                        setProductoEditar({ ...productoEditar, id: e.target.value });
                                        if (nuevoProducto) {
                                            verificarDisponibilidadId(e.target.value);
                                        }
                                    }}
                                    disabled={!nuevoProducto}
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
                                {nuevoProducto && idDisponible !== null && !validandoId && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mt: 0.5,
                                            color: idDisponible ? themeColors.success : themeColors.error
                                        }}
                                    >
                                        {idDisponible ? (
                                            <>
                                                <CheckCircleIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                                ID disponible
                                            </>
                                        ) : (
                                            <>
                                                <ErrorIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                                ID no disponible
                                            </>
                                        )}
                                    </Typography>
                                )}
                                {nuevoProducto && validandoId && (
                                    <Typography variant="caption" sx={{
                                        mt: 0.5,
                                        color: themeColors.textSecondary
                                    }}>
                                        Validando ID...
                                    </Typography>
                                )}
                            </Box>
                            <Box sx={{ flex: '0 0 55%' }}>
                                <TextField
                                    label="Nombre"
                                    fullWidth
                                    size="small"
                                    value={productoEditar?.nombre || ''}
                                    onChange={e => setProductoEditar({ ...productoEditar, nombre: e.target.value })}
                                    error={!!formErrors.nombre}
                                    helperText={formErrors.nombre}
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
                            </Box>
                        </Box>
                    </Box>

                    {/* Sección 2: Descripción */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{
                            mb: 2,
                            color: themeColors.primary,
                            fontWeight: 'bold'
                        }}>
                            Descripción
                        </Typography>
                        <TextField
                            label="Descripción"
                            fullWidth
                            multiline
                            rows={3}
                            size="small"
                            value={productoEditar?.descripcion || ''}
                            onChange={e => setProductoEditar({ ...productoEditar, descripcion: e.target.value })}
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
                    </Box>

                    {/* Sección 4: Precio y Stock */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{
                            mb: 2,
                            color: themeColors.primary,
                            fontWeight: 'bold'
                        }}>
                            Detalles de inventario
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Precio"
                                    type="number"
                                    fullWidth
                                    size="small"
                                    value={productoEditar?.precio || ''}
                                    onChange={e => setProductoEditar({ ...productoEditar, precio: parseInt(e.target.value) || 0 })}
                                    error={!!formErrors.precio}
                                    helperText={formErrors.precio}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
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
                            <Grid item xs={6}>
                                <TextField
                                    label="Stock"
                                    type="number"
                                    fullWidth
                                    size="small"
                                    value={productoEditar?.stock || ''}
                                    onChange={e => setProductoEditar({ ...productoEditar, stock: parseInt(e.target.value) || 0 })}
                                    error={!!formErrors.stock}
                                    helperText={formErrors.stock}
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

                    {/* Sección 5: Imágenes */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{
                            mb: 2,
                            color: themeColors.primary,
                            fontWeight: 'bold'
                        }}>
                            Imágenes
                        </Typography>

                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<UploadIcon />}
                            fullWidth
                            sx={{
                                mb: 3,
                                borderColor: themeColors.border,
                                color: themeColors.textPrimary,
                                '&:hover': {
                                    borderColor: themeColors.primary,
                                    backgroundColor: 'rgba(10, 46, 90, 0.04)'
                                }
                            }}
                        >
                            Subir imágenes
                            <input
                                type="file"
                                hidden
                                multiple
                                accept="image/*"
                                onChange={handleImagenChange}
                            />
                        </Button>

                        {/* Preview de imágenes */}
                        {imagenesPreview.length > 0 && (
                            <Box sx={{
                                border: `1px dashed ${themeColors.border}`,
                                borderRadius: 1,
                                p: 2,
                                mb: 2,
                                backgroundColor: themeColors.paper
                            }}>
                                <Typography variant="body2" sx={{
                                    mb: 1,
                                    color: themeColors.textSecondary
                                }}>
                                    Vista previa de imágenes ({imagenesPreview.length})
                                </Typography>
                                <Grid container spacing={1}>
                                    {imagenesPreview.map((img, index) => (
                                        <Grid item xs={4} key={index}>
                                            <Box sx={{
                                                position: 'relative',
                                                borderRadius: 1,
                                                overflow: 'hidden',
                                                height: 100
                                            }}>
                                                <img
                                                    src={img}
                                                    alt={`Preview ${index}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 4,
                                                        right: 4,
                                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                                        color: 'white',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(0,0,0,0.7)'
                                                        }
                                                    }}
                                                    onClick={() => eliminarImagenPreview(index)}
                                                >
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Botones de acción */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    pt: 2,
                    borderTop: `1px solid ${themeColors.border}`,
                    pb: 4,
                    flexShrink: 0
                }}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setOpenDrawer(false);
                            setProductoEditar(null);
                            setImagenesPreview([]);
                            setImagenesSubir([]);
                        }}
                        sx={{
                            width: '120px',
                            borderColor: themeColors.border,
                            color: themeColors.textPrimary,
                            '&:hover': {
                                borderColor: themeColors.primary,
                                backgroundColor: 'rgba(10, 46, 90, 0.04)'
                            }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleGuardarEdicion}
                        sx={{
                            width: '120px',
                            backgroundColor: themeColors.success,
                            '&:hover': {
                                backgroundColor: '#1B5E20',
                            },
                            fontWeight: 'bold'
                        }}
                    >
                        {nuevoProducto ? 'Crear' : 'Guardar'}
                    </Button>
                </Box>
            </Drawer>

            {/* Modal Eliminación */}
            <Dialog open={!!productoEliminar} onClose={() => setProductoEliminar(null)}>
                <DialogTitle sx={{
                    borderBottom: `1px solid ${themeColors.border}`,
                    backgroundColor: themeColors.primary,
                    color: '#fff',
                    fontWeight: 'bold'
                }}>
                    Confirmar eliminación
                </DialogTitle>
                <DialogContent sx={{ pt: 3, backgroundColor: themeColors.paper }}>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Esta acción no se puede deshacer
                    </Alert>
                    <Typography variant="body1" sx={{ mb: 1, color: themeColors.textPrimary }}>
                        <strong>Componente:</strong> {productoEliminar?.nombre}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, color: themeColors.textPrimary }}>
                        <strong>ID:</strong> {productoEliminar?.id}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{
                    borderTop: `1px solid ${themeColors.border}`,
                    p: 2,
                    backgroundColor: themeColors.paper
                }}>
                    <Button
                        onClick={() => setProductoEliminar(null)}
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
                        variant="contained"
                        color="error"
                        onClick={handleEliminar}
                        startIcon={<DeleteIcon />}
                        sx={{
                            backgroundColor: themeColors.error,
                            '&:hover': {
                                backgroundColor: '#B71C1C',
                            },
                            fontWeight: 'bold'
                        }}
                    >
                        Eliminar
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
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}