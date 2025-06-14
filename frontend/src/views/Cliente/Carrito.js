import React from 'react';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    Grid,
    Divider,
    Box,
    IconButton,
    Badge,
    Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';

export default function Carrito() {
    const [productos, setProductos] = React.useState([
        { id: 1, nombre: 'Cadena de Bicicleta', cantidad: 2, precio: 1500, imagen: 'https://via.placeholder.com/80' },
        { id: 2, nombre: 'Neumático MTB', cantidad: 1, precio: 5000, imagen: 'https://via.placeholder.com/80' },
    ]);

    const total = productos.reduce((acc, p) => acc + p.cantidad * p.precio, 0);

    const handleEliminar = (id) => {
        setProductos(productos.filter(p => p.id !== id));
    };

    const handleCambiarCantidad = (id, nuevaCantidad) => {
        if (nuevaCantidad < 1) return;
        setProductos(productos.map(p => p.id === id ? {...p, cantidad: nuevaCantidad} : p));
    };

    return (
        <Container
            disableGutters // Elimina el padding interno del Container
            maxWidth="none"
            sx={{
                mx: 0,
                py: 4,
                width: '100%',
                px: { xs: 1, sm: 2, md: 3 } // Padding lateral mínimo
            }}
        >
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 4,
                px: { xs: 2, sm: 3 } // Padding solo para el título
            }}>
                <Badge badgeContent={productos.length} color="primary" sx={{ mr: 2 }}>
                    <ShoppingCartIcon fontSize="large" />
                </Badge>
                <Typography variant="h4" component="h1">
                    Tu Carrito de Compras
                </Typography>
            </Box>

            <Grid container
                  spacing={3}
                  sx={{
                      margin: 0,
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between', // Esto separará los items a los extremos
                      alignItems: 'flex-start' // Alinea los items en la parte superior
                  }}> {/* Reduje el espacio entre grids */}
                {/* Columna izquierda - Productos (ahora ocupa más espacio) */}

                <Grid item xs={12} md={8} lg={9} sx={{ padding: '0 !important' ,width: '70%',minWidth:'350px'}}> {/* Cambié de md=8 a md=9 */}
                                                <Paper elevation={2} sx={{
                                                    p: { xs: 2, sm: 3 , lg: 3},
                                                    height: '100%',
                                                    mx: 0
                                                }}>
                                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                        Productos
                                                    </Typography>
                                                    <Divider sx={{ mb: 3 }} />

                                                    {productos.length === 0 ? (
                                                        <Typography variant="body1" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                                                            No hay productos en tu carrito
                                                        </Typography>
                                                    ) : (
                                                        <List sx={{ width: '100%' }}>
                                                            {productos.map((p) => (
                                                                <React.Fragment key={p.id}>
                                                                    <ListItem sx={{
                                                                        py: 2,
                                                                        px: 0,
                                                                        gap: 2 // Espacio entre elementos
                                                                    }}>
                                                                        <Box
                                                                            component="img"
                                                                            src={p.imagen}
                                                                            alt={p.nombre}
                                                                            sx={{
                                                                                width: 100, // Aumenté el tamaño de la imagen
                                                                                height: 100,
                                                                                objectFit: 'cover',
                                                                                borderRadius: 1,
                                                                                flexShrink: 0
                                                                            }}
                                                                        />
                                                                        <Box sx={{
                                                                            flexGrow: 1,
                                                                            minWidth: 0,
                                                                            display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between'
                                            }}>
                                                <ListItemText
                                                    primary={p.nombre}
                                                    primaryTypographyProps={{
                                                        fontWeight: 'medium',
                                                        fontSize: '1.1rem'
                                                    }}
                                                    secondary={`$${p.precio.toLocaleString()}`}
                                                    secondaryTypographyProps={{
                                                        fontSize: '1rem'
                                                    }}
                                                />
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mt: 1
                                                }}>
                                                    <Button
                                                        size="small"
                                                        onClick={() => handleCambiarCantidad(p.id, p.cantidad - 1)}
                                                        disabled={p.cantidad <= 1}
                                                        sx={{ minWidth: 36 }}
                                                    >
                                                        -
                                                    </Button>
                                                    <Typography sx={{ mx: 2 }}>{p.cantidad}</Typography>
                                                    <Button
                                                        size="small"
                                                        onClick={() => handleCambiarCantidad(p.id, p.cantidad + 1)}
                                                        sx={{ minWidth: 36 }}
                                                    >
                                                        +
                                                    </Button>
                                                </Box>
                                            </Box>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                minWidth: 'fit-content',
                                                gap: 1
                                            }}>
                                                <Typography sx={{
                                                    fontWeight: 'bold',
                                                    fontSize: '1.1rem',
                                                    minWidth: 100,
                                                    textAlign: 'right'
                                                }}>
                                                    ${(p.precio * p.cantidad).toLocaleString()}
                                                </Typography>
                                                <IconButton
                                                    onClick={() => handleEliminar(p.id)}
                                                    color="error"
                                                    size="medium"
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

                {/* Columna derecha - Resumen de Compra (ahora más estrecha) */}
                <Grid item xs={12} md={4} lg={3} sx={{ padding: '0 !important',width: '23%' ,minWidth:'350px'}}> {/* Cambié de md=4 a md=3 */}
                    <Paper elevation={2} sx={{
                        p: { xs: 2, sm: 3, lg: 3 },
                        width: '100%', // Cambiado de '120%' a '100%'
                        position: 'sticky',
                        top: 16,
                        height: 'fit-content'
                    }}>
                        <Typography variant="h6" sx={{
                            mb: 2,
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                        }}>
                            Resumen de Compra
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{ mb: 2 }}>
                            {productos.map(p => (
                                <Box key={p.id} sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mb: 1.5,
                                    gap: 1
                                }}>
                                    <Typography variant="body2" noWrap sx={{
                                        maxWidth: '60%',
                                        fontSize: '0.95rem'
                                    }}>
                                        {p.nombre} x{p.cantidad}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
                                        ${(p.precio * p.cantidad).toLocaleString()}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 3,
                            alignItems: 'center'
                        }}>
                            <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>Total</Typography>
                            <Typography variant="h6" sx={{
                                fontWeight: 'bold',
                                fontSize: '1.3rem'
                            }}>
                                ${total.toLocaleString()}
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            startIcon={<PaymentIcon />}
                            disabled={productos.length === 0}
                            sx={{
                                py: 1.5,
                                fontWeight: 'bold',
                                fontSize: '1.05rem'
                            }}
                        >
                            Proceder al Pago
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}