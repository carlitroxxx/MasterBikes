import React, { useState, useEffect, useMemo } from 'react';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Button,
    TextField,
    InputAdornment,
    TableSortLabel,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { Search, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';

const API_BASE_URL = "http://localhost:8084/api/arriendos";

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

// Definición de los campos ordenables
const sortableColumns = [
    { id: 'numero', label: 'Número', sortFn: (a, b) => a.numeroArriendo - b.numeroArriendo },
    { id: 'fechaInicio', label: 'Fecha Inicio', sortFn: (a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio) },
    { id: 'fechaFin', label: 'Fecha Fin', sortFn: (a, b) => new Date(a.fechaFin) - new Date(b.fechaFin) },
    { id: 'cliente', label: 'Cliente', sortFn: (a, b) => (a.clienteNombre || '').localeCompare(b.clienteNombre || '') },
    { id: 'rut', label: 'RUT', sortFn: (a, b) => (a.clienteRut || '').localeCompare(b.clienteRut || '') },
    { id: 'estado', label: 'Estado', sortFn: (a, b) => (a.estado || '').localeCompare(b.estado || '') },
    { id: 'total', label: 'Total', sortFn: (a, b) => (a.total || 0) - (b.total || 0) }
];

export default function ListaArriendos() {
    const [arriendos, setArriendos] = useState([]);
    const [filteredArriendos, setFilteredArriendos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedArriendo, setSelectedArriendo] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [orderBy, setOrderBy] = useState('fechaInicio');
    const [order, setOrder] = useState('desc');
    const [filtroEstado, setFiltroEstado] = useState('todos');

    useEffect(() => {
        const fetchArriendos = async () => {
            try {
                const response = await axios.get(API_BASE_URL);
                const arriendosProcesados = Array.isArray(response.data)
                    ? response.data.map(item => ({
                        ...item,
                        clienteNombre: item.clienteNombre || 'Cliente no especificado',
                        clienteRut: item.clienteRut || 'Sin RUT',
                        estado: item.estado || 'DESCONOCIDO'
                    }))
                    : [];
                setArriendos(arriendosProcesados);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching rentals:", err);
                setError(err.response?.data?.message || 'Error al cargar los arriendos');
                setLoading(false);
            }
        };

        fetchArriendos();
    }, []);

    useEffect(() => {
        let filtered = arriendos;

        // Aplicar filtro por estado
        if (filtroEstado !== 'todos') {
            filtered = filtered.filter(item =>
                item.estado.toLowerCase() === filtroEstado.toLowerCase()
            );
        }

        // Aplicar filtro de búsqueda
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(item => {
                if (item.numeroArriendo?.toString().toLowerCase().includes(term)) return true;
                if (formatDate(item.fechaInicio).toLowerCase().includes(term)) return true;
                if (formatDate(item.fechaFin).toLowerCase().includes(term)) return true;
                if (item.clienteNombre?.toLowerCase().includes(term)) return true;
                if (item.clienteRut?.toLowerCase().includes(term)) return true;
                if (item.estado?.toLowerCase().includes(term)) return true;
                return false;
            });
        }

        setFilteredArriendos(filtered);
    }, [searchTerm, arriendos, filtroEstado]);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedArriendos = useMemo(() => {
        if (!orderBy) return filteredArriendos;

        const column = sortableColumns.find(col => col.id === orderBy);
        if (!column) return filteredArriendos;

        return [...filteredArriendos].sort((a, b) => {
            return order === 'asc'
                ? column.sortFn(a, b)
                : column.sortFn(b, a);
        });
    }, [filteredArriendos, orderBy, order]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const formatDateTime = (dateString) => {
        return dayjs(dateString).isValid()
            ? dayjs(dateString).format('DD/MM/YYYY HH:mm')
            : 'Fecha no válida';
    };

    const handleViewDetails = (arriendo) => {
        setSelectedArriendo(arriendo);
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
            ? dayjs(dateString).format('DD/MM/YYYY')
            : 'Fecha no válida';
    };

    const handleFinalizarArriendo = async (id) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}/finalizar`);
            const updatedArriendo = response.data;

            setArriendos(prev => prev.map(item =>
                item.id === id ? updatedArriendo : item
            ));
            setFilteredArriendos(prev => prev.map(item =>
                item.id === id ? updatedArriendo : item
            ));

            if (selectedArriendo?.id === id) {
                setSelectedArriendo(updatedArriendo);
            }
        } catch (err) {
            console.error("Error finalizando arriendo:", err);
            setError(err.response?.data?.message || 'Error al finalizar el arriendo');
        }
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

    if (!arriendos || arriendos.length === 0) {
        return (
            <Box sx={{
                backgroundColor: themeColors.background,
                p: 3,
                minHeight: '100vh'
            }}>
                <Typography variant="body1" sx={{ color: themeColors.textPrimary }}>
                    No hay arriendos registrados
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
                    Arriendos Registrados
                </Typography>

                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 3,
                    flexDirection: { xs: 'column', sm: 'row' }
                }}>
                    {/* Select para filtrar por estado */}
                    <FormControl sx={{
                        minWidth: 180,
                        backgroundColor: themeColors.paper,
                        borderRadius: '4px'
                    }}>
                        <InputLabel sx={{ color: themeColors.textSecondary }}>Estado</InputLabel>
                        <Select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            label="Estado"
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
                        >
                            <MenuItem value="todos">Todos los estados</MenuItem>
                            <MenuItem value="activo">Activos</MenuItem>
                            <MenuItem value="finalizado">Finalizados</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Barra de búsqueda */}
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Buscar por número, fechas, nombre, RUT o estado del cliente..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{
                            backgroundColor: themeColors.paper,
                            borderRadius: '4px',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: themeColors.border,
                                },
                                '&:hover fieldset': {
                                    borderColor: themeColors.primary,
                                },
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: themeColors.primary }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

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
                                {sortableColumns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        sortDirection={orderBy === column.id ? order : false}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableSortLabel
                                            active={orderBy === column.id}
                                            direction={orderBy === column.id ? order : 'asc'}
                                            onClick={() => handleRequestSort(column.id)}
                                            IconComponent={orderBy === column.id ?
                                                (order === 'asc' ? ArrowUpward : ArrowDownward) :
                                                undefined}
                                            sx={{
                                                color: '#fff !important',
                                                '&:hover': {
                                                    color: themeColors.secondary + ' !important'
                                                }
                                            }}
                                        >
                                            {column.label}
                                            {orderBy === column.id ? (
                                                <Box component="span" sx={{ display: 'none' }}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            ) : null}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedArriendos.map((item) => (
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
                                    <TableCell sx={{ color: themeColors.textPrimary }}>{item.numeroArriendo || 'N/A'}</TableCell>
                                    <TableCell sx={{ color: themeColors.textPrimary }}>{formatDate(item.fechaInicio)}</TableCell>
                                    <TableCell sx={{ color: themeColors.textPrimary }}>{formatDate(item.fechaFin)}</TableCell>
                                    <TableCell sx={{ color: themeColors.textPrimary }}>{item.clienteNombre}</TableCell>
                                    <TableCell sx={{ color: themeColors.textPrimary }}>{item.clienteRut}</TableCell>
                                    <TableCell sx={{ color: themeColors.textPrimary }}>{item.estado}</TableCell>
                                    <TableCell sx={{ color: themeColors.textPrimary }}>{formatCurrency(item.total)}</TableCell>
                                    <TableCell>
                                        {item.estado === 'activo' ? (
                                            <Button
                                                variant="contained"
                                                onClick={() => handleViewDetails(item)}
                                                sx={{
                                                    backgroundColor: themeColors.success,
                                                    '&:hover': {
                                                        backgroundColor: '#1B5E20'
                                                    }
                                                }}
                                            >
                                                Finalizar
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                onClick={() => handleViewDetails(item)}
                                                sx={{
                                                    color: themeColors.primary,
                                                    borderColor: themeColors.primary,
                                                    '&:hover': {
                                                        backgroundColor: themeColors.highlight
                                                    }
                                                }}
                                            >
                                                Ver
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Mensaje cuando no hay resultados */}
                {sortedArriendos.length === 0 && searchTerm && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ color: themeColors.textPrimary }}>
                            No se encontraron arriendos que coincidan con "{searchTerm}"
                        </Typography>
                    </Box>
                )}

                {/* Diálogo de detalles */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    fullWidth
                    PaperProps={{
                        sx: {
                            backgroundColor: themeColors.background,
                            border: `1px solid ${themeColors.border}`,
                            maxHeight: '80vh',
                            maxWidth: '1271px'
                        }
                    }}
                >
                    <DialogTitle sx={{
                        backgroundColor: themeColors.primary,
                        color: '#fff',
                        fontWeight: 'bold'
                    }}>
                        Detalles de Arriendo
                    </DialogTitle>

                    <DialogContent sx={{
                        backgroundColor: themeColors.background,
                        overflow: 'hidden'
                    }}>
                        {selectedArriendo && (
                            <Box sx={{ pr: 3, pl: 3, pt: 3, pb: 0}}>
                                <Grid container spacing={3} sx={{
                                    display: 'flex',
                                    flexWrap: 'nowrap',
                                    width: '100%',
                                    justifyContent: 'space-between'
                                }}>
                                    {[
                                        {
                                            title: "Información Básica",
                                            content: <>
                                                <Typography><strong>N°:</strong> {selectedArriendo.numeroArriendo}</Typography>
                                                <Typography><strong>ID:</strong> {selectedArriendo.id}</Typography>
                                                <Typography sx={{ color: selectedArriendo.estado === 'activo' ? themeColors.success : themeColors.error }}>
                                                    <strong>Estado:</strong> {selectedArriendo.estado}
                                                </Typography>
                                                <Typography><strong>Bicicleta ID:</strong> {selectedArriendo.bicicletaId}</Typography>
                                            </>
                                        },
                                        {
                                            title: "Fechas",
                                            content: <>
                                                <Typography><strong>Inicio:</strong> {formatDate(selectedArriendo.fechaInicio)}</Typography>
                                                <Typography><strong>Fin:</strong> {formatDate(selectedArriendo.fechaFin)}</Typography>
                                                <Typography><strong>Días:</strong> {selectedArriendo.diasArriendo}</Typography>
                                                <Typography><strong>Creación:</strong> {formatDateTime(selectedArriendo.fechaCreacion)}</Typography>
                                            </>
                                        },
                                        {
                                            title: "Datos del Cliente",
                                            content: <>
                                                <Typography><strong>Nombre:</strong> {selectedArriendo.clienteNombre}</Typography>
                                                <Typography><strong>RUT:</strong> {selectedArriendo.clienteRut}</Typography>
                                                {selectedArriendo.clienteTelefono && <Typography><strong>Teléfono:</strong> {selectedArriendo.clienteTelefono}</Typography>}
                                                {selectedArriendo.clienteEmail && <Typography><strong>Email:</strong> {selectedArriendo.clienteEmail}</Typography>}
                                            </>
                                        },
                                        {
                                            title: "Detalles",
                                            content: <>
                                                <Typography><strong>Tarifa Diaria:</strong> {formatCurrency(selectedArriendo.tarifaDiaria)}</Typography>
                                                <Typography><strong>Depósito:</strong> {formatCurrency(selectedArriendo.deposito)}</Typography>
                                                <Typography><strong>Forma de Pago:</strong> {selectedArriendo.formaPago}</Typography>
                                                <Typography variant="h6" sx={{ mt: 2, color: themeColors.primary }}>
                                                    <strong>Total:</strong> {formatCurrency(selectedArriendo.total)}
                                                </Typography>
                                            </>
                                        }
                                    ].map((section, index) => (
                                        <Grid item key={index} sx={{
                                            minWidth: 280,
                                            maxWidth: 320,
                                            flex: 1,
                                            pr: 2
                                        }}>
                                            <Paper sx={{
                                                p: 2,
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                overflow: 'auto'
                                            }}>
                                                <Typography variant="h6" sx={{
                                                    color: themeColors.primary,
                                                    mb: 2,
                                                    pb: 1,
                                                    borderBottom: `1px solid ${themeColors.border}`
                                                }}>
                                                    {section.title}
                                                </Typography>
                                                <Box sx={{ flex: 1 }}>
                                                    {section.content}
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>

                                {/* Botones de acción */}
                                <Box sx={{
                                    mt: '50px',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 2
                                }}>
                                    {selectedArriendo.estado === 'activo' && (
                                        <Button
                                            variant="contained"
                                            onClick={() => handleFinalizarArriendo(selectedArriendo.id)}
                                            sx={{
                                                backgroundColor: themeColors.success,
                                                '&:hover': { backgroundColor: '#1B5E20' }
                                            }}
                                        >
                                            Finalizar Arriendo
                                        </Button>
                                    )}
                                    <Button
                                        variant="outlined"
                                        onClick={handleCloseDialog}
                                        sx={{
                                            color: themeColors.primary,
                                            borderColor: themeColors.primary,
                                            '&:hover': { backgroundColor: themeColors.highlight }
                                        }}
                                    >
                                        Cerrar
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>
            </Box>
        </Box>
    );
}