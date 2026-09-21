import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Restricts access to unauthenticated users only (e.g., Login, Signup)
 */
export default function PublicOnlyRoute({ children }) {
    const { user } = useAuth();

    // If already logged in, redirect them to the home dashboard
    if (user) {
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
}