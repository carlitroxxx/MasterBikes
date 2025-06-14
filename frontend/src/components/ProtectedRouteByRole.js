import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRouteByRole = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem('loggedUser'));
    if (!user || !allowedRoles.includes(user.rol)) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default ProtectedRouteByRole;