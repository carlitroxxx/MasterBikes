import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, Avatar } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const themeColors = {
    primary: '#0A2E5A',
    secondary: '#FFA000',
    accent: '#26A69A',
    background: '#F5F7FA',
    paper: '#FFFFFF',
    textPrimary: '#212121',
    textSecondary: '#455A64',
    success: '#2E7D32',
    error: '#C62828',
    warning: '#F57F17',
    info: '#1565C0',
    highlight: '#E8EAF6',
    border: '#90A4AE'
};

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.includes('@') || !email.includes('.')) {
            setError('Ingrese un correo electrónico válido');
            return;
        }

        try {
            const result = await login(email, password);

            if (!result.success) {
                setError('Error al iniciar sesión');
                return;
            }

            // Verificar si el usuario es un cliente
            if (result.user.role !== 'CLIENTE') {
                setError('Acceso restringido. Esta área es solo para clientes.');
                logout(); // Limpiamos la sesión
                return;
            }

            // Redirigir a la página de clientes
            navigate('/cliente/shop');
        } catch (error) {
            console.error('Login error:', error);

            switch (error.message) {
                case 'USER_DISABLED':
                    setError('Tu cuenta está deshabilitada. Contacta al administrador.');
                    break;
                case 'LOGIN_FAILED':
                    setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
                    break;
                case 'No se pudo conectar al servidor':
                    setError('Error de conexión. Por favor, verifica tu conexión a internet.');
                    break;
                case 'EMAIL_INVALID':
                    setError('Ingrese un correo electrónico válido');
                    break;
                default:
                    setError('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{
            backgroundColor: themeColors.background,
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Paper elevation={3} sx={{
                p: 4,
                width: '100%',
                backgroundColor: themeColors.paper,
                border: `1px solid ${themeColors.border}`,
                borderRadius: '12px'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <Avatar sx={{
                        m: 1,
                        backgroundColor: themeColors.primary,
                        width: 56,
                        height: 56
                    }}>
                        <LockIcon fontSize="medium" />
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{
                        color: themeColors.primary,
                        fontWeight: 'bold'
                    }}>
                        Iniciar sesión como Cliente
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Correo electrónico"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            autoComplete="current-password"
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
                            <Typography color={themeColors.error} variant="body2" sx={{ mt: 1 }}>
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
                                backgroundColor: themeColors.primary,
                                '&:hover': {
                                    backgroundColor: '#0A1E40',
                                },
                                fontWeight: 'bold',
                                fontSize: '1rem'
                            }}
                        >
                            Iniciar sesión
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                variant="text"
                                onClick={() => navigate('/registro')}
                                sx={{
                                    textTransform: 'none',
                                    color: themeColors.primary,
                                    '&:hover': {
                                        backgroundColor: 'rgba(10, 46, 90, 0.08)'
                                    }
                                }}
                            >
                                ¿No tienes cuenta? Regístrate
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}