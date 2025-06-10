import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

import { useNavigate } from 'react-router-dom';

function LoginUsuario() {
    const [form, setForm] = useState({ correo: '', password: '' });
    const [mensaje, setMensaje] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Obtener todos los usuarios desde el backend
            const res = await fetch("http://localhost:8081/usuarios");
            const usuarios = await res.json();

            // Buscar uno que coincida
            const usuario = usuarios.find(u => u.correo === form.correo && u.password === form.password);

            if (usuario) {
                localStorage.setItem('loggedUser', JSON.stringify(usuario));

                switch (usuario.rol) {
                    case 'cliente':
                        navigate('/cliente/catalogo');
                        break;
                    case 'vendedor':
                        navigate('/vendedor/ventas');
                        break;
                    case 'tecnico':
                        navigate('/tecnico/reparaciones');
                        break;
                    case 'admin':
                        navigate('/reportes/dashboard');
                        break;
                    default:
                        navigate('/login'); // o página de error
                }
            } else {
                setMensaje("Correo o contraseña incorrectos ❌");
            }

        } catch (error) {
            console.error(error);
            setMensaje("Error al conectar con el servidor ❌");
        }
    };



    return (
        <Container maxWidth="sm">
            <Box mt={5}>
                <Typography variant="h5" gutterBottom>Iniciar Sesión</Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Correo"
                        name="correo"
                        value={form.correo}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Contraseña"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <Button fullWidth type="submit" variant="contained" color="primary">Entrar</Button>
                </form>
                {mensaje && (
                    <Typography mt={2} color="secondary">{mensaje}</Typography>
                )}
            </Box>
        </Container>
    );
}

export default LoginUsuario;
