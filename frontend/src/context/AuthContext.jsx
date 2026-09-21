import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Read initial user state from localStorage
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Login function: updates state and localStorage
    const login = (userData) => {
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setUser(userData);
    };

    // Logout function: clears state and localStorage
    const logout = () => {
        localStorage.removeItem('currentUser');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to access auth state anywhere
export const useAuth = () => useContext(AuthContext);