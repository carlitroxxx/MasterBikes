import React, { useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Box,
    AppBar,
    Toolbar,
    Badge,
    IconButton,
    Pagination,
    ToggleButtonGroup,
    ToggleButton,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    InputAdornment,
    TextField,
    Divider
} from '@mui/material';
import {
    ShoppingCart,
    Settings,
    DirectionsBike,
    Apps,
    Close,
    Add,
    Remove
} from '@mui/icons-material';

const productos = [
    // Bicicletas
    {
        id: 1,
        nombre: 'Bicicleta Montaña Trail XT',
        descripcion: 'Bicicleta de montaña con cuadro de aluminio 6061, suspensión delantera de 120mm y grupo Shimano Deore.',
        precio: 28999,
        stock: 5,
        categoria: 'bicicletas'
    },
    {
        id: 2,
        nombre: 'Bicicleta Urbana Vintage',
        descripcion: 'Estilo retro con cuadro de acero, guardabarros y portaequipajes incluidos. Ideal para ciudad.',
        precio: 15499,
        stock: 8,
        categoria: 'bicicletas'
    },
    {
        id: 3,
        nombre: 'Bicicleta de Ruta Carbon Pro',
        descripcion: 'Ultraligera (7.8kg) con cuadro de carbono T800 y grupo Shimano 105. Para ciclistas exigentes.',
        precio: 65999,
        stock: 3,
        categoria: 'bicicletas'
    },
    {
        id: 4,
        nombre: 'Bicicleta Eléctrica Urban+',
        descripcion: 'Motor de 250W, autonomía 60km, batería extraíble. Incluye display LCD y luces LED.',
        precio: 42999,
        stock: 4,
        categoria: 'bicicletas'
    },
    {
        id: 5,
        nombre: 'Bicicleta Infantil Aro 20',
        descripcion: 'Diseño seguro con ruedas estabilizadoras desmontables y frenos V-Brake. Varios colores disponibles.',
        precio: 8999,
        stock: 12,
        categoria: 'bicicletas'
    },

    // Componentes
    {
        id: 6,
        nombre: 'Ruedas DT Swiss GR1600',
        descripcion: 'Juego de ruedas para gravel, aros de aluminio, cubiertas tubeless ready y eje thru-axle.',
        precio: 12499,
        stock: 6,
        categoria: 'componentes'
    },
    {
        id: 7,
        nombre: 'Sillín Selle Italia SLR',
        descripcion: 'Sillín de competición en fibra de carbono. Peso: 135g. Para rutas largas y competencia.',
        precio: 8999,
        stock: 4,
        categoria: 'componentes'
    },
    {
        id: 8,
        nombre: 'Grupo de cambios Shimano Ultegra',
        descripcion: 'Grupo completo 2x11 velocidades. Transmisión precisa y cambios suaves para ruta.',
        precio: 45999,
        stock: 2,
        categoria: 'componentes'
    },
    {
        id: 9,
        nombre: 'Frenos hidráulicos Shimano XT',
        descripcion: 'Frenos de disco hidráulicos para MTB. Potencia de frenado ajustable y pads metálicos.',
        precio: 12999,
        stock: 7,
        categoria: 'componentes'
    },
    {
        id: 10,
        nombre: 'Manubrio PRO PLT',
        descripcion: 'Manubrio de carbono para ruta, 420mm de ancho. Peso: 185g. Forma ergonómica.',
        precio: 8999,
        stock: 5,
        categoria: 'componentes'
    },
    {
        id: 11,
        nombre: 'Pedales automáticos Look Keo',
        descripcion: 'Pedales de ruta con sistema de enganche rápido. Ajuste de tensión personalizable.',
        precio: 6999,
        stock: 9,
        categoria: 'componentes'
    },
    {
        id: 12,
        nombre: 'Suspensión Fox 34 Float',
        descripcion: 'Horquilla de suspensión para MTB, 140mm de recorrido. Ajuste de rebote y compresión.',
        precio: 32999,
        stock: 3,
        categoria: 'componentes'
    },
    {
        id: 13,
        nombre: 'Casco Giro Aether MIPS',
        descripcion: 'Casco de alta gama con tecnología MIPS. Ventilación optimizada y peso ligero (265g).',
        precio: 8999,
        stock: 10,
        categoria: 'componentes'
    },
    {
        id: 14,
        nombre: 'Luces Bontrager Ion Pro RT',
        descripcion: 'Set delantera (1300 lúmenes) y trasera (100 lúmenes). USB recargable. 5 modos de iluminación.',
        precio: 5999,
        stock: 15,
        categoria: 'componentes'
    },
    {
        id: 15,
        nombre: 'Computador ciclista Garmin 530',
        descripcion: 'GPS con mapas, seguimiento de rendimiento y conectividad Bluetooth. Pantalla a color.',
        precio: 14999,
        stock: 6,
        categoria: 'componentes'
    },
    {
        id: 16,
        nombre: 'Bidón Elite Fly 750ml',
        descripcion: 'Bidón termoformado con boquilla antigoteo. Libre de BPA. Varios colores disponibles.',
        precio: 899,
        stock: 25,
        categoria: 'componentes'
    },
    {
        id: 17,
        nombre: 'Zapatillas Shimano RC7',
        descripcion: 'Zapatillas de ciclismo con suela de carbono. Ajuste preciso y ventilación optimizada.',
        precio: 12999,
        stock: 8,
        categoria: 'componentes'
    },
    {
        id: 18,
        nombre: 'Guantes Castelli Rosso Corsa',
        descripcion: 'Guantes de invierno con aislamiento térmico. Palma acolchada para mayor comodidad.',
        precio: 4999,
        stock: 12,
        categoria: 'componentes'
    },
    {
        id: 19,
        nombre: 'Cadena KMC X11SL',
        descripcion: 'Cadena de 11 velocidades con tratamiento antiwear. Incluye eslabón maestro de conexión rápida.',
        precio: 2999,
        stock: 18,
        categoria: 'componentes'
    },
    {
        id: 20,
        nombre: 'Cámara Tubolito S-Tubo',
        descripcion: 'Cámara ultraligera (42g) de material compuesto. Anti-pinchazos y compacta.',
        precio: 1999,
        stock: 20,
        categoria: 'componentes'
    }
];

// Agrego categorías a los productos
const productosConCategorias = productos.map(producto => ({
    ...producto,
    categoria: producto.nombre.includes('Bicicleta') ? 'bicicletas' : 'componentes'
}));

// Categorías disponibles con nuevos iconos
const categorias = [
    { id: 'todos', nombre: 'Todos', icono: <Apps /> },
    { id: 'componentes', nombre: 'Componentes', icono: <Settings /> },
    { id: 'bicicletas', nombre: 'Bicicletas', icono: <DirectionsBike /> }
];

const PRODUCTOS_POR_PAGINA = 8;

export default function Catalogo() {
    const [paginaActual, setPaginaActual] = useState(1);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos');
    const [cargando, setCargando] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [unidades, setUnidades] = useState(1);

    // Filtrar productos según categoría
    const productosFiltrados = productosConCategorias.filter(producto => {
        return categoriaSeleccionada === 'todos' || producto.categoria === categoriaSeleccionada;
    });

    const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);
    const productosPagina = productosFiltrados.slice(
        (paginaActual - 1) * PRODUCTOS_POR_PAGINA,
        paginaActual * PRODUCTOS_POR_PAGINA
    );

    const handleChangePagina = (event, value) => {
        setCargando(true);
        setTimeout(() => {
            setPaginaActual(value);
            setCargando(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 500);
    };

    const handleChangeCategoria = (event, nuevaCategoria) => {
        if (nuevaCategoria !== null) {
            setCategoriaSeleccionada(nuevaCategoria);
            setPaginaActual(1);
        }
    };

    const handleOpenDialog = (producto) => {
        setProductoSeleccionado(producto);
        setUnidades(1);
    };

    const handleCloseDialog = () => {
        setProductoSeleccionado(null);
    };

    const handleIncrementarUnidades = () => {
        setUnidades(prev => Math.min(prev + 1, productoSeleccionado.stock));
    };

    const handleDecrementarUnidades = () => {
        setUnidades(prev => Math.max(prev - 1, 1));
    };

    const handleChangeUnidades = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= productoSeleccionado?.stock) {
            setUnidades(value);
        }
    };

    return (
        <>
            <AppBar
                position="static"
                sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    borderRadius: 0,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}
            >
                <Toolbar sx={{
                    minHeight: 80,
                    padding: { xs: '0 16px', sm: '0 24px' }
                }}>
                    <ToggleButtonGroup
                        value={categoriaSeleccionada}
                        exclusive
                        onChange={handleChangeCategoria}
                        aria-label="categorías de productos"
                        sx={{
                            mr: 2,
                            '& .MuiToggleButton-root': {
                                color: 'rgba(255, 255, 255, 0.8)',
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                letterSpacing: '0.5px',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            },
                            '& .Mui-selected': {
                                color: 'white !important',
                                backgroundColor: 'rgba(0, 0, 0, 0.3) !important',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.4) !important'
                                }
                            }
                        }}
                    >
                        {categorias.map(categoria => (
                            <ToggleButton
                                key={categoria.id}
                                value={categoria.id}
                                sx={{
                                    px: 3,
                                    fontSize: '0.875rem',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {React.cloneElement(categoria.icono, {
                                        sx: { fontSize: 20 }
                                    })}
                                    {categoria.nombre}
                                </Box>
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>

                    <Box sx={{ flexGrow: 1 }} />

                    <IconButton
                        aria-label="cart"
                        sx={{
                            color: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)'
                            },
                            p: 1.5,
                            mr: 1
                        }}
                    >
                        <Badge
                            badgeContent={4}
                            color="error"
                            sx={{
                                '& .MuiBadge-badge': {
                                    right: -3,
                                    top: 8,
                                    border: '2px solid #0d47a1',
                                    padding: '0 4px',
                                    fontWeight: 'bold'
                                }
                            }}
                        >
                            <ShoppingCart sx={{ fontSize: 24 }} />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Typography variant="h4" component="h1" sx={{
                        fontWeight: 700,
                        color: 'primary.main'
                    }}>
                        Catálogo de Productos
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                            {productosFiltrados.length} productos disponibles
                        </Typography>
                        {categoriaSeleccionada !== 'todos' && (
                            <Chip
                                label={`Categoría: ${categorias.find(c => c.id === categoriaSeleccionada)?.nombre}`}
                                onDelete={() => setCategoriaSeleccionada('todos')}
                                deleteIcon={<Close />}
                                color="primary"
                                variant="outlined"
                            />
                        )}
                    </Box>
                </Box>

                {cargando ? (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '300px',
                        width: '100%'
                    }}>
                        <CircularProgress size={60} />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {productosPagina.map((p) => (
                            <Grid item xs={12} sm={6} md={3} key={p.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        maxWidth: 340,
                                        minWidth: 340,
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.03)',
                                            boxShadow: 3,
                                            cursor: 'pointer'
                                        }
                                    }}
                                    onClick={() => handleOpenDialog(p)}
                                >
                                    <Box
                                        sx={{
                                            height: 180,
                                            backgroundColor: 'grey.100',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}
                                    >
                                        {p.categoria === 'bicicletas' ? (
                                            <DirectionsBike sx={{ fontSize: 60, color: 'action.active' }} />
                                        ) : (
                                            <Settings sx={{ fontSize: 60, color: 'action.active' }} />
                                        )}
                                    </Box>

                                    <CardContent sx={{
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Stock: {p.stock}
                                            </Typography>
                                            <Chip
                                                label={p.categoria === 'bicicletas' ? 'Bicicleta' : 'Componente'}
                                                size="small"
                                                color="secondary"
                                            />
                                        </Box>

                                        <Typography gutterBottom variant="h6" component="h3" sx={{ mb: 1 }}>
                                            {p.nombre}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            paragraph
                                            sx={{
                                                flexGrow: 1,
                                                display: '-webkit-box',
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                WebkitLineClamp: 4,
                                                minHeight: '4.5em'
                                            }}
                                        >
                                            {p.descripcion}
                                        </Typography>
                                        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                            ${p.precio.toLocaleString()}
                                        </Typography>
                                    </CardContent>

                                    <CardActions sx={{ justifyContent: 'center', p: 2 }}>
                                        <Button
                                            size="medium"
                                            color="primary"
                                            variant="contained"
                                            fullWidth
                                            startIcon={<ShoppingCart />}
                                            sx={{
                                                backgroundColor: 'primary.main',
                                                '&:hover': {
                                                    backgroundColor: 'primary.dark'
                                                }
                                            }}
                                        >
                                            Agregar al carrito
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {totalPaginas > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination
                            count={totalPaginas}
                            page={paginaActual}
                            onChange={handleChangePagina}
                            color="primary"
                            size="large"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    fontSize: '1.2rem'
                                }
                            }}
                        />
                    </Box>
                )}
            </Container>

            {/* Dialog para mostrar detalles del producto */}
            <Dialog
                open={Boolean(productoSeleccionado)}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{
                    borderBottom: '1px solid #eee',
                    pb: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="h6" component="div">
                        Detalles del producto
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 4 }}>
                    {productoSeleccionado && (
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={5}>
                                <Box
                                    sx={{
                                        height: 300,
                                        backgroundColor: 'grey.100',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 1
                                    }}
                                >
                                    {productoSeleccionado.categoria === 'bicicletas' ? (
                                        <DirectionsBike sx={{ fontSize: 100, color: 'action.active' }} />
                                    ) : (
                                        <Settings sx={{ fontSize: 100, color: 'action.active' }} />
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body1">
                                        <strong>Categoría:</strong> {productoSeleccionado.categoria === 'bicicletas' ? 'Bicicleta' : 'Componente'}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Stock:</strong> {productoSeleccionado.stock}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                                        {productoSeleccionado.nombre}
                                    </Typography>
                                    <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                                        ${productoSeleccionado.precio.toLocaleString()}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Descripción:</strong>
                                </Typography>
                                <Typography variant="body1" sx={{
                                    mb: 3,
                                    maxHeight: '150px',
                                    overflowY: 'auto',
                                    pr: 2,
                                    whiteSpace: 'pre-line'
                                }}>
                                    {productoSeleccionado.descripcion}
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mt: 3
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="body1" sx={{ mr: 2 }}>
                                            <strong>Unidades:</strong>
                                        </Typography>
                                        <TextField
                                            value={unidades}
                                            type="number"
                                            size="small"
                                            sx={{ width: 120 }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <IconButton
                                                            size="small"
                                                            onClick={handleDecrementarUnidades}
                                                            disabled={unidades <= 1}
                                                        >
                                                            <Remove fontSize="small" />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            size="small"
                                                            onClick={handleIncrementarUnidades}
                                                            disabled={unidades >= productoSeleccionado.stock}
                                                        >
                                                            <Add fontSize="small" />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                                inputProps: {
                                                    min: 1,
                                                    max: productoSeleccionado.stock,
                                                    style: { textAlign: 'center' }
                                                }
                                            }}
                                            onChange={handleChangeUnidades}
                                        />
                                    </Box>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        startIcon={<ShoppingCart />}
                                        sx={{
                                            px: 4,
                                            py: 1.5,
                                            fontWeight: 600
                                        }}
                                        onClick={() => {
                                            // Aquí iría la lógica para agregar al carrito
                                            handleCloseDialog();
                                        }}
                                    >
                                        Agregar al carrito ({unidades})
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}