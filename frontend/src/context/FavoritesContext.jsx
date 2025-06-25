// src/context/FavoritesContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext.jsx';
import { toast } from 'react-toastify';

// Crea el contexto de favoritos.
const FavoritesContext = createContext();

// Hook personalizado para consumir el contexto de favoritos.
export const useFavorites = () => {
    return useContext(FavoritesContext);
};

// Proveedor del contexto de favoritos.
export const FavoritesProvider = ({ children }) => {
    // Obtiene el estado de autenticación.
    const { isLoggedIn, token } = useAuth();
    // Estados para los favoritos, carga y errores.
    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    // Helper para verificar si una variante de producto es favorita.
    const isProductVariantFavorite = useCallback((productId, sizeId = null, colorName = null) => {
        const normalizedSizeId = sizeId ? parseInt(sizeId) : null;
        const normalizedColorName = (colorName === 'Único' || colorName === undefined || colorName === '') ? null : colorName;

        return favorites.some(fav => {
            const favNormalizedSizeId = fav.Id_Talla ? parseInt(fav.Id_Talla) : null;
            const favNormalizedColorNameFromFav = (fav.Color_Seleccionado === 'Único' || fav.Color_Seleccionado === undefined || fav.Color_Seleccionado === '') ? null : fav.Color_Seleccionado;

            return fav.Id_Producto === productId &&
                   favNormalizedSizeId === normalizedSizeId &&
                   favNormalizedColorNameFromFav === normalizedColorName;
        });
    }, [favorites]);

    // Función para cargar los favoritos del usuario desde la API.
    const fetchFavorites = useCallback(async () => {
        if (!isLoggedIn || !token) {
            setFavorites([]); setLoadingFavorites(false);
            return;
        }

        setLoadingFavorites(true); setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/favoritos`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                if (response.status === 404) { setFavorites([]); return; }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al cargar favoritos');
            }

            const result = await response.json();
            setFavorites(Array.isArray(result.favoritos) ? result.favoritos : []);
        } catch (err) {
            console.error("Error al cargar favoritos:", err);
            setError(err.message || "No se pudieron cargar los favoritos.");
            setFavorites([]);
        } finally {
            setLoadingFavorites(false);
        }
    }, [isLoggedIn, token, API_BASE_URL]);

    // Efecto para cargar favoritos al inicio o al cambiar el estado de autenticación.
    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    // Función para añadir o eliminar una variante de producto de favoritos.
    const toggleFavorite = useCallback(async (productId, sizeId = null, colorName = null) => {
        if (!isLoggedIn || !token) {
            toast.error("Debes iniciar sesión para gestionar tus favoritos.");
            return false;
        }

        const normalizedSizeId = sizeId ? parseInt(sizeId) : null;
        const normalizedColorName = (colorName === 'Único' || colorName === undefined || colorName === '') ? null : colorName;
        const isCurrentlyFavorite = isProductVariantFavorite(productId, normalizedSizeId, normalizedColorName);

        try {
            let response;
            const bodyData = { productId, sizeId: normalizedSizeId, colorName: normalizedColorName };

            if (isCurrentlyFavorite) {
                response = await fetch(`${API_BASE_URL}/api/favoritos/remove`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(bodyData),
                });
            } else {
                response = await fetch(`${API_BASE_URL}/api/favoritos/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(bodyData),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error al ${isCurrentlyFavorite ? 'eliminar' : 'añadir'} de favoritos`);
            }

            const result = await response.json();
            await fetchFavorites(); // Re-fetch para mantener el estado sincronizado.

            if (isCurrentlyFavorite) { toast.success('Producto quitado de favoritos.'); }
            else { toast.success(result.message || 'Producto añadido a favoritos.'); }
            
            return true;
        } catch (err) {
            console.error("Error al actualizar favoritos:", err);
            toast.error(err.message || "Hubo un error al actualizar tus favoritos.");
            return false;
        }
    }, [isLoggedIn, token, API_BASE_URL, isProductVariantFavorite, fetchFavorites]);

    // Valores exportados por el contexto.
    const value = {
        favorites, loadingFavorites, error,
        toggleFavorite, fetchFavorites, isProductVariantFavorite
    };

    // Provee el contexto de favoritos a los componentes hijos.
    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};