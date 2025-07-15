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
import { useCart } from '../../context/CartContext';
import axios from "axios";

// Añadir la paleta de colores de VentaForm
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

export default function Carrito() {
    const { user } = useAuth();
    const {
        cart,
        loading,
        error,
        updateQuantity,
        removeItem,
        calculateTotal,
        itemCount
    } = useCart();

    // En Carrito.js, añade esta función antes del componente
    const getProductStock = async (productoId) => {
        try {
            const response = await axios.get(
                `https://mb-inventario.onrender.com/api/inventario/venta/producto/${productoId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            return response.data.stock;
        } catch (err) {
            console.error("Error obteniendo stock:", err);
            return null;
        }
    };
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

    const confirmarEliminar = (productoId, productoNombre) => {
        setDialogEliminar({
            open: true,
            productoId,
            productoNombre
        });
    };

    const cerrarDialogoEliminar = () => {
        setDialogEliminar({
            open: false,
            productoId: null,
            productoNombre: ''
        });
    };

    const handleEliminarConfirmado = async () => {
        const { productoId } = dialogEliminar;
        try {
            const result = await removeItem(productoId);
            if (result.success) {
                setSnackbar({
                    open: true,
                    message: 'Producto eliminado correctamente',
                    severity: 'success'
                });
            } else {
                throw new Error(result.error || 'Error al eliminar producto');
            }
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.message || 'Error al eliminar producto',
                severity: 'error'
            });
        } finally {
            cerrarDialogoEliminar();
        }
    };

    const handleCambiarCantidad = async (productoId, nuevaCantidad) => {
        if (nuevaCantidad < 1) return;

        try {
            const result = await updateQuantity(productoId, nuevaCantidad);
            if (result.success) {
                setSnackbar({
                    open: true,
                    message: 'Cantidad actualizada correctamente',
                    severity: 'success'
                });
            } else {
                // Manejar error de stock insuficiente
                // Luego en handleCambiarCantidad:
                if (result.status === 400 && result.error.includes('Stock insuficiente')) {
                    const stock = await getProductStock(productoId);
                    setSnackbar({
                        open: true,
                        message: `Stock insuficiente. Máximo disponible: ${stock || 'N/A'}`,
                        severity: 'error'
                    });
                } else {
                    setSnackbar({
                        open: true,
                        message: result.error || 'Error al actualizar cantidad',
                        severity: 'error'
                    });
                }
            }
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.message || 'Error al actualizar cantidad',
                severity: 'error'
            });
        }
    };

// Función auxiliar para extraer el número de stock del mensaje de error
    const extraerStockDeMensaje = (mensaje) => {
        const match = mensaje.match(/\d+/);
        return match ? match[0] : null;
    };

    const total = calculateTotal();

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
        <Container maxWidth="xl" sx={{
            py: 4,
            mx: 0,
            backgroundColor: themeColors.background,
            minHeight: '100vh'
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 4,
                p: 2,
                backgroundColor: themeColors.paper,
                borderRadius: '12px',
                boxShadow: 1
            }}>
                <Badge
                    badgeContent={itemCount}
                    color="primary"
                    sx={{
                        mr: 2,
                        '& .MuiBadge-badge': {
                            backgroundColor: themeColors.primary,
                            color: '#fff'
                        }
                    }}
                >
                    <ShoppingCartIcon fontSize="large" sx={{ color: themeColors.primary }} />
                </Badge>
                <Typography variant="h4" component="h1" sx={{ color: themeColors.primary }}>
                    Tu Carrito de Compras
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Lista de productos */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{
                        p: 3,
                        backgroundColor: themeColors.paper,
                        border: `1px solid ${themeColors.border}`,
                        borderRadius: '12px'
                    }}>
                        <Typography variant="h6" sx={{
                            mb: 2,
                            fontWeight: 'bold',
                            color: themeColors.primary,
                            borderBottom: `2px solid ${themeColors.primary}`,
                            pb: 1
                        }}>
                            Productos ({cart?.items?.length || 0})
                        </Typography>
                        <Divider sx={{
                            mb: 3,
                            borderColor: themeColors.border
                        }} />

                        {!cart?.items || cart.items.length === 0 ? (
                            <Typography
                                variant="body1"
                                sx={{
                                    py: 4,
                                    textAlign: 'center',
                                    color: themeColors.textSecondary
                                }}
                            >
                                No hay productos en tu carrito
                            </Typography>
                        ) : (
                            <Box sx={{ width: '100%', overflowX: 'auto' }}>
                                {/* Headers */}
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '120px minmax(200px, 1fr) 120px 150px 120px 80px',
                                    gap: 3,
                                    py: 1,
                                    px: 1,
                                    mb: 1,
                                    borderBottom: `2px solid ${themeColors.primary}`,
                                    backgroundColor: themeColors.primary,
                                    color: '#fff',
                                    minWidth: 900
                                }}>
                                    <Typography variant="caption" sx={{ textAlign: 'center', fontSize: '0.75rem' }}>IMAGEN</Typography>
                                    <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>PRODUCTO</Typography>
                                    <Typography variant="caption" sx={{ textAlign: 'right', fontSize: '0.75rem' }}>PRECIO UNIT.</Typography>
                                    <Typography variant="caption" sx={{ textAlign: 'center', fontSize: '0.75rem' }}>CANTIDAD</Typography>
                                    <Typography variant="caption" sx={{ textAlign: 'right', fontSize: '0.75rem' }}>SUBTOTAL</Typography>
                                    <Typography variant="caption" sx={{ textAlign: 'center', fontSize: '0.75rem' }}>ACCIÓN</Typography>
                                </Box>

                                {/* Productos */}
                                {cart.items.map((item) => (
                                    <Box
                                        key={item.productoId}
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: '120px minmax(200px, 1fr) 120px 150px 120px 80px',
                                            gap: 3,
                                            alignItems: 'center',
                                            py: 1,
                                            px: 1,
                                            borderBottom: `1px solid ${themeColors.border}`,
                                            '&:hover': {
                                                backgroundColor: themeColors.highlight,
                                                borderRadius: 1
                                            },
                                            transition: 'background-color 0.3s ease',
                                            minWidth: 900
                                        }}
                                    >
                                        {/* Imagen */}
                                        <Box
                                            component="img"
                                            src={item.imagenesUrls?.[0] || 'https://via.placeholder.com/100'}
                                            alt={item.nombre}
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                objectFit: 'cover',
                                                borderRadius: 1,
                                                margin: '0 auto',
                                                border: `1px solid ${themeColors.border}`
                                            }}
                                        />

                                        {/* Nombre */}
                                        <Typography variant="body2" sx={{
                                            fontWeight: 'medium',
                                            pr: 2,
                                            fontSize: '0.875rem',
                                            color: themeColors.textPrimary
                                        }}>
                                            {item.nombre}
                                        </Typography>

                                        {/* Precio unitario */}
                                        <Typography variant="body2" sx={{
                                            textAlign: 'right',
                                            pr: 2,
                                            fontSize: '0.875rem',
                                            color: themeColors.textPrimary
                                        }}>
                                            ${item.precioUnitario.toLocaleString()}
                                        </Typography>

                                        {/* Cantidad */}
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1,
                                            px: 1
                                        }}>
                                            <IconButton
                                                onClick={() => handleCambiarCantidad(item.productoId, item.cantidad - 1)}
                                                disabled={item.cantidad <= 1}
                                                size="small"
                                                sx={{
                                                    p: 0.5,
                                                    border: `1px solid ${themeColors.border}`,
                                                    color: themeColors.primary,
                                                    '&:hover': {
                                                        backgroundColor: themeColors.highlight
                                                    }
                                                }}
                                            >
                                                <RemoveIcon fontSize="small" />
                                            </IconButton>
                                            <Typography variant="body2" sx={{
                                                minWidth: 24,
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                fontSize: '0.875rem',
                                                color: themeColors.textPrimary
                                            }}>
                                                {item.cantidad}
                                            </Typography>
                                            <IconButton
                                                onClick={() => handleCambiarCantidad(item.productoId, item.cantidad + 1)}
                                                size="small"
                                                sx={{
                                                    p: 0.5,
                                                    border: `1px solid ${themeColors.border}`,
                                                    color: themeColors.primary,
                                                    '&:hover': {
                                                        backgroundColor: themeColors.highlight
                                                    }
                                                }}
                                            >
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </Box>

                                        {/* Subtotal */}
                                        <Typography variant="body2" sx={{
                                            fontWeight: 'bold',
                                            textAlign: 'right',
                                            pr: 2,
                                            fontSize: '0.875rem',
                                            color: themeColors.textPrimary
                                        }}>
                                            ${(item.precioUnitario * item.cantidad).toLocaleString()}
                                        </Typography>

                                        {/* Eliminar */}
                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <IconButton
                                                onClick={() => confirmarEliminar(item.productoId, item.nombre)}
                                                size="small"
                                                sx={{
                                                    color: themeColors.error,
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(198, 40, 40, 0.08)'
                                                    }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Resumen de compra */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{
                        p: 3,
                        position: 'sticky',
                        top: 16,
                        backgroundColor: themeColors.paper,
                        border: `1px solid ${themeColors.border}`,
                        borderRadius: '12px',
                        minWidth: 300
                    }}>
                        <Typography variant="h5" sx={{
                            mb: 2,
                            fontWeight: 'bold',
                            color: themeColors.primary,
                            borderBottom: `2px solid ${themeColors.primary}`,
                            pb: 1
                        }}>
                            Resumen de Compra
                        </Typography>

                        <Divider sx={{
                            mb: 2,
                            borderColor: themeColors.border
                        }} />

                        {/* Lista de productos */}
                        <Box sx={{
                            mb: 2,
                            maxHeight: 300,
                            overflowY: 'auto',
                            pr: 1
                        }}>
                            {cart?.items?.map(item => (
                                <Box
                                    key={item.productoId}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 1.5,
                                        py: 1,
                                        px: 1,
                                        '&:hover': {
                                            bgcolor: themeColors.highlight,
                                            borderRadius: 1
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box
                                            component="img"
                                            src={item.imagenesUrls?.[0] || 'https://via.placeholder.com/60'}
                                            alt={item.nombre}
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                objectFit: 'cover',
                                                borderRadius: 1,
                                                mr: 1.5,
                                                border: `1px solid ${themeColors.border}`
                                            }}
                                        />
                                        <Typography variant="body2" sx={{
                                            fontWeight: 500,
                                            color: themeColors.textPrimary
                                        }}>
                                            {item.nombre}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: themeColors.textPrimary }}>
                                        x{item.cantidad} • ${(item.precioUnitario * item.cantidad).toLocaleString()}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        <Divider sx={{
                            my: 2,
                            borderColor: themeColors.border
                        }} />

                        {/* Total */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3,
                            py: 1,
                            px: 2,
                            backgroundColor: themeColors.highlight,
                            borderRadius: '8px'
                        }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                            <Typography variant="h5" sx={{
                                fontWeight: 'bold',
                                color: themeColors.primary
                            }}>
                                ${total.toLocaleString()}
                            </Typography>
                        </Box>

                        {/* Botón de pago */}
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            startIcon={<PaymentIcon />}
                            disabled={!cart?.items || cart.items.length === 0}
                            sx={{
                                py: 1.5,
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                borderRadius: '8px',
                                backgroundColor: themeColors.success,
                                '&:hover': {
                                    backgroundColor: '#2E7D32',
                                },
                                '&:disabled': {
                                    backgroundColor: '#BDBDBD',
                                    color: '#757575'
                                }
                            }}
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
                <DialogTitle id="alert-dialog-title" sx={{
                    backgroundColor: themeColors.primary,
                    color: '#fff',
                    fontWeight: 'bold'
                }}>
                    ¿Eliminar producto del carrito?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={{ mt: 2 }}>
                        ¿Estás seguro que deseas eliminar "{dialogEliminar.productoNombre}" de tu carrito?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={cerrarDialogoEliminar}
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
                        onClick={handleEliminarConfirmado}
                        sx={{
                            backgroundColor: themeColors.error,
                            color: '#fff',
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
                    sx={{
                        width: '100%',
                        backgroundColor: snackbar.severity === 'error' ? themeColors.error :
                            snackbar.severity === 'success' ? themeColors.success :
                                snackbar.severity === 'warning' ? themeColors.warning :
                                    themeColors.info,
                        color: '#fff'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}