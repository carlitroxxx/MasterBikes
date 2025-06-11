// src/components/VentaForm.js
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';

export default function VentaForm({ onVentaCreada }) {
    const [venta, setVenta] = useState({
        producto: '',
        cantidad: '',
        precioTotal: '',
        fechaVenta: '',
    });

    const handleChange = (e) => {
        setVenta({ ...venta, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:8081/api/ventas', venta);
        onVentaCreada(); // para recargar la lista
        setVenta({ producto: '', cantidad: '', precioTotal: '', fechaVenta: '' });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <TextField name="producto" label="Producto" fullWidth margin="normal" value={venta.producto} onChange={handleChange} required />
            <TextField name="cantidad" label="Cantidad" type="number" fullWidth margin="normal" value={venta.cantidad} onChange={handleChange} required />
            <TextField name="precioTotal" label="Precio Total" type="number" fullWidth margin="normal" value={venta.precioTotal} onChange={handleChange} required />
            <TextField name="fechaVenta" label="Fecha de Venta" type="date" fullWidth margin="normal" value={venta.fechaVenta} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
            <Button variant="contained" color="primary" type="submit">Registrar Venta</Button>
        </Box>
    );
}
