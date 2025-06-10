import { Routes, Route } from 'react-router-dom';
import Catalogo from '../views/Cliente/Catalogo';
import Carrito from '../views/Cliente/Carrito';
import GestionCuenta from '../views/Cliente/GestionCuenta';
import HistorialArriendos from '../views/Cliente/HistorialArriendos';
import HistorialCompras from '../views/Cliente/HistorialCompras';
import HistorialReparaciones from '../views/Cliente/HistorialReparaciones';
import Reparaciones from '../views/Cliente/Reparaciones';

export default function ClienteRoutes() {
    return (
        <Routes>
            <Route path="catalogo" element={<Catalogo />} />
            <Route path="carrito" element={<Carrito />} />
            <Route path="cuenta" element={<GestionCuenta />} />
            <Route path="arriendos" element={<HistorialArriendos />} />
            <Route path="compras" element={<HistorialCompras />} />
            <Route path="reparaciones" element={<HistorialReparaciones />} />
            <Route path="solicitar-reparacion" element={<Reparaciones />} />
        </Routes>
    );
}
