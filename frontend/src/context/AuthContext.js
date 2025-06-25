import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:8081/api/auth/login', { email, password });
            const { token, nombre, role, email: userEmail } = response.data;

            const userData = { nombre, role, email: userEmail };
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);

            // Redirigir según el rol
            if (role === 'CLIENTE') {
                navigate('/cliente/shop');
            } else {
                navigate(`/${role.toLowerCase()}/dashboard`);
            }

            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const register = async (nombre, email, password) => {
        try {
            const response = await axios.post('http://localhost:8081/api/auth/register', { nombre, email, password });
            const { token, nombre: userName, role, email: userEmail } = response.data;

            const userData = { nombre: userName, role, email: userEmail };
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);

            navigate('/cliente/shop');
            return true;
        } catch (error) {
            console.error('Register error:', error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        navigate('/login');
    };

    const updateProfile = async (nombre) => {
        try {
            const response = await axios.put(
                'http://localhost:8081/api/auth/update-profile',
                { nombre },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
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

    const changePassword = async (currentPassword, newPassword, confirmPassword) => {
        try {
            await axios.put(
                'http://localhost:8081/api/auth/change-password',
                { currentPassword, newPassword, confirmPassword },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            return true;
        } catch (error) {
            console.error('Change password error:', error);
            let errorMessage = 'Error al cambiar la contraseña';

            if (error.response) {
                // Si el backend devuelve un mensaje específico
                if (error.response.data.message.includes('contraseña actual')) {
                    errorMessage = 'La contraseña actual es incorrecta';
                } else if (error.response.data.message.includes('coinciden')) {
                    errorMessage = 'Las nuevas contraseñas no coinciden';
                }
            }

            throw new Error(errorMessage);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
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