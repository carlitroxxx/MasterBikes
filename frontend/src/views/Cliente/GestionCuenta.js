import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Avatar,
    InputAdornment,
    IconButton,
    Alert,
    Divider
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Visibility, VisibilityOff, Person, Email, Lock, Badge } from '@mui/icons-material';
import { formatRut } from '../../components/rutUtils';

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

export default function GestionCuenta() {
    const { user, updateProfile, changePassword } = useAuth();
    const [usuario, setUsuario] = useState({
        nombre: '',
        correo: '',
        rut: '',
        password: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (user) {
            setUsuario(prev => ({
                ...prev,
                nombre: user.nombre,
                correo: user.email,
                rut: user.rut ? formatRut(user.rut) : 'No registrado'
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!usuario.nombre.trim()) newErrors.nombre = 'Nombre es requerido';

        if (usuario.newPassword && !usuario.password) {
            newErrors.password = 'Debes ingresar tu contraseña actual para cambiarla';
        }

        if (usuario.newPassword && usuario.newPassword.length < 6) {
            newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (usuario.newPassword !== usuario.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (validate()) {
            try {
                await updateProfile(usuario.nombre);

                if (usuario.newPassword) {
                    await changePassword(
                        usuario.password,
                        usuario.newPassword,
                        usuario.confirmPassword
                    );
                }

                setSuccessMessage('Tus datos se han actualizado correctamente');
                setTimeout(() => setSuccessMessage(''), 3000);

                setUsuario(prev => ({
                    ...prev,
                    password: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            } catch (error) {
                console.error('Error al actualizar datos:', error);
                setSubmitError(error.response?.data?.message || error.message || 'Error al actualizar los datos');
            }
        }
    };

    return (
        <Container maxWidth="md" sx={{
            py: 2,
            backgroundColor: themeColors.background,
            minHeight: '100vh'
        }}>
            <Typography variant="h4" gutterBottom sx={{
                fontWeight: 'bold',
                color: themeColors.primary,
                mb: 2
            }}>
                Gestión de Cuenta
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    backgroundColor: themeColors.paper,
                    borderRadius: 2,
                    boxShadow: 1,
                    p: 4,
                    border: `1px solid ${themeColors.border}`
                }}
            >
                <Box display="flex" alignItems="center" mb={4}>
                    <Avatar sx={{
                        width: 80,
                        height: 80,
                        mr: 3,
                        bgcolor: themeColors.primary,
                        fontSize: '2rem',
                        color: '#fff'
                    }}>
                        {usuario.nombre.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" sx={{ color: themeColors.textPrimary }}>
                        {usuario.nombre}
                    </Typography>
                </Box>

                {successMessage && (
                    <Alert severity="success" sx={{
                        mb: 3,
                        backgroundColor: themeColors.success,
                        color: '#fff'
                    }}>
                        {successMessage}
                    </Alert>
                )}

                {submitError && (
                    <Alert severity="error" sx={{
                        mb: 3,
                        backgroundColor: themeColors.error,
                        color: '#fff'
                    }}>
                        {submitError}
                    </Alert>
                )}

                <Typography variant="subtitle1" gutterBottom sx={{
                    mt: 2,
                    fontWeight: 'bold',
                    color: themeColors.primary
                }}>
                    Información básica
                </Typography>

                <TextField
                    label="Nombre completo"
                    name="nombre"
                    value={usuario.nombre}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.nombre}
                    helperText={errors.nombre}
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
                                <Person color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    label="RUT"
                    name="rut"
                    value={usuario.rut}
                    fullWidth
                    margin="normal"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: themeColors.highlight,
                            '& fieldset': {
                                borderColor: themeColors.border,
                            },
                        }
                    }}
                    InputProps={{
                        readOnly: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <Badge color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    label="Correo electrónico"
                    name="correo"
                    value={usuario.correo}
                    fullWidth
                    margin="normal"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: themeColors.highlight,
                            '& fieldset': {
                                borderColor: themeColors.border,
                            },
                        }
                    }}
                    InputProps={{
                        readOnly: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <Email color="action" />
                            </InputAdornment>
                        ),
                    }}
                />

                <Divider sx={{
                    my: 4,
                    borderColor: themeColors.border
                }} />

                <Typography variant="subtitle1" gutterBottom sx={{
                    fontWeight: 'bold',
                    color: themeColors.primary
                }}>
                    Cambiar contraseña
                </Typography>

                <TextField
                    label="Contraseña actual"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={usuario.password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password}
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
                                <Lock color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    label="Nueva contraseña"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={usuario.newPassword}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.newPassword}
                    helperText={errors.newPassword}
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
                                <Lock color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    edge="end"
                                >
                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    label="Confirmar nueva contraseña"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={usuario.confirmPassword}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
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
                                <Lock color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    edge="end"
                                >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Box sx={{
                    mt: 4,
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '1rem',
                            backgroundColor: themeColors.success,
                            '&:hover': {
                                backgroundColor: '#2E7D32',
                            }
                        }}
                    >
                        Actualizar datos
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}