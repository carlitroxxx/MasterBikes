import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Paper } from '@mui/material';
import axios from 'axios';

export default function ReporteVentas() {
    const [reportes, setReportes] = useState([]);

    useEffect(() => {
        const obtenerReporte = async () => {
            try {
                const res = await axios.get('http://localhost:8082/api/reportes/ventas');
                setReportes(res.data);
            } catch (error) {
                console.error('Error al cargar el reporte:', error);
            }
        };

        obtenerReporte();
    }, []);

    return (
        <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Reporte de Ventas por Producto
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Producto</strong></TableCell>
                        <TableCell><strong>Total Ventas</strong></TableCell>
                        <TableCell><strong>Total Ingresos ($)</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reportes.map((r, i) => (
                        <TableRow key={i}>
                            <TableCell>{r._id}</TableCell>
                            <TableCell>{r.totalVentas}</TableCell>
                            <TableCell>{r.totalIngresos}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
