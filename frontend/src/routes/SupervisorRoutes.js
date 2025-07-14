import { Routes, Route } from 'react-router-dom';
import {Container, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import PanelUsuarios from "../views/Supervisor/PanelUsuarios";
import EmployeeRegisterPage from "../components/EmployeeRegisterPage";
import React from "react";
import EmployeeLoginPage from "../components/EmployeeLoginPage";
import ListaVentas from "../views/Vendedor/ListaVentas";
import ListaArriendos from "../views/Vendedor/ListaArriendos";



export default function SupervisorRoutes() {
    const { user } = useAuth();

    if (['INVENTARIO', 'VENDEDOR', 'TECNICO', 'CLIENTE'].includes(user.role)) {
        return null;
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4 , mx: '10%'}}>
            <Routes>
                <Route path="panel" element={<PanelUsuarios />} />
                <Route path="registro" element={<EmployeeRegisterPage />} />
                <Route path="ventas/resumen" element={<ListaVentas />} />
                <Route path="arriendos/list" element={<ListaArriendos />} />


            </Routes>
        </Container>
    );
}