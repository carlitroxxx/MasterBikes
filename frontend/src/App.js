import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClienteRoutes from './routes/ClienteRoutes';
import Navbar from './components/Navbar';
import InventarioRoutes from "./routes/InventarioRoutes";
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import {AuthProvider, useAuth} from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import {CartProvider} from "./context/CartContext";
import SupervisorRoutes from "./routes/SupervisorRoutes";
import EmployeeLoginPage from "./components/EmployeeLoginPage";
import VendedorRoutes from "./routes/VendedorRoutes";
import TecnicoRoutes from "./routes/TecnicoRoutes";
import Catalogo from "./views/Cliente/Catalogo";

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                <Navbar />
                <Routes>

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/registro" element={<RegisterPage />} />
                    <Route path="login/emp" element={<EmployeeLoginPage />} />
                    <Route path="shop" element={<Catalogo />} />

                    <Route path="/supervisor/*" element={
                        <PrivateRoute allowedRoles={['SUPERVISOR']}>
                            <SupervisorRoutes />
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
                    <Route path="/vendedor/*" element={
                        <PrivateRoute allowedRoles={['VENDEDOR']}>
                            <VendedorRoutes />
                        </PrivateRoute>
                    } />
                    <Route path="/tecnico/*" element={
                        <PrivateRoute allowedRoles={['TECNICO']}>
                            <TecnicoRoutes />
                        </PrivateRoute>
                    } />


                    {/* Redirigir según el rol cuando se accede a la raíz */}
                    <Route path="/" element={<HomeRedirect />} />
                </Routes>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

function HomeRedirect() {
    const { user } = useAuth();

    if (user) {
        if (user.role === 'CLIENTE') {
            return <Navigate to="/cliente/shop" replace />;
        }else if (user.role === 'TECNICO') {
            return <Navigate to="/tecnico/reparaciones" replace />;

        }else {
            return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />;
        }
    }

    return <Navigate to="/login" replace />;
}

export default App;