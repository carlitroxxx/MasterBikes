import React from 'react';
import {
    Container, Typography, List, ListItem, ListItemText, Button,
    Grid, Divider, Box, IconButton, Badge, Paper, CircularProgress, Alert,
    Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAuth } from '../../context/AuthContext';

export default function Carrito() {
    const { user } = useAuth();
    const [carrito, setCarrito] = React.useState({
        id: null,
        items: [],
        estado: 'ACTIVO'
    });
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [dialogEliminar, setDialogEliminar] = React.useState({
        open: false,
        productoId: null,
        productoNombre: ''
    });

    // Obtener carrito al cargar el componente
    React.useEffect(() => {
        const fetchCarrito = async () => {
            try {
                const response = await fetch(`http://localhost:8083/api/carrito/${user.email}`);
                if (!response.ok) throw new Error('Error al cargar el carrito');
                const data = await response.json();
                setCarrito(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCarrito();
    }, [user.email]);

    // Abrir diálogo de confirmación para eliminar
    const confirmarEliminar = (productoId, productoNombre) => {
        setDialogEliminar({
            open: true,
            productoId,
            productoNombre
        });
    };

    // Cerrar diálogo
    const cerrarDialogoEliminar = () => {
        setDialogEliminar({
            open: false,
            productoId: null,
            productoNombre: ''
        });
    };

    // Eliminar producto del carrito (confirmado)
    const handleEliminarConfirmado = async () => {
        const { productoId } = dialogEliminar;
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:8083/api/carrito/${carrito.id}/items/${productoId}?usuarioId=${user.email}`,
                { method: 'DELETE' }
            );

            if (!response.ok) throw new Error('Error al eliminar producto');

            // Recargar el carrito después de eliminar
            const carritoResponse = await fetch(`http://localhost:8083/api/carrito/${user.email}`);
            const carritoActualizado = await carritoResponse.json();
            setCarrito(carritoActualizado);

            setSnackbar({
                open: true,
                message: 'Producto eliminado correctamente',
                severity: 'success'
            });
        } catch (err) {
            setError(err.message);
            setSnackbar({
                open: true,
                message: err.message || 'Error al eliminar producto',
                severity: 'error'
            });
        } finally {
            setLoading(false);
            cerrarDialogoEliminar();
        }
    };

    // Actualizar cantidad de un producto
    const handleCambiarCantidad = async (productoId, nuevaCantidad) => {
        if (nuevaCantidad < 1) return;

        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:8083/api/carrito/${user.email}/items`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        productoId,
                        cantidad: nuevaCantidad
                    })
                }
            );
            if (!response.ok) throw new Error('Error al actualizar cantidad');

            const updatedCarrito = await response.json();
            setCarrito(updatedCarrito);
        } catch (err) {
            setError(err.message);
            setSnackbar({
                open: true,
                message: err.message || 'Error al actualizar cantidad',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Calcular total
    const total = carrito.items.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size={60} />
        </Box>
    );

    if (error) return (
        <Container sx={{ py: 4 }}>
            <Alert severity="error" sx={{ mb: 3 }}>
                Error: {error}
            </Alert>
            <Button
                variant="contained"
                onClick={() => window.location.reload()}
            >
                Reintentar
            </Button>
        </Container>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Badge
                    badgeContent={carrito.items.length}
                    color="primary"
                    sx={{ mr: 2 }}
                >
                    <ShoppingCartIcon fontSize="large" />
                </Badge>
                <Typography variant="h4" component="h1">
                    Tu Carrito de Compras
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Lista de productos */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Productos ({carrito.items.length})
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        {carrito.items.length === 0 ? (
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ py: 4, textAlign: 'center' }}
                            >
                                No hay productos en tu carrito
                            </Typography>
                        ) : (
                            <List>
                                {carrito.items.map((item) => (
                                    <React.Fragment key={item.productoId}>
                                        <ListItem sx={{ py: 2, px: 0 }}>
                                            <Box
                                                component="img"
                                                src={item.imagenesUrls?.[0] || 'https://via.placeholder.com/100'}
                                                alt={item.nombre}
                                                sx={{
                                                    width: 100,
                                                    height: 100,
                                                    objectFit: 'cover',
                                                    borderRadius: 1,
                                                    mr: 2
                                                }}
                                            />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <ListItemText
                                                    primary={item.nombre}
                                                    primaryTypographyProps={{
                                                        fontWeight: 'medium',
                                                        variant: 'h6'
                                                    }}
                                                    secondary={`$${item.precioUnitario.toLocaleString()}`}
                                                    secondaryTypographyProps={{
                                                        variant: 'body1'
                                                    }}
                                                />
                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                    <IconButton
                                                        onClick={() => handleCambiarCantidad(item.productoId, item.cantidad - 1)}
                                                        disabled={item.cantidad <= 1}
                                                    >
                                                        <RemoveIcon />
                                                    </IconButton>
                                                    <Typography sx={{ mx: 1 }}>{item.cantidad}</Typography>
                                                    <IconButton
                                                        onClick={() => handleCambiarCantidad(item.productoId, item.cantidad + 1)}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    ${(item.precioUnitario * item.cantidad).toLocaleString()}
                                                </Typography>
                                                <IconButton
                                                    onClick={() => confirmarEliminar(item.productoId, item.nombre)}
                                                    color="error"
                                                    sx={{ mt: 1 }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </ListItem>
                                        <Divider sx={{ my: 1 }} />
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>

                {/* Resumen de compra */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 16 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Resumen de Compra
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ mb: 2 }}>
                            {carrito.items.map(item => (
                                <Box
                                    key={item.productoId}
                                    sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                                >
                                    <Typography variant="body2">
                                        {item.nombre} x{item.cantidad}
                                    </Typography>
                                    <Typography variant="body2">
                                        ${(item.precioUnitario * item.cantidad).toLocaleString()}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                ${total.toLocaleString()}
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            startIcon={<PaymentIcon />}
                            disabled={carrito.items.length === 0}
                            sx={{ py: 1.5, fontWeight: 'bold' }}
                        >
                            Proceder al Pago
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            {/* Diálogo de confirmación para eliminar */}
            <Dialog
                open={dialogEliminar.open}
                onClose={cerrarDialogoEliminar}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    ¿Eliminar producto del carrito?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Estás seguro que deseas eliminar "{dialogEliminar.productoNombre}" de tu carrito?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cerrarDialogoEliminar}>Cancelar</Button>
                    <Button
                        onClick={handleEliminarConfirmado}
                        color="error"
                        autoFocus
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar para notificaciones */}
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