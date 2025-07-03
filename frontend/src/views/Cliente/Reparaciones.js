import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    InputAdornment,
    MenuItem,
    CircularProgress,
    Snackbar,
    Alert,
    Paper,
    Divider,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    DateRange,
    AccessTime,
    Description,
    DirectionsBike,
    Build,
    ContactPhone
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: '12px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: themeColors.paper,
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2)
    }
}));

export default function Reparaciones() {
    const [form, setForm] = useState({
        fecha: '',
        hora: '',
        descripcion: '',
        tipoReparacion: '',
        telefono: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const tiposReparacion = [
        'Ajuste de frenos',
        'Ajuste de cambios',
        'Reparación de pinchazo',
        'Centrado de ruedas',
        'Cambio de cadena',
        'Ajuste de suspensión',
        'Limpieza y lubricación',
        'Revisión general',
        'Otro'
    ];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validaciones
        if (!form.fecha || !form.hora || !form.descripcion || !form.tipoReparacion) {
            setSnackbar({ open: true, message: 'Por favor complete todos los campos requeridos', severity: 'error' });
            setIsLoading(false);
            return;
        }

        // Simulación de envío a API
        setTimeout(() => {
            console.log('Datos enviados:', form);
            setSnackbar({ open: true, message: 'Reparación agendada con éxito! Nos contactaremos para confirmar.', severity: 'success' });
            setIsLoading(false);
            // Reset form
            setForm({
                fecha: '',
                hora: '',
                descripcion: '',
                tipoReparacion: '',
                telefono: ''
            });
        }, 2000);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container maxWidth="lg" sx={{
            py: 4,
            mx: 'none',
            backgroundColor: themeColors.background,
            minHeight: '100vh'
        }}>
            <StyledPaper elevation={3}>
                <Box display="flex" alignItems="center" mb={3} flexDirection={isSmallScreen ? 'column' : 'row'} textAlign={isSmallScreen ? 'center' : 'left'}>
                    <DirectionsBike sx={{
                        fontSize: 40,
                        mr: isSmallScreen ? 0 : 2,
                        mb: isSmallScreen ? 1 : 0,
                        color: themeColors.primary
                    }} />
                    <Typography variant="h4" component="h1" sx={{ color: themeColors.primary }}>
                        Agendar Reparación de Bicicleta
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    {/* Primera fila - Campos superiores */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Fecha de reparación *"
                                type="date"
                                name="fecha"
                                InputLabelProps={{ shrink: true }}
                                value={form.fecha}
                                onChange={handleChange}
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
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DateRange sx={{ color: themeColors.textSecondary }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} sx={{
                            width: isSmallScreen ? '100%' : '13%',
                            minWidth: isSmallScreen ? '100%' : '120px'
                        }}>
                            <TextField
                                fullWidth
                                label="Hora disponible *"
                                type="time"
                                name="hora"
                                InputLabelProps={{ shrink: true }}
                                value={form.hora}
                                onChange={handleChange}
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
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccessTime sx={{ color: themeColors.textSecondary }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} sx={{
                            width: isSmallScreen ? '100%' : '27%',
                            minWidth: isSmallScreen ? '100%' : '250px'
                        }}>
                            <TextField
                                select
                                fullWidth
                                label="Tipo de reparación *"
                                name="tipoReparacion"
                                value={form.tipoReparacion}
                                onChange={handleChange}
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
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Build sx={{ color: themeColors.textSecondary }} />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                {tiposReparacion.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    {/* Campo de descripción */}
                    <TextField
                        fullWidth
                        label="Descripción detallada del problema *"
                        name="descripcion"
                        multiline
                        rows={isSmallScreen ? 3 : 4}
                        value={form.descripcion}
                        onChange={handleChange}
                        required
                        sx={{
                            mb: 3,
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
                                    <Description sx={{ color: themeColors.textSecondary }} />
                                </InputAdornment>
                            ),
                        }}
                        placeholder="Describa con detalle el problema que presenta su bicicleta..."
                    />

                    <Divider sx={{
                        my: 3,
                        borderColor: themeColors.border
                    }} />

                    {/* Segunda fila - Contacto y botón con posición final */}
                    <Grid container spacing={3} alignItems="flex-start" justifyContent={"space-between"}>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth
                                label="Teléfono de contacto"
                                name="telefono"
                                type="tel"
                                value={form.telefono}
                                onChange={handleChange}
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
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ContactPhone sx={{ color: themeColors.textSecondary }} />
                                        </InputAdornment>
                                    ),
                                }}
                                helperText="Opcional, para contactarlo si hay dudas"
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} sx={{
                            display: 'flex',
                            justifyContent: { xs: 'flex-end', sm: 'flex-end' },
                            alignItems: 'flex-end',
                            mt: { xs: 2, sm: 0 }
                        }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth={isSmallScreen}
                                sx={{
                                    height: '56px',
                                    minWidth: isSmallScreen ? '100%' : '200px',
                                    backgroundColor: themeColors.success,
                                    '&:hover': {
                                        backgroundColor: '#2E7D32',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                                disabled={isLoading}
                                startIcon={isLoading ? <CircularProgress size={20} /> : null}
                            >
                                {isLoading ? 'Agendando...' : 'SOLICITAR REPARACIÓN'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </StyledPaper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{
                        width: '100%',
                        backgroundColor: snackbar.severity === 'error' ? themeColors.error : themeColors.success,
                        color: '#fff'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}