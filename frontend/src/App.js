import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import RegistroUsuario from './components/RegistroUsuario';
import LoginUsuario from './components/LoginUsuario';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { isAuthenticated } from './utils/auth';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('loggedUser');
        navigate('/login');
    };

    const loggedIn = isAuthenticated();

    return (
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    {loggedIn && (
                        <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
                    )}
                    {!loggedIn && (
                        <>
                            <Button color="inherit" component={Link} to="/login">Login</Button>
                            <Button color="inherit" component={Link} to="/registro">Registro</Button>
                        </>
                    )}
                </Box>
                {loggedIn && (
                    <Button color="inherit" onClick={handleLogout}>Cerrar sesión</Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/login" element={
                    isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LoginUsuario />
                } />
                <Route path="/registro" element={
                    isAuthenticated() ? <Navigate to="/dashboard" replace /> : <RegistroUsuario />
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
a