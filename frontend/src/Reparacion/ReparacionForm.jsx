
import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const ReparacionForm = () => {
    const [form, setForm] = useState({
        fecha: '',
        hora: '',
        descripcion: ''
    });
    const [alert, setAlert] = useState({ open: false, success: true, message: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:8083/reparaciones', form);
            setAlert({ open: true, success: true, message: 'Reparación solicitada correctamente.' });
        } catch (error) {
            setAlert({ open: true, success: false, message: 'Error al solicitar reparación.' });
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h6">Formulario de Reparación</Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField fullWidth type="date" name="fecha" label="Fecha" InputLabelProps={{ shrink: true }} value={form.fecha} onChange={handleChange} />
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth type="time" name="hora" label="Hora" InputLabelProps={{ shrink: true }} value={form.hora} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth multiline rows={4} name="descripcion" label="Descripción del problema" value={form.descripcion} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" fullWidth onClick={handleSubmit}>Solicitar Reparación</Button>
                </Grid>
            </Grid>
            <Snackbar open={alert.open} autoHideDuration={4000} onClose={() => setAlert({ ...alert, open: false })}>
                <Alert severity={alert.success ? 'success' : 'error'}>{alert.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default ReparacionForm;
