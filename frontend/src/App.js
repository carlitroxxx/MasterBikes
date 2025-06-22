import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClienteRoutes from './routes/ClienteRoutes';
import Navbar from './components/Navbar';
import InventarioRoutes from "./routes/InventarioRoutes";
import LoginPage from './components/LoginPage';
import EmployeeLoginPage from './components/EmployeeLoginPage';
import RegisterPage from './components/RegisterPage';
import EmployeeRegisterPage from './components/EmployeeRegisterPage';
import {AuthProvider, useAuth} from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/login/employee" element={<EmployeeLoginPage />} />
                    <Route path="/registro" element={<RegisterPage />} />
                    <Route path="/registro/employee" element={
                        <PrivateRoute allowedRoles={['SUPERVISOR']}>
                            <EmployeeRegisterPage />
                        </PrivateRoute>
                    } />

                    <Route path="/cliente/*" element={
                        <PrivateRoute allowedRoles={['CLIENTE']}>
                            <ClienteRoutes />
                        </PrivateRoute>
                    } />
                    <Route path="/inventario/*" element={
                        <PrivateRoute allowedRoles={['INVENTARIO']}>
                            <InventarioRoutes />
                        </PrivateRoute>
                    } />

                    {/* Redirigir según el rol cuando se accede a la raíz */}
                    <Route path="/" element={<HomeRedirect />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

function HomeRedirect() {
    const { user } = useAuth();

    if (user) {
        if (user.role === 'CLIENTE') {
            return <Navigate to="/cliente/catalogo" replace />;
        } else {
            return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />;
        }
    }

    return <Navigate to="/login" replace />;
}

export default App;