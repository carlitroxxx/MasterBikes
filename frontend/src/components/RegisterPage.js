import React, { useState } from 'react';
import { validateRut, formatRut } from './rutUtils';
import { Container, TextField, Button, Typography, Box, Paper, Avatar } from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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

export default function RegisterPage() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rut, setRut] = useState('');
    const [rutError, setRutError] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState('');

    const handleRutChange = (e) => {
        const rawValue = e.target.value;
        const formatted = formatRut(rawValue);
        setRut(formatted);

        // Validar solo cuando el RUT está completo
        if (formatted.includes('-')) {
            setRutError(validateRut(formatted) ? '' : 'RUT inválido');
        } else {
            setRutError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError('');
        setError('');
        setRutError('');

        if (!validateRut(rut)) {
            setRutError('Por favor ingrese un RUT válido');
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            setEmailError('Ingrese un correo electrónico válido');
            return;
        }
        try {
            await register(nombre, email, password, rut);
            setEmailError('');
            setError('');
            setRutError('');
        } catch (error) {
            switch(error.message) {
                case 'EMAIL_EXISTS':
                    setError('El correo electrónico ya está en uso');
                    break;
                case 'RUT_EXISTS':
                    setError('El RUT ya está registrado');
                    break;
                case 'RUT_REQUIRED':
                    setRutError('El RUT es obligatorio');
                    break;
                case 'EMAIL_INVALID':
                    setEmailError('Ingrese un correo electrónico válido');
                    break;
                default:
                    setError('Error al registrarse. Por favor intente nuevamente');
            }
        }
    };

    return (
        <Container
            component="main"
            maxWidth="xs"
            sx={{
                backgroundColor: themeColors.background,
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                py: 4
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: '100%',
                    backgroundColor: themeColors.paper,
                    border: `1px solid ${themeColors.border}`,
                    borderRadius: '12px'
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                        sx={{
                            m: 1,
                            bgcolor: themeColors.primary,
                            width: 56,
                            height: 56
                        }}
                    >
                        <PersonAddIcon fontSize="large" />
                    </Avatar>
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{
                            color: themeColors.primary,
                            fontWeight: 'bold',
                            mb: 2
                        }}
                    >
                        Registro de Cliente
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Nombre completo"
                            autoComplete="name"
                            autoFocus
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
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
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="RUT (Ej: 12.345.678-9)"
                            value={rut}
                            onChange={handleRutChange}
                            error={!!rutError}
                            helperText={rutError}
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
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Correo electrónico"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!emailError}
                            helperText={emailError}
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
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Contraseña"
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        {error && (
                            <Typography
                                color="error"
                                variant="body2"
                                sx={{
                                    mt: 1,
                                    color: themeColors.error,
                                    backgroundColor: '#FFEBEE',
                                    p: 1,
                                    borderRadius: '4px'
                                }}
                            >
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                py: 1.5,
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
                                fontSize: '1rem'
                            }}
                            disabled={!!rutError}
                        >
                            Registrarse
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                variant="text"
                                onClick={() => navigate('/login')}
                                sx={{
                                    textTransform: 'none',
                                    color: themeColors.primary,
                                    '&:hover': {
                                        backgroundColor: 'rgba(10, 46, 90, 0.04)'
                                    }
                                }}
                            >
                                ¿Ya tienes cuenta? Inicia sesión
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}