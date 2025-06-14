// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginUsuario from './components/LoginUsuario';
import RegistroUsuario from './components/RegistroUsuario';
import Dashboard from './components/Dashboard';
import ClienteRoutes from './routes/ClienteRoutes';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar'; // ✅ Asegurate de importar esto
import { isAuthenticated } from './utils/auth';
import InventarioRoutes from "./routes/InventarioRoutes";

function App() {
    return (
        <Router>
            <Navbar /> {/* ✅ Navbar arriba de todo */}
            <Routes>
                <Route path="/cliente/*" element={
                    <ClienteRoutes />
                } />
                <Route path="/inventario/*" element={
                <InventarioRoutes />
                } />
                <Route path="/login" element={
                    isAuthenticated() ? <Navigate to="/cliente/catalogo" replace /> : <LoginUsuario />
                } />
                <Route path="/registro" element={
                    isAuthenticated() ? <Navigate to="/cliente/catalogo" replace /> : <RegistroUsuario />
                } />
                <Route path="/dashboard" element={
                    <Dashboard />
                } />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
