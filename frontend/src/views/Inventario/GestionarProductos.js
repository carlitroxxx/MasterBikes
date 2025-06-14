import React, { useState } from 'react';
import {
    Container, Typography, Table, TableHead, TableRow, TableCell,
    TableBody, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Button, TableContainer, Paper,
    Box, Tooltip, Alert, Snackbar, Grid, Divider
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Add as AddIcon,
    Inventory as InventoryIcon
} from '@mui/icons-material';

const productosIniciales = [
    { id: 1, nombre: 'Cadena', stock: 20, precio: 1500, categoria: 'Partes' },
    { id: 2, nombre: 'Neumático', stock: 10, precio: 5000, categoria: 'Ruedas' },
    { id: 3, nombre: 'Pedal', stock: 15, precio: 2500, categoria: 'Partes' },
];

const categorias = ['Partes', 'Ruedas', 'Accesorios', 'Herramientas'];

export default function GestionarProductos() {
    const [productos, setProductos] = useState(productosIniciales);
    const [productoEditar, setProductoEditar] = useState(null);
    const [productoEliminar, setProductoEliminar] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [nuevoProducto, setNuevoProducto] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [formErrors, setFormErrors] = useState({});

    // Funciones de manejo (igual que en la versión anterior)
    const handleGuardarEdicion = () => {
        const errors = {};
        if (!productoEditar.nombre) errors.nombre = 'Requerido';
        if (productoEditar.stock < 0) errors.stock = 'No puede ser negativo';
        if (productoEditar.precio <= 0) errors.precio = 'Debe ser mayor a 0';

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setProductos(productos.map(p => p.id === productoEditar.id ? productoEditar : p));
        setProductoEditar(null);
        setFormErrors({});
        showSnackbar('Producto actualizado', 'success');
    };

    const handleNuevoProducto = () => {
        const nuevoId = Math.max(...productos.map(p => p.id), 0) + 1;
        setProductoEditar({
            id: nuevoId,
            nombre: '',
            stock: 0,
            precio: 0,
            categoria: 'Partes'
        });
        setNuevoProducto(true);
    };

    const handleCrearProducto = () => {
        const errors = {};
        if (!productoEditar.nombre) errors.nombre = 'Requerido';
        if (productoEditar.stock < 0) errors.stock = 'No puede ser negativo';
        if (productoEditar.precio <= 0) errors.precio = 'Debe ser mayor a 0';

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setProductos([...productos, productoEditar]);
        setProductoEditar(null);
        setNuevoProducto(false);
        setFormErrors({});
        showSnackbar('Producto creado', 'success');
    };

    const handleEliminar = () => {
        setProductos(productos.filter(p => p.id !== productoEliminar.id));
        setProductoEliminar(null);
        showSnackbar('Producto eliminado', 'info');
    };

    const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header estructurado */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold">
                        Gestión de Productos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Total: {productos.length} productos | Mostrando: {productosFiltrados.length}
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleNuevoProducto}
                    sx={{ height: '40px' }}
                >
                    Nuevo Producto
                </Button>
            </Box>

            {/* Barra de búsqueda */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar productos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                    }}
                    size="small"
                />
            </Paper>

            {/* Tabla de productos */}
            <Paper elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Categoría</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Stock</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Precio</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {productosFiltrados.length > 0 ? (
                                productosFiltrados.map((producto) => (
                                    <TableRow key={producto.id} hover>
                                        <TableCell>{producto.id}</TableCell>
                                        <TableCell>{producto.nombre}</TableCell>
                                        <TableCell>{producto.categoria}</TableCell>
                                        <TableCell align="right">
                                            <Box
                                                component="span"
                                                sx={{
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    bgcolor: producto.stock < 5 ? '#ffebee' : '#e8f5e9',
                                                    color: producto.stock < 5 ? '#c62828' : '#2e7d32'
                                                }}
                                            >
                                                {producto.stock}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            {new Intl.NumberFormat('es-AR', {
                                                style: 'currency',
                                                currency: 'ARS'
                                            }).format(producto.precio)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Editar">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        setProductoEditar({ ...producto });
                                                        setNuevoProducto(false);
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setProductoEliminar(producto)}
                                                    sx={{ color: '#f44336' }}
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
                                        <Typography variant="body1" color="text.secondary">
                                            No se encontraron productos
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Modal Edición/Creación */}
            <Dialog
                open={!!productoEditar}
                onClose={() => {
                    setProductoEditar(null);
                    setNuevoProducto(false);
                    setFormErrors({});
                }}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    {nuevoProducto ? 'Nuevo Producto' : 'Editar Producto'}
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Nombre"
                                fullWidth
                                size="small"
                                value={productoEditar?.nombre || ''}
                                onChange={e => setProductoEditar({ ...productoEditar, nombre: e.target.value })}
                                error={!!formErrors.nombre}
                                helperText={formErrors.nombre}
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
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Precio"
                                type="number"
                                fullWidth
                                size="small"
                                value={productoEditar?.precio || ''}
                                onChange={e => setProductoEditar({ ...productoEditar, precio: parseFloat(e.target.value) || 0 })}
                                error={!!formErrors.precio}
                                helperText={formErrors.precio}
                                InputProps={{
                                    startAdornment: '$',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                label="Categoría"
                                fullWidth
                                size="small"
                                value={productoEditar?.categoria || 'Partes'}
                                onChange={e => setProductoEditar({ ...productoEditar, categoria: e.target.value })}
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                {categorias.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ borderTop: '1px solid #e0e0e0', p: 2 }}>
                    <Button
                        onClick={() => {
                            setProductoEditar(null);
                            setNuevoProducto(false);
                            setFormErrors({});
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={nuevoProducto ? handleCrearProducto : handleGuardarEdicion}
                    >
                        {nuevoProducto ? 'Agregar' : 'Guardar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal Eliminación */}
            <Dialog open={!!productoEliminar} onClose={() => setProductoEliminar(null)}>
                <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    Confirmar eliminación
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Esta acción no se puede deshacer
                    </Alert>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Producto:</strong> {productoEliminar?.nombre}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>ID:</strong> {productoEliminar?.id}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Categoría:</strong> {productoEliminar?.categoria}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ borderTop: '1px solid #e0e0e0', p: 2 }}>
                    <Button onClick={() => setProductoEliminar(null)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleEliminar}
                        startIcon={<DeleteIcon />}
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