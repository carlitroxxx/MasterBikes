// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClienteRoutes from './routes/ClienteRoutes';
import Navbar from './components/Navbar';
import InventarioRoutes from "./routes/InventarioRoutes";

function App() {
    return (
        <Router>
            <Navbar /> {/* ✅ Navbar arriba de todo */}
            <Routes>
                <Route path="/cliente/*" element={
                    <ClienteRoutes />
                } />
                <Route path="/inventario/*" element={
                <InventarioRoutes />
                } />
            </Routes>
        </Router>
    );
}

export default App;
