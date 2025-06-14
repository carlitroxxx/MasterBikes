import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function LoginUsuario() {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:8081/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, password })
        });
        if (res.ok) {
            const user = await res.json();
            localStorage.setItem('loggedUser', JSON.stringify(user));
            navigate('/dashboard');
        } else {
            alert('Credenciales inválidas');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>Iniciar Sesión</Typography>
            <form onSubmit={handleSubmit}>
                <TextField fullWidth margin="normal" label="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                <TextField fullWidth margin="normal" label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type="submit" variant="contained" color="primary">Ingresar</Button>
            </form>
        </Container>
    );
}

export default LoginUsuario;