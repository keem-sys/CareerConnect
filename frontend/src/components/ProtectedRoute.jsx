import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Senior Architecture Route Guard (RBAC)
 * @param {Array<string>} allowedRoles - Optional array of roles permitted (e.g. ['STUDENT'] or ['COMPANY', 'ADMIN'])
 * @param {React.ReactNode} children - Component to render if authorized
 */
export default function ProtectedRoute({ allowedRoles = [], children }) {
    const { user } = useAuth();
    const location = useLocation();

    // Unauthenticated Guard: Redirect to /login and preserve destination in state
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Unauthorized Role Guard: If roles are specified and user's role is not included
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
}