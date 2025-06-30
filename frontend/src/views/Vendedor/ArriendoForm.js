import React, { useState } from 'react';
import {
  TextField, Button, MenuItem, Grid, Typography, Paper, Divider,
  Snackbar, Alert, InputAdornment, Autocomplete
} from '@mui/material';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from 'date-fns/locale/es';

// Datos de ejemplo para bicicletas
const bicicletasEjemplo = [
  { id: 1, modelo: 'Trek X-Caliber 8', tipo: 'Montaña', deposito: 150000, precioDia: 15000 },
  { id: 2, modelo: 'Specialized Sirrus X 3.0', tipo: 'Paseo', deposito: 120000, precioDia: 12000 },
  { id: 3, modelo: 'Cannondale Synapse Carbon', tipo: 'Ruta', deposito: 200000, precioDia: 20000 },
  { id: 4, modelo: 'Scott Aspect 950', tipo: 'Montaña', deposito: 130000, precioDia: 13000 },
];

const formasPago = ['Efectivo', 'Tarjeta de Crédito', 'Transferencia', 'Otro'];

const ArriendoForm = () => {
  const [form, setForm] = useState({
    clienteNombre: '',
    clienteRut: '',
    clienteEmail: '',
    clienteTelefono: '',
    bicicleta: null,
    fechaInicio: null,
    fechaFin: null,
    formaPago: '',
    deposito: '',
    precioDia: '',
    diasArriendo: 0,
    total: 0
  });

  const [alert, setAlert] = useState({ open: false, success: true, message: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'fechaInicio' || name === 'fechaFin') {
      calcularTotal();
    }
  };

  const handleBicicletaChange = (event, newValue) => {
    setForm({
      ...form,
      bicicleta: newValue,
      tipo: newValue?.tipo || '',
      deposito: newValue?.deposito || '',
      precioDia: newValue?.precioDia || '',
    });
    calcularTotal();
  };

  const calcularTotal = () => {
    if (form.fechaInicio && form.fechaFin && form.precioDia) {
      const diffTime = Math.abs(new Date(form.fechaFin) - new Date(form.fechaInicio));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const total = diffDays * parseFloat(form.precioDia || 0);
      setForm(prev => ({ ...prev, diasArriendo: diffDays, total }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.clienteNombre) newErrors.clienteNombre = 'Nombre es requerido';
    if (!form.clienteRut) newErrors.clienteRut = 'RUT es requerido';
    if (!form.bicicleta) newErrors.bicicleta = 'Bicicleta es requerida';
    if (!form.fechaInicio) newErrors.fechaInicio = 'Fecha inicio es requerida';
    if (!form.fechaFin) newErrors.fechaFin = 'Fecha fin es requerida';
    if (form.fechaFin && form.fechaInicio && new Date(form.fechaFin) < new Date(form.fechaInicio)) {
      newErrors.fechaFin = 'Fecha fin debe ser posterior a fecha inicio';
    }
    if (!form.formaPago) newErrors.formaPago = 'Forma de pago es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const dataToSend = {
        ...form,
        bicicletaId: form.bicicleta?.id
      };

      await axios.post('http://localhost:8082/arriendos', dataToSend);
      setAlert({ open: true, success: true, message: 'Arriendo registrado correctamente.' });

      // Limpiar formulario
      setForm({
        clienteNombre: '',
        clienteRut: '',
        clienteEmail: '',
        clienteTelefono: '',
        bicicleta: null,
        tipo: '',
        fechaInicio: null,
        fechaFin: null,
        formaPago: '',
        deposito: '',
        precioDia: '',
        diasArriendo: 0,
        total: 0
      });
    } catch (error) {
      setAlert({ open: true, success: false, message: 'Error al registrar arriendo: ' + (error.response?.data?.message || error.message) });
    }
  };

  return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
        <Paper elevation={3} sx={{ maxWidth: 1000, mx: 'auto', mt: 4, p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 4,
            fontSize: '1.8rem'
          }}>
            Registrar Arriendo de Bicicleta
          </Typography>

          {/* Primera fila: RUT | EMAIL | TELEFONO */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                  fullWidth
                  label="RUT"
                  name="clienteRut"
                  value={form.clienteRut}
                  onChange={handleChange}
                  error={!!errors.clienteRut}
                  helperText={errors.clienteRut}
                  size="medium"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '56px',
                      fontSize: '1.1rem'
                    }
                  }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                  fullWidth
                  label="Email"
                  name="clienteEmail"
                  value={form.clienteEmail}
                  onChange={handleChange}
                  type="email"
                  size="medium"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '56px',
                      fontSize: '1.1rem'
                    }
                  }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                  fullWidth
                  label="Teléfono"
                  name="clienteTelefono"
                  value={form.clienteTelefono}
                  onChange={handleChange}
                  size="medium"
                  sx={{
                      maxWidth: '200px',
                    '& .MuiOutlinedInput-root': {
                      height: '56px',
                      fontSize: '1.1rem'
                    }
                  }}
              />
            </Grid>
          </Grid>

          {/* Segunda fila: NOMBRE COMPLETO */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                  <TextField
                      fullWidth
                      label="Nombre Completo"
                      name="clienteNombre"
                      value={form.clienteNombre}
                      onChange={handleChange}
                      error={!!errors.clienteNombre}
                      helperText={errors.clienteNombre}
                      size="medium"
                      sx={{
                          '& .MuiOutlinedInput-root': {
                              height: '56px',
                              fontSize: '1.1rem',
                          },
                          minWidth: '516px', // Ajusta este valor según necesites
                      }}
                  />
              </Grid>
          </Grid>

          {/* Tercera fila: FECHAINICIO | FECHA FINAL | METODO DE PAGO */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <DatePicker
                  label="Fecha Inicio"
                  value={form.fechaInicio}
                  onChange={(date) => {
                    setForm({ ...form, fechaInicio: date });
                    calcularTotal();
                  }}
                  renderInput={(params) => (
                      <TextField
                          {...params}
                          fullWidth
                          error={!!errors.fechaInicio}
                          helperText={errors.fechaInicio}
                          size="medium"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: '56px',
                              fontSize: '1.1rem'
                            }
                          }}
                      />
                  )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker
                  label="Fecha Fin"
                  value={form.fechaFin}
                  onChange={(date) => {
                    setForm({ ...form, fechaFin: date });
                    calcularTotal();
                  }}
                  renderInput={(params) => (
                      <TextField
                          {...params}
                          fullWidth
                          error={!!errors.fechaFin}
                          helperText={errors.fechaFin}
                          size="medium"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: '56px',
                              fontSize: '1.1rem'
                            }
                          }}
                      />
                  )}
                  minDate={form.fechaInicio}
              />
            </Grid>
              <Grid item xs={12} md={6}>
                  <TextField
                      select
                      fullWidth
                      label="Método de Pago"
                      name="formaPago"
                      value={form.formaPago}
                      onChange={handleChange}
                      error={!!errors.formaPago}
                      helperText={errors.formaPago}
                      size="medium"
                      sx={{
                          '& .MuiOutlinedInput-root': {
                              height: '56px',
                              fontSize: '1.1rem',
                          },
                          minWidth: '200px', // Ajusta este valor
                      }}
                  >
                      {formasPago.map((forma) => (
                          <MenuItem key={forma} value={forma}>{forma}</MenuItem>
                      ))}
                  </TextField>
              </Grid>
          </Grid>

          {/* Cuarta fila: BICICLETA | DEPOSITO GARANTIA | PRECIO DIA */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={5}>
                  <Autocomplete
                      options={bicicletasEjemplo}
                      getOptionLabel={(option) => `${option.modelo} (${option.tipo})`}
                      value={form.bicicleta}
                      onChange={handleBicicletaChange}
                      sx={{
                          minWidth: '516px', // Ajusta este valor
                      }}
                      renderInput={(params) => (
                          <TextField
                              {...params}
                              label="Bicicleta"
                              error={!!errors.bicicleta}
                              helperText={errors.bicicleta}
                              size="medium"
                              sx={{
                                  '& .MuiOutlinedInput-root': {
                                      height: '56px',
                                      fontSize: '1.1rem',
                                  },
                              }}
                          />
                      )}
                  />
              </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                  fullWidth
                  label="Depósito Garantía ($)"
                  name="deposito"
                  value={form.deposito ? `$${form.deposito.toLocaleString('es-CL')}` : ''}
                  InputProps={{
                    readOnly: true,
                  }}
                  size="medium"
                  sx={{
                    maxWidth: '200px',
                    '& .MuiOutlinedInput-root': {
                      height: '56px',
                      fontSize: '1.1rem',
                      backgroundColor: 'action.hover'
                    }
                  }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                  fullWidth
                  label="Precio por día ($)"
                  name="precioDia"
                  value={form.precioDia ? `$${form.precioDia.toLocaleString('es-CL')}` : ''}
                  InputProps={{
                    readOnly: true,
                  }}
                  size="medium"
                  sx={{
                      maxWidth: '200px',

                    '& .MuiOutlinedInput-root': {
                      height: '56px',
                      fontSize: '1.1rem',
                      backgroundColor: 'action.hover'
                    }
                  }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Resumen */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                <strong>Días de arriendo:</strong> {form.diasArriendo}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{
                textAlign: 'right',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'primary.main'
              }}>
                <strong>Total a pagar:</strong> ${form.total.toLocaleString('es-CL')}
              </Typography>
            </Grid>
          </Grid>

          <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSubmit}
              sx={{
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                letterSpacing: '0.5px'
              }}
          >
            Registrar Arriendo
          </Button>

          <Snackbar
              open={alert.open}
              autoHideDuration={6000}
              onClose={() => setAlert({ ...alert, open: false })}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
                severity={alert.success ? 'success' : 'error'}
                sx={{ width: '100%', fontSize: '1.1rem' }}
                onClose={() => setAlert({ ...alert, open: false })}
            >
              {alert.message}
            </Alert>
          </Snackbar>
        </Paper>
      </LocalizationProvider>
  );
};

export default ArriendoForm;