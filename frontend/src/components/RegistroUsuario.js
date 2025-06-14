import React, { useState } from 'react';
import { TextField, Button, Container, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function RegistroUsuario() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ nombre: '', correo: '', password: '', rol: 'cliente' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:8081/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        if (res.ok) {
            navigate('/login');
        } else {
            alert('Error al registrar');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>Registro de Usuario</Typography>
            <form onSubmit={handleSubmit}>
                <TextField fullWidth name="nombre" margin="normal" label="Nombre" value={form.nombre} onChange={handleChange} />
                <TextField fullWidth name="correo" margin="normal" label="Correo" value={form.correo} onChange={handleChange} />
                <TextField fullWidth name="password" margin="normal" label="Contraseña" type="password" value={form.password} onChange={handleChange} />
                <TextField select fullWidth name="rol" margin="normal" label="Rol" value={form.rol} onChange={handleChange}>
                    <MenuItem value="cliente">Cliente</MenuItem>
                    <MenuItem value="inventario">Inventario</MenuItem>
                    <MenuItem value="vendedor">Vendedor</MenuItem>
                </TextField>
                <Button type="submit" variant="contained" color="primary">Registrar</Button>
            </form>
        </Container>
    );
}

export default RegistroUsuario;
