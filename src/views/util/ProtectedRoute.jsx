import React from 'react';
import { Navigate } from "react-router-dom";
import { isUserLoggedIn } from './AuthenticationService';

export const ProtectedRoute = ({ children }) => {
    if (!isUserLoggedIn()) {
        // user is not authenticated
        return <Navigate to="/" />;
    }
    return children;
};