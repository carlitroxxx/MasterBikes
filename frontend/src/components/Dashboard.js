import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('loggedUser'));

    const handleLogout = () => {
        localStorage.removeItem('loggedUser');
        navigate('/login');
    };

    return (
        <Container maxWidth="sm">
            <Box mt={5}>
                <Typography variant="h4" gutterBottom>
                    ¡Hola, {user?.nombre}!
                </Typography>
                <Typography gutterBottom>Este es tu dashboard personal.</Typography>
                <Button variant="contained" color="secondary" onClick={handleLogout}>
                    Cerrar sesión
                </Button>
            </Box>
        </Container>
    );
}

export default Dashboard;
