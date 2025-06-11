// src/components/VentaList.js
import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import axios from 'axios';

export default function VentaList() {
    const [ventas, setVentas] = useState([]);

    const cargarVentas = async () => {
        const res = await axios.get('http://localhost:8081/api/ventas');
        setVentas(res.data);
    };

    useEffect(() => {
        cargarVentas();
    }, []);

    return (
        <>
            <Typography variant="h6" gutterBottom>Listado de Ventas</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Producto</TableCell>
                        <TableCell>Cantidad</TableCell>
                        <TableCell>Precio Total</TableCell>
                        <TableCell>Fecha</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ventas.map((v, i) => (
                        <TableRow key={i}>
                            <TableCell>{v.producto}</TableCell>
                            <TableCell>{v.cantidad}</TableCell>
                            <TableCell>${v.precioTotal}</TableCell>
                            <TableCell>{v.fechaVenta}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
