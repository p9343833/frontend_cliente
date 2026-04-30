import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('accessToken'); // Verifica si hay un token en localStorage

    return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;