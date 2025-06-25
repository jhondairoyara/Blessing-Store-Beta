// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Crea el contexto de autenticación.
export const AuthContext = createContext(null);

// Proveedor de autenticación para gestionar el estado de usuario y token.
export const AuthProvider = ({ children }) => {
    // Estados para la sesión del usuario.
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [token, setToken] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    // Función para cerrar la sesión del usuario.
    const logout = useCallback(async () => {
        try {
            await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error("AuthContext: Error al cerrar sesión en el backend:", error);
        } finally {
            setIsLoggedIn(false);
            setUserData(null);
            setToken(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [API_BASE_URL, token, navigate]);

    // Función para actualizar los datos del usuario en el contexto.
    const updateUserContext = useCallback((newUserData) => {
        const userToSet = newUserData.Id_Usuario ? { ...newUserData, id: newUserData.Id_Usuario } : newUserData;
        setUserData(userToSet);
        localStorage.setItem('user', JSON.stringify(userToSet));
    }, []);

    // Efecto para verificar el estado de autenticación al cargar el componente.
    useEffect(() => {
        const checkAuthStatus = async () => {
            setAuthLoading(true);
            try {
                const storedToken = localStorage.getItem('token');
                const storedUserString = localStorage.getItem('user');

                if (storedToken && storedUserString) {
                    let storedUser = null;
                    try { storedUser = JSON.parse(storedUserString); } catch (e) {
                        console.error("AuthContext: Error al parsear usuario de localStorage:", e);
                        localStorage.removeItem('user'); storedUser = null;
                    }

                    if (storedUser) {
                        const response = await fetch(`${API_BASE_URL}/api/usuarios/profile`, {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${storedToken}` }
                        });

                        if (response.ok) {
                            const data = await response.json();
                            setIsLoggedIn(true);
                            const userWithMappedId = { ...data, id: data.Id_Usuario };
                            setUserData(userWithMappedId);
                            setToken(storedToken);
                        } else {
                            logout();
                        }
                    } else { logout(); }
                } else {
                    setIsLoggedIn(false); setUserData(null); setToken(null);
                    localStorage.removeItem('user'); localStorage.removeItem('token');
                }
            } catch (error) {
                console.error("AuthContext: Error al verificar autenticación:", error);
                setIsLoggedIn(false); setUserData(null); setToken(null);
                localStorage.removeItem('user'); localStorage.removeItem('token');
            } finally {
                setAuthLoading(false);
            }
        };
        checkAuthStatus();
    }, [API_BASE_URL, logout]);

    // Función para iniciar la sesión del usuario.
    const login = (authResponse) => {
        if (authResponse && authResponse.user && authResponse.token) {
            setIsLoggedIn(true);
            const userWithMappedId = { ...authResponse.user, id: authResponse.user.Id_Usuario };
            setUserData(userWithMappedId);
            setToken(authResponse.token);
            localStorage.setItem('user', JSON.stringify(userWithMappedId));
            localStorage.setItem('token', authResponse.token);
            navigate('/');
        } else {
            console.error("AuthContext: Datos de autenticación inválidos:", authResponse);
            setIsLoggedIn(false); setUserData(null); setToken(null);
        }
    };

    // Valores proporcionados por el contexto de autenticación.
    const authContextValue = {
        isLoggedIn, isAuthenticated: isLoggedIn,
        user: userData, token, login, logout,
        authLoading, updateUserContext,
    };

    // Muestra un mensaje de carga mientras se autentica.
    if (authLoading) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em' }}>Cargando autenticación...</div>;
    }

    // Provee el contexto a los componentes hijos.
    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para consumir el contexto de autenticación.
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};