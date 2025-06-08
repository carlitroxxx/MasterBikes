import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

function RegistroUsuario() {
    const [usuario, setUsuario] = useState({
        nombre: '',
        correo: '',
        password: ''
    });

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8081/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario)
            });

            if (response.ok) {
                alert("Usuario registrado ✅");
                setUsuario({ nombre: '', correo: '', password: '' });
            } else {
                alert("Error al registrar ❌");
            }
        } catch (error) {
            alert("Error de conexión ❌");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={5}>
                <Typography variant="h5" gutterBottom>Registro de Usuario</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label="Nombre" name="nombre" value={usuario.nombre} onChange={handleChange} margin="normal" required />
                    <TextField fullWidth label="Correo" name="correo" value={usuario.correo} onChange={handleChange} margin="normal" required />
                    <TextField fullWidth label="Password" type="password" name="password" value={usuario.password} onChange={handleChange} margin="normal" required />
                    <Button fullWidth type="submit" variant="contained" color="primary">Registrarse</Button>
                </form>
            </Box>
        </Container>
    );
}

export default RegistroUsuario;
