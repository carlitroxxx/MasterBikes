import {useAuth} from "../context/AuthContext";
import {Container} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import PanelUsuarios from "../views/Supervisor/PanelUsuarios";
import EmployeeRegisterPage from "../components/EmployeeRegisterPage";
import ListaVentas from "../views/Vendedor/ListaVentas";
import React from "react";
import ArriendoForm from "../views/Vendedor/ArriendoForm";
import VentaForm from "../views/Vendedor/VentaForm";
import GestionarBicicletas from "../views/Inventario/GestionarBicicletas";
import GestionarComponentes from "../views/Inventario/GestionarComponentes";

export default function VendedorRoutes() {
    const { user } = useAuth();

    if (['INVENTARIO', 'TECNICO', 'CLIENTE'].includes(user.role)) {
        return null;
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4 , mx: '10%'}}>
            <Routes>
                <Route path="arriendo" element={<ArriendoForm/>} />
                <Route path="ventas" element={<VentaForm />} />
                <Route path="ventas/resumen" element={<ListaVentas />} />
                <Route path="recepcion" element={<GestionarBicicletas />} />
                <Route path="ingresos" element={<GestionarComponentes />} />
            </Routes>
        </Container>
    );
}