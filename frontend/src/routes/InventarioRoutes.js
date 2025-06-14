import { Routes, Route, Link } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import IngresarProductos from '../views/Inventario/IngresarProductos';
import GestionarProductos from "../views/Inventario/GestionarProductos";

function InventarioNav() {
    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Button component={Link} to="/inventario/recepcion" variant="contained">Ingresar Orden</Button>
            <Button component={Link} to="/inventario/ingresos" variant="contained">Productos</Button>
        </Box>
    );
}

export default function InventarioRoutes() {
    return (
        <Container maxWidth="xl" sx={{ mt: 4 , mx: '10%'}}>
            <Typography variant="h4" gutterBottom>Panel de Inventario</Typography>
            <InventarioNav />
            <Routes>
                <Route path="recepcion" element={<IngresarProductos />} />
                <Route path="ingresos" element={<GestionarProductos />} />
            </Routes>
        </Container>
    );
}
