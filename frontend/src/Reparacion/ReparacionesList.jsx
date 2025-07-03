
import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Button } from '@mui/material';
import axios from 'axios';

const ReparacionesList = () => {
    const [reparaciones, setReparaciones] = useState([]);

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:8083/reparaciones');
            setReparaciones(res.data);
        } catch (error) {
            console.error("Error al obtener reparaciones:", error);
        }
    };

    const cambiarEstado = async (id, nuevoEstado) => {
        try {
            await axios.put(`http://localhost:8083/reparaciones/${id}`, { estado: nuevoEstado });
            fetchData();
        } catch (error) {
            console.error("Error al cambiar estado:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Hora</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {reparaciones.map((r) => (
                    <TableRow key={r.id}>
                        <TableCell>{r.fecha}</TableCell>
                        <TableCell>{r.hora}</TableCell>
                        <TableCell>{r.descripcion}</TableCell>
                        <TableCell>{r.estado}</TableCell>
                        <TableCell>
                            {r.estado !== 'finalizada' && (
                                <Button onClick={() => cambiarEstado(r.id, r.estado === 'pendiente' ? 'en proceso' : 'finalizada')}>
                                    {r.estado === 'pendiente' ? 'Iniciar' : 'Finalizar'}
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default ReparacionesList;
