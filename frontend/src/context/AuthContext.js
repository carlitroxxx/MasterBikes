import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Cargar datos de usuario al iniciar
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    // Función de login modificada
    const login = async (email, password) => {
        try {
            // Validación básica
            if (!email || !password) {
                throw new Error('Email y contraseña son requeridos');
            }

            if (!email.includes('@') || !email.includes('.')) {
                throw new Error('EMAIL_INVALID');
            }

            const response = await axios.post('http://localhost:8081/api/auth/login', {
                email,
                password
            }, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.data || !response.data.token) {
                throw new Error('Respuesta inválida del servidor');
            }

            const { token, nombre, role, email: userEmail, rut, enabled } = response.data;

            if (!nombre || !role || !userEmail) {
                throw new Error('Datos de usuario incompletos');
            }

            if (!enabled) {
                throw new Error('USER_DISABLED');
            }

            const userData = {
                nombre,
                role,
                email: userEmail,
                rut: rut || null,
                token // Incluimos el token en el objeto usuario
            };

            // Almacenamiento seguro
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);

            return {
                success: true,
                user: userData
            };

        } catch (error) {
            console.error('Login error:', error);

            if (error.response) {
                const errorCode = error.response.data?.code || error.response.data?.message;
                if (errorCode === 'USER_DISABLED' || errorCode.includes('deshabilitada')) {
                    throw new Error('USER_DISABLED');
                } else if (errorCode === 'LOGIN_FAILED' || errorCode.includes('credenciales')) {
                    throw new Error('LOGIN_FAILED');
                } else {
                    throw new Error(error.response.data?.message || 'Error al iniciar sesión');
                }
            } else if (error.request) {
                throw new Error('No se pudo conectar al servidor');
            } else {
                throw error;
            }
        }
    };

    // Función de registro
    const register = async (nombre, email, password, rut) => {
        try {
            if (!email.includes('@') || !email.includes('.')) {
                throw new Error('EMAIL_INVALID');
            }

            const response = await axios.post('http://localhost:8081/api/auth/register', {
                nombre,
                email,
                password,
                rut
            }, {
                timeout: 10000
            });

            const { token, nombre: userName, role, email: userEmail, rut: userRut } = response.data;

            const userData = {
                nombre: userName,
                role,
                email: userEmail,
                rut: userRut,
                token
            };

            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);

            return {
                success: true,
                user: userData
            };

        } catch (error) {
            console.error('Register error:', error);

            if (error.response) {
                const errorCode = error.response.data?.code;
                if (errorCode === 'EMAIL_EXISTS') {
                    throw new Error('EMAIL_EXISTS');
                } else if (errorCode === 'RUT_EXISTS') {
                    throw new Error('RUT_EXISTS');
                } else if (errorCode === 'RUT_REQUIRED') {
                    throw new Error('RUT_REQUIRED');
                } else {
                    throw new Error(error.response.data?.message || 'Error al registrarse');
                }
            } else if (error.request) {
                throw new Error('No se pudo conectar al servidor');
            } else {
                throw error;
            }
        }
    };

    // Función de logout
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        navigate('/login');
    };

    // Actualizar perfil
    const updateProfile = async (nombre) => {
        try {
            const response = await axios.put(
                'http://localhost:8081/api/auth/update-profile',
                { nombre },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    timeout: 10000
                }
            );

            const updatedUser = { ...user, nombre: response.data.nombre };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            return true;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    };

    // Cambiar contraseña
    const changePassword = async (currentPassword, newPassword, confirmPassword) => {
        try {
            await axios.put(
                'http://localhost:8081/api/auth/change-password',
                { currentPassword, newPassword, confirmPassword },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    timeout: 10000
                }
            );
            return true;
        } catch (error) {
            console.error('Change password error:', error);
            let errorMessage = 'Error al cambiar la contraseña';

            if (error.response) {
                if (error.response.data.message.includes('contraseña actual')) {
                    errorMessage = 'La contraseña actual es incorrecta';
                } else if (error.response.data.message.includes('coinciden')) {
                    errorMessage = 'Las nuevas contraseñas no coinciden';
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            }

            throw new Error(errorMessage);
        }
    };

    // Verificar autenticación
    const isAuthenticated = () => {
        return !!user && !!localStorage.getItem('token');
    };

    // Verificar roles
    const hasRole = (requiredRole) => {
        if (!user) return false;
        return user.role === requiredRole;
    };

    // Verificar cualquier rol de una lista
    const hasAnyRole = (requiredRoles) => {
        if (!user) return false;
        return requiredRoles.includes(user.role);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated,
            hasRole,
            hasAnyRole,
            login,
            register,
            logout,
            updateProfile,
            changePassword
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}