import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Box,
    Autocomplete,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Grid,
    Divider,
    Alert,
    Snackbar,
    Chip,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Add as AddIcon,
    Save as SaveIcon,
    LocalShipping as SupplierIcon,
    Inventory as ProductIcon,
    Checklist as ListIcon
} from '@mui/icons-material';

const productosDisponibles = [
    'Cadena', 'Neumático', 'Pedal', 'Marco', 'Silla', 'Manubrio', 'Freno'
];

export default function IngresarProductos() {
    const [form, setForm] = useState({ proveedor: '', items: [] });
    const [item, setItem] = useState({ producto: '', cantidadEsperada: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddItem = () => {
        if (!item.producto) {
            setError('Seleccione un producto');
            return;
        }
        if (!item.cantidadEsperada || isNaN(item.cantidadEsperada)) {
            setError('Ingrese una cantidad válida');
            return;
        }
        if (Number(item.cantidadEsperada) <= 0) {
            setError('La cantidad debe ser mayor a cero');
            return;
        }

        setForm(prev => ({ ...prev, items: [...prev.items, item] }));
        setItem({ producto: '', cantidadEsperada: '' });
        setError('');
    };

    const handleDeleteItem = (index) => {
        setForm(prev => {
            const newItems = [...prev.items];
            newItems.splice(index, 1);
            return { ...prev, items: newItems };
        });
    };

    const handleSubmit = async () => {
        if (!form.proveedor.trim()) {
            setError('Ingrese el nombre del proveedor');
            return;
        }
        if (form.items.length === 0) {
            setError('Agregue al menos un producto');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:8082/inventario/recepciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!response.ok) throw new Error('Error en el servidor');

            setSuccess(true);
            setForm({ proveedor: '', items: [] });
            setError('');
        } catch (err) {
            setError(err.message || 'Error al guardar');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSnackbar = () => setSuccess(false);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Recepción de Inventario
            </Typography>

            <Grid container spacing={4} >
                {/* Columna izquierda - Formulario */}
                <Grid item
                      xs={12}  // Pantallas muy pequeñas: ocupa 12/12 (100%)
                      sm={12}  // Tablets pequeñas: ocupa 12/12 (100%)
                      md={8}   // Tablets grandes: ocupa 8/12 (66.66%)
                      lg={7}   // Laptops: ocupa 7/12 (58.33%)
                      xl={6}   // Pantallas grandes: ocupa 6/12 (50%)
                      sx={{
                          minWidth: {
                              md: '500px'
                              // Ancho mínimo para el formulario
                          },
                          width:{
                              xl: '60%'
                          }
                      }}
                >
                    <Paper elevation={2} sx={{ p: 3, height: '100%' , minWidth: {xs: '350px',sm: '460px'}}}>
                        <FormControlLabel
                            control={<Checkbox checked />}
                            label={
                                <Typography variant="h6" component="h2">
                                    Datos del Proveedor
                                </Typography>
                            }
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            label="Nombre del proveedor *"
                            fullWidth
                            variant="outlined"
                            value={form.proveedor}
                            onChange={e => setForm({ ...form, proveedor: e.target.value })}
                            sx={{ mb: 3 }}
                        />

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <FormControlLabel
                                control={<Checkbox checked />}
                                label={
                                    <Typography variant="h6" component="h2">
                                        Productos a Ingresar
                                    </Typography>
                                }
                            />
                            <Chip
                                label={`${form.items.length} items`}
                                color="primary"
                                size="small"
                                sx={{ ml: 1 }}
                            />
                        </Box>

                        <Box
                            component="form"
                            onSubmit={(e) => { e.preventDefault(); handleAddItem(); }}
                            sx={{ display: 'flex', gap: 2, mb: 3 }}
                        >
                            <Autocomplete
                                options={productosDisponibles}
                                value={item.producto}
                                onChange={(e, newValue) => setItem({ ...item, producto: newValue })}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Buscar producto *"
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            width:{
                                                lg:'200px',
                                                xl:'250px'
                                            }
                                    }}
                                    />
                                )}
                            />

                            <TextField
                                label="Cantidad *"
                                type="number"
                                variant="outlined"
                                value={item.cantidadEsperada}
                                onChange={e => setItem({ ...item, cantidadEsperada: e.target.value })}
                                inputProps={{ min: 1 }}
                                sx={{ width: 120 }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<AddIcon />}
                                sx={{ height: 56 }}
                            >
                                Agregar
                            </Button>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleSubmit}
                                startIcon={<SaveIcon />}
                                disabled={isSubmitting || form.items.length === 0}
                            >
                                {isSubmitting ? 'Procesando...' : 'Guardar Recepción'}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Columna derecha - Lista de productos */}
                <Grid item
                      xs={12}  // Pantallas muy pequeñas: ocupa 12/12 (100%)
                      sm={12}  // Tablets pequeñas: ocupa 12/12 (100%)
                      md={4}   // Tablets grandes: ocupa 4/12 (33.33%)
                      lg={5}   // Laptops: ocupa 5/12 (41.66%)
                      xl={6}   // Pantallas grandes: ocupa 6/12 (50%)
                      sx={{

                          width:{
                          xl: '30%'
                          },
                          mt: {
                              xs: 0,       // Sin margen superior en móviles (ya hay spacing del Grid)
                              sm: 0,
                              md: 0
                          }
                      }}
                >
                    <Paper elevation={2} sx={{ p: 3, height: '100%', minWidth: {xs: '350px',sm: '460px'}}}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Productos Agregados
                        </Typography>

                        {form.items.length > 0 ? (
                            <Box sx={{
                                maxHeight: 500,
                                overflowY: 'auto',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1
                            }}>
                                <List dense>
                                    {form.items.map((i, idx) => (
                                        <ListItem
                                            key={idx}
                                            secondaryAction={
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => handleDeleteItem(idx)}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                            divider={idx < form.items.length - 1}
                                        >
                                            <ListItemText
                                                primary={i.producto}
                                                secondary={`Cantidad: ${i.cantidadEsperada}`}
                                                sx={{ pr: 4 }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        ) : (
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 200,
                                border: '1px dashed',
                                borderColor: 'divider',
                                borderRadius: 1
                            }}>
                                <Typography color="text.secondary">
                                    No hay productos agregados
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar
                open={success}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    Recepción registrada exitosamente!
                </Alert>
            </Snackbar>
        </Container>
    );
}