// src/App.js
import React, { useState } from 'react';
import VentaForm from './ventas-service/VentaForm';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ListaVentas from "./ventas-service/ListaVentas";

function App() {

    return (
        <Router>
            <Routes>
                <Route path= "/venta" element={<VentaForm/>}/>
                <Route path= "/lista-ventas" element={<ListaVentas/>}/>
            </Routes>
        </Router>

    );
}

export default App;



