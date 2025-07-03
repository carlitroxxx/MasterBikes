import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    List,
    ListItemButton,
    ListItemText,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Chip,
    TextField,
    InputAdornment,
    Pagination,
    Grid,
    Card,
    CardContent,
    IconButton,
    Collapse
} from '@mui/material';
import {
    Search,
    ExpandMore,
    ExpandLess,
    ShoppingCart,
    DirectionsBike,
    Build,
    Receipt
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// Paleta de colores igual a VentaForm
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

// Datos de ejemplo
const historialData = {
    compras: [
        { id: 1, producto: 'Cadena de bicicleta', fecha: '2024-05-01', total: 3000, estado: 'Entregado' },
        { id: 2, producto: 'Casco profesional', fecha: '2024-05-15', total: 4500, estado: 'Entregado' },
        { id: 3, producto: 'Luces LED', fecha: '2024-06-01', total: 1200, estado: 'En camino' },
    ],
    arriendos: [
        { id: 1, tipo: 'Mountain bike', desde: '2024-05-10', hasta: '2024-05-12', precio: 5000, estado: 'Finalizado' },
        { id: 2, tipo: 'Bicicleta urbana', desde: '2024-05-20', hasta: '2024-05-25', precio: 3500, estado: 'Finalizado' },
        { id: 3, tipo: 'Bicicleta eléctrica', desde: '2024-06-05', hasta: '2024-06-10', precio: 7000, estado: 'Activo' },
    ],
    reparaciones: [
        { id: 1, descripcion: 'Cambio de frenos', estado: 'Finalizado', fecha: '2024-05-15', costo: 2500, tecnico: 'Juan Pérez' },
        { id: 2, descripcion: 'Ajuste de cambios', estado: 'En proceso', fecha: '2024-05-28', costo: 1500, tecnico: 'María Gómez' },
        { id: 3, descripcion: 'Reparación de llanta', estado: 'Pendiente', fecha: '2024-06-05', costo: 1800, tecnico: 'Carlos Ruiz' },
    ],
};

// Componente styled para los cards de resumen más compactos
const CompactSummaryCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    backgroundColor: themeColors.paper,
    border: `1px solid ${themeColors.border}`,
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: theme.shadows[4],
        borderColor: themeColors.primary
    },
    '& .MuiCardContent-root': {
        padding: theme.spacing(2),
        '&:last-child': {
            paddingBottom: theme.spacing(2)
        }
    }
}));

export default function HistorialView() {
    const location = useLocation();
    const [tipo, setTipo] = useState(location.state?.tipo || 'compras');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [expandedRow, setExpandedRow] = useState(null);
    const [filter, setFilter] = useState('todos');

    useEffect(() => {
        if (location.state?.tipo) {
            setTipo(location.state.tipo);
        }
    }, [location.state]);

    const filteredData = historialData[tipo]
        .filter(item => {
            const matchesSearch = Object.values(item).some(
                val => val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
            const matchesFilter = filter === 'todos' || item.estado === filter;
            return matchesSearch && matchesFilter;
        });

    const itemsPerPage = 5;
    const pageCount = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const getTypeIcon = () => {
        switch(tipo) {
            case 'compras': return <ShoppingCart sx={{ color: themeColors.primary }} />;
            case 'arriendos': return <DirectionsBike sx={{ color: themeColors.primary }} />;
            case 'reparaciones': return <Build sx={{ color: themeColors.primary }} />;
            default: return <Receipt sx={{ color: themeColors.primary }} />;
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Entregado':
            case 'Finalizado':
                return 'success';
            case 'En camino':
            case 'En proceso':
                return 'warning';
            case 'Activo':
                return 'info';
            case 'Pendiente':
                return 'error';
            default:
                return 'default';
        }
    };

    const handleExpandRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const handleMenuClick = (newTipo) => (event) => {
        if (event.target.closest('.MuiChip-root')) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        setTipo(newTipo);
    };

    return (
        <Container maxWidth="lg" sx={{ my: 3, backgroundColor: themeColors.background, p: 3, borderRadius: '12px' }}>
            <Typography variant="h4" gutterBottom sx={{
                fontWeight: 'bold',
                color: themeColors.primary,
                borderBottom: `2px solid ${themeColors.primary}`,
                pb: 1
            }}>
                Mi Historial
            </Typography>

            {/* Resumen estadístico compacto */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <CompactSummaryCard>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <ShoppingCart sx={{ color: themeColors.primary, fontSize: '2rem' }} />
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1, color: themeColors.primary }}>
                                {historialData.compras.length}
                            </Typography>
                            <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
                                {historialData.compras.filter(c => c.estado === 'Entregado').length} completadas
                            </Typography>
                        </CardContent>
                    </CompactSummaryCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <CompactSummaryCard>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <DirectionsBike sx={{ color: themeColors.primary, fontSize: '2rem' }} />
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1, color: themeColors.primary }}>
                                {historialData.arriendos.length}
                            </Typography>
                            <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
                                {historialData.arriendos.filter(a => a.estado === 'Finalizado').length} finalizados
                            </Typography>
                        </CardContent>
                    </CompactSummaryCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <CompactSummaryCard>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Build sx={{ color: themeColors.primary, fontSize: '2rem' }} />
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1, color: themeColors.primary }}>
                                {historialData.reparaciones.length}
                            </Typography>
                            <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
                                {historialData.reparaciones.filter(r => r.estado === 'Finalizado').length} completadas
                            </Typography>
                        </CardContent>
                    </CompactSummaryCard>
                </Grid>
            </Grid>

            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
                {/* Menú lateral */}
                <Paper sx={{
                    minWidth: 250,
                    p: 1,
                    height: 'fit-content',
                    backgroundColor: themeColors.paper,
                    border: `1px solid ${themeColors.border}`,
                    borderRadius: '12px'
                }}>
                    <List>
                        <ListItemButton
                            selected={tipo === 'compras'}
                            onClick={handleMenuClick('compras')}
                            sx={{
                                borderRadius: 1,
                                '&.Mui-selected': {
                                    backgroundColor: themeColors.highlight,
                                    color: themeColors.primary,
                                    fontWeight: 'bold'
                                }
                            }}
                        >
                            <Box display="flex" alignItems="center" width="100%">
                                <ShoppingCart sx={{ mr: 1, color: themeColors.primary }} />
                                <ListItemText
                                    primary="Compras"
                                    primaryTypographyProps={{ color: themeColors.textPrimary }}
                                />
                                <Box component="span" sx={{ ml: 'auto', pointerEvents: 'none' }}>
                                    <Chip
                                        label={historialData.compras.length}
                                        size="small"
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{
                                            backgroundColor: themeColors.highlight,
                                            color: themeColors.primary
                                        }}
                                    />
                                </Box>
                            </Box>
                        </ListItemButton>
                        <ListItemButton
                            selected={tipo === 'arriendos'}
                            onClick={handleMenuClick('arriendos')}
                            sx={{
                                borderRadius: 1,
                                '&.Mui-selected': {
                                    backgroundColor: themeColors.highlight,
                                    color: themeColors.primary,
                                    fontWeight: 'bold'
                                }
                            }}
                        >
                            <Box display="flex" alignItems="center" width="100%">
                                <DirectionsBike sx={{ mr: 1, color: themeColors.primary }} />
                                <ListItemText
                                    primary="Arriendos"
                                    primaryTypographyProps={{ color: themeColors.textPrimary }}
                                />
                                <Box component="span" sx={{ ml: 'auto', pointerEvents: 'none' }}>
                                    <Chip
                                        label={historialData.arriendos.length}
                                        size="small"
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{
                                            backgroundColor: themeColors.highlight,
                                            color: themeColors.primary
                                        }}
                                    />
                                </Box>
                            </Box>
                        </ListItemButton>
                        <ListItemButton
                            selected={tipo === 'reparaciones'}
                            onClick={handleMenuClick('reparaciones')}
                            sx={{
                                borderRadius: 1,
                                '&.Mui-selected': {
                                    backgroundColor: themeColors.highlight,
                                    color: themeColors.primary,
                                    fontWeight: 'bold'
                                }
                            }}
                        >
                            <Box display="flex" alignItems="center" width="100%">
                                <Build sx={{ mr: 1, color: themeColors.primary }} />
                                <ListItemText
                                    primary="Reparaciones"
                                    primaryTypographyProps={{ color: themeColors.textPrimary }}
                                />
                                <Box component="span" sx={{ ml: 'auto', pointerEvents: 'none' }}>
                                    <Chip
                                        label={historialData.reparaciones.length}
                                        size="small"
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{
                                            backgroundColor: themeColors.highlight,
                                            color: themeColors.primary
                                        }}
                                    />
                                </Box>
                            </Box>
                        </ListItemButton>
                    </List>
                </Paper>

                {/* Contenido principal */}
                <Box flex={1}>
                    <Paper sx={{
                        p: 2,
                        backgroundColor: themeColors.paper,
                        border: `1px solid ${themeColors.border}`,
                        borderRadius: '12px'
                    }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Box display="flex" alignItems="center">
                                {getTypeIcon()}
                                <Typography variant="h6" sx={{
                                    ml: 1,
                                    fontWeight: 'bold',
                                    color: themeColors.primary
                                }}>
                                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                </Typography>
                            </Box>

                            <Box display="flex" gap={1}>
                                <TextField
                                    size="small"
                                    placeholder="Buscar..."
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search sx={{ color: themeColors.textSecondary }} />
                                            </InputAdornment>
                                        ),
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
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    sx={{ width: 180 }}
                                />

                                <TextField
                                    select
                                    size="small"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    SelectProps={{ native: true }}
                                    sx={{
                                        width: 120,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: themeColors.border,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: themeColors.primary,
                                            },
                                        }
                                    }}
                                >
                                    <option value="todos">Todos</option>
                                    {[...new Set(historialData[tipo].map(item => item.estado))].map((estado) => (
                                        <option key={estado} value={estado}>{estado}</option>
                                    ))}
                                </TextField>
                            </Box>
                        </Box>

                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{
                                    backgroundColor: themeColors.primary,
                                    '& th': {
                                        color: '#fff',
                                        fontWeight: 'bold'
                                    }
                                }}>
                                    {tipo === 'compras' && (
                                        <>
                                            <TableCell>Producto</TableCell>
                                            <TableCell>Fecha</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                            <TableCell>Estado</TableCell>
                                            <TableCell></TableCell>
                                        </>
                                    )}
                                    {tipo === 'arriendos' && (
                                        <>
                                            <TableCell>Tipo</TableCell>
                                            <TableCell>Desde</TableCell>
                                            <TableCell>Hasta</TableCell>
                                            <TableCell align="right">Precio</TableCell>
                                            <TableCell>Estado</TableCell>
                                            <TableCell></TableCell>
                                        </>
                                    )}
                                    {tipo === 'reparaciones' && (
                                        <>
                                            <TableCell>Descripción</TableCell>
                                            <TableCell>Técnico</TableCell>
                                            <TableCell>Fecha</TableCell>
                                            <TableCell align="right">Costo</TableCell>
                                            <TableCell>Estado</TableCell>
                                            <TableCell></TableCell>
                                        </>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.length > 0 ? (
                                    paginatedData.map((item) => (
                                        <React.Fragment key={item.id}>
                                            <TableRow hover sx={{
                                                '&:nth-of-type(even)': {
                                                    backgroundColor: themeColors.highlight
                                                }
                                            }}>
                                                {tipo === 'compras' && (
                                                    <>
                                                        <TableCell sx={{ color: themeColors.textPrimary }}>{item.producto}</TableCell>
                                                        <TableCell sx={{ color: themeColors.textPrimary }}>{item.fecha}</TableCell>
                                                        <TableCell align="right" sx={{ color: themeColors.textPrimary }}>${item.total.toLocaleString()}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={item.estado}
                                                                size="small"
                                                                color={getStatusColor(item.estado)}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleExpandRow(item.id)}
                                                                sx={{ color: themeColors.primary }}
                                                            >
                                                                {expandedRow === item.id ? <ExpandLess /> : <ExpandMore />}
                                                            </IconButton>
                                                        </TableCell>
                                                    </>
                                                )}
                                                {tipo === 'arriendos' && (
                                                    <>
                                                        <TableCell sx={{ color: themeColors.textPrimary }}>{item.tipo}</TableCell>
                                                        <TableCell sx={{ color: themeColors.textPrimary }}>{item.desde}</TableCell>
                                                        <TableCell sx={{ color: themeColors.textPrimary }}>{item.hasta}</TableCell>
                                                        <TableCell align="right" sx={{ color: themeColors.textPrimary }}>${item.precio.toLocaleString()}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={item.estado}
                                                                size="small"
                                                                color={getStatusColor(item.estado)}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleExpandRow(item.id)}
                                                                sx={{ color: themeColors.primary }}
                                                            >
                                                                {expandedRow === item.id ? <ExpandLess /> : <ExpandMore />}
                                                            </IconButton>
                                                        </TableCell>
                                                    </>
                                                )}
                                                {tipo === 'reparaciones' && (
                                                    <>
                                                        <TableCell sx={{ color: themeColors.textPrimary }}>{item.descripcion}</TableCell>
                                                        <TableCell sx={{ color: themeColors.textPrimary }}>{item.tecnico}</TableCell>
                                                        <TableCell sx={{ color: themeColors.textPrimary }}>{item.fecha}</TableCell>
                                                        <TableCell align="right" sx={{ color: themeColors.textPrimary }}>${item.costo.toLocaleString()}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={item.estado}
                                                                size="small"
                                                                color={getStatusColor(item.estado)}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleExpandRow(item.id)}
                                                                sx={{ color: themeColors.primary }}
                                                            >
                                                                {expandedRow === item.id ? <ExpandLess /> : <ExpandMore />}
                                                            </IconButton>
                                                        </TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                    <Collapse in={expandedRow === item.id} timeout="auto" unmountOnExit>
                                                        <Box sx={{
                                                            margin: 1,
                                                            p: 2,
                                                            backgroundColor: themeColors.highlight,
                                                            borderRadius: '8px',
                                                            border: `1px solid ${themeColors.border}`
                                                        }}>
                                                            <Typography variant="subtitle2" gutterBottom sx={{ color: themeColors.primary }}>
                                                                Detalles
                                                            </Typography>
                                                            {tipo === 'compras' && (
                                                                <Typography sx={{ color: themeColors.textPrimary }}>
                                                                    Puedes realizar una devolución de este producto hasta el {new Date(item.fecha).toLocaleDateString()}.
                                                                </Typography>
                                                            )}
                                                            {tipo === 'arriendos' && (
                                                                <Typography sx={{ color: themeColors.textPrimary }}>
                                                                    Bicicleta arrendada por {(new Date(item.hasta) - new Date(item.desde)) / (1000 * 60 * 60 * 24)} días.
                                                                </Typography>
                                                            )}
                                                            {tipo === 'reparaciones' && (
                                                                <Typography sx={{ color: themeColors.textPrimary }}>
                                                                    Técnico asignado: {item.tecnico}. Contacto: contacto@taller.com
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                            <Typography sx={{ color: themeColors.textSecondary }}>
                                                No se encontraron registros
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {pageCount > 1 && (
                            <Box display="flex" justifyContent="center" mt={2}>
                                <Pagination
                                    count={pageCount}
                                    page={page}
                                    onChange={(_, value) => setPage(value)}
                                    color="primary"
                                    size="small"
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            color: themeColors.primary,
                                            '&.Mui-selected': {
                                                backgroundColor: themeColors.primary,
                                                color: '#fff'
                                            }
                                        }
                                    }}
                                />
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
}