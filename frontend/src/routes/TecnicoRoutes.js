import {useAuth} from "../context/AuthContext";
import {Container} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import PanelUsuarios from "../views/Supervisor/PanelUsuarios";
import EmployeeRegisterPage from "../components/EmployeeRegisterPage";
import ListaVentas from "../views/Vendedor/ListaVentas";
import React from "react";
import ArriendoForm from "../views/Vendedor/ArriendoForm";
import VentaForm from "../views/Vendedor/VentaForm";
import ReparacionesList from "../views/Tecnico/ReparacionesList";
import GestionarBicicletas from "../views/Inventario/GestionarBicicletas";
import GestionarComponentes from "../views/Inventario/GestionarComponentes";

export default function TecnicoRoutes() {
    const { user } = useAuth();

    if (['INVENTARIO', 'VENDEDOR', 'CLIENTE'].includes(user.role)) {
        return null;
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4 , mx: '10%'}}>
            <Routes>
                <Route path="reparaciones" element={<ReparacionesList />} />
                <Route path="recepcion" element={<GestionarBicicletas />} />
                <Route path="ingresos" element={<GestionarComponentes />} />
            </Routes>
        </Container>
    );
}