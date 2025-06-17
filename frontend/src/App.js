
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ArriendosPage from './pages/ArriendosPage';
import ReparacionesPage from './pages/ReparacionesPage';

function App() {
    return (
        <Router>
            <nav style={{ display: 'flex', gap: '20px', padding: '10px', background: '#eee' }}>
                <Link to="/arriendos">Arriendos</Link>
                <Link to="/reparaciones">Reparaciones</Link>
            </nav>

            <Routes>
                <Route path="/arriendos" element={<ArriendosPage />} />
                <Route path="/reparaciones" element={<ReparacionesPage />} />
                <Route path="*" element={<div style={{ padding: 20 }}><h3>Selecciona una opción del menú</h3></div>} />
            </Routes>
        </Router>
    );
}

export default App;
