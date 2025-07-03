
import React, { useState } from 'react';
import {
  TextField, Button, MenuItem, Grid, Typography, Box, Snackbar, Alert
} from '@mui/material';
import axios from 'axios';

const tiposBicicleta = ['Montaña', 'Paseo', 'Ruta', 'Eléctrica'];

const ArriendoForm = () => {
  const [form, setForm] = useState({
    tipo: '',
    fechaInicio: '',
    fechaFin: '',
    formaPago: '',
    deposito: ''
  });
  const [alert, setAlert] = useState({ open: false, success: true, message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:8082/arriendos', form);
      setAlert({ open: true, success: true, message: 'Arriendo solicitado correctamente.' });
    } catch (error) {
      setAlert({ open: true, success: false, message: 'Error al solicitar arriendo.' });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Solicitar Arriendo</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField select fullWidth label="Tipo de Bicicleta" name="tipo" value={form.tipo} onChange={handleChange}>
            {tiposBicicleta.map((tipo) => (
              <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth type="date" name="fechaInicio" label="Fecha Inicio" InputLabelProps={{ shrink: true }} value={form.fechaInicio} onChange={handleChange} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth type="date" name="fechaFin" label="Fecha Fin" InputLabelProps={{ shrink: true }} value={form.fechaFin} onChange={handleChange} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth name="formaPago" label="Forma de Pago" value={form.formaPago} onChange={handleChange} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth name="deposito" label="Depósito (si aplica)" value={form.deposito} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={handleSubmit}>Solicitar Arriendo</Button>
        </Grid>
      </Grid>
      <Snackbar open={alert.open} autoHideDuration={4000} onClose={() => setAlert({ ...alert, open: false })}>
        <Alert severity={alert.success ? 'success' : 'error'} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ArriendoForm;
