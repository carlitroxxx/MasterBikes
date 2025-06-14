import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('loggedUser'));

    useEffect(() => {
        if (!user || !user.rol) {
            navigate('/login');
            return;
        }
        switch (user.rol) {
            case 'cliente':
                navigate('/cliente/catalogo');
                break;
            case 'inventario':
                navigate('/inventario/recepcion');
                break;
            default:
                navigate('/login');
                break;
        }
    }, [navigate, user]);

    return <p>Redireccionando según rol...</p>;
}

export default Dashboard;