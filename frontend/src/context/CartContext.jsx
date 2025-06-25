// src/context/CartContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

// Crea el contexto del carrito.
const CartContext = createContext();

// Hook personalizado para usar el contexto del carrito.
export const useCart = () => {
    return useContext(CartContext);
};

// URL base de la API.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Proveedor del carrito para gestionar los ítems y lógica del carrito.
export const CartProvider = ({ children }) => {
    // Obtiene el estado de autenticación del usuario.
    const { isAuthenticated, user, token } = useAuth();
    // Estados para los ítems, total, carga y errores del carrito.
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Instancia de Axios configurada con la URL base y el token de autorización.
    const axiosInstance = useMemo(() => {
        const instance = axios.create({
            baseURL: API_BASE_URL,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
        instance.interceptors.request.use(
            (config) => {
                if (token) config.headers.Authorization = `Bearer ${token}`;
                return config;
            },
            (err) => Promise.reject(err)
        );
        return instance;
    }, [token]);

    // Función para obtener los ítems del carrito desde la API.
    const fetchCart = useCallback(async () => {
        if (!isAuthenticated || !user?.id) {
            setCartItems([]); setCartTotal(0); setLoading(false);
            return;
        }
        setLoading(true); setError(null);
        try {
            const response = await axiosInstance.get('/api/carrito');
            const fetchedItems = response.data.items || [];
            const mappedItems = fetchedItems.map(item => ({
                Id_Producto: item.Id_Producto,
                nombre_producto: item.Nombre_Producto,
                imagen_url: item.Imagen_URL_Producto,
                precio_unitario: parseFloat(item.Precio_Unitario_Carrito),
                cantidad: item.Cantidad,
                Subtotal: parseFloat(item.Subtotal),
                Color_Seleccionado: item.Color_Seleccionado,
                Id_Talla: item.Id_Talla,
                Nombre_Talla: item.Nombre_Talla,
                stock: parseFloat(item.stock) || 0,
            }));
            setCartItems(mappedItems);
            setCartTotal(parseFloat(response.data.total) || 0);
        } catch (err) {
            console.error('Error fetching cart:', err);
            setError(err.response?.data?.message || 'No se pudo cargar el carrito.');
            setCartItems([]); setCartTotal(0);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user?.id, axiosInstance]);

    // Efecto para cargar el carrito cuando cambia la autenticación o la instancia de fetchCart.
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Calcula el número total de ítems en el carrito.
    const getTotalItems = useCallback(() => {
        return cartItems.reduce((total, item) => total + (item.cantidad || 0), 0);
    }, [cartItems]);

    // Función para añadir un producto al carrito.
    const addCartItem = useCallback(async ({ productId, quantity, selectedSizeId, selectedColor }) => {
        if (!isAuthenticated) return { success: false, message: 'Debes iniciar sesión para añadir productos.' };
        setLoading(true); setError(null);
        try {
            const response = await axiosInstance.post('/api/carrito/items', { productId, quantity, selectedSizeId, selectedColor });
            toast.success(response.data.message || 'Producto añadido al carrito.');
            await fetchCart();
            return { success: response.data.success, message: response.data.message, newQuantity: response.data.newQuantity };
        } catch (err) {
            console.error('Error adding cart item:', err);
            const errorMessage = err.response?.data?.message || 'Error al añadir el producto.';
            setError(errorMessage); toast.error(errorMessage);
            return { success: false, message: errorMessage };
        } finally { setLoading(false); }
    }, [isAuthenticated, axiosInstance, fetchCart]);

    // Función para actualizar la cantidad de un ítem en el carrito.
    const updateCartItemQuantity = useCallback(async ({ productId, newQuantity, selectedSizeId, selectedColor }) => {
        if (!isAuthenticated) return { success: false, message: 'Debes iniciar sesión para actualizar.' };
        setLoading(true); setError(null);
        try {
            const response = await axiosInstance.put('/api/carrito/items', { productId, newQuantity, selectedSizeId, selectedColor });
            toast.success(response.data.message || 'Cantidad actualizada.');
            await fetchCart();
            return { success: response.data.success, message: response.data.message, newQuantity: response.data.newQuantity };
        } catch (err) {
            console.error('Error updating cart item quantity:', err);
            const errorMessage = err.response?.data?.message || 'Error al actualizar la cantidad.';
            setError(errorMessage); toast.error(errorMessage);
            return { success: false, message: errorMessage };
        } finally { setLoading(false); }
    }, [isAuthenticated, axiosInstance, fetchCart]);

    // Función para eliminar un ítem del carrito.
    const removeCartItem = useCallback(async ({ productId, selectedSizeId, selectedColor }) => {
        if (!isAuthenticated) return { success: false, message: 'Debes iniciar sesión para eliminar productos.' };
        setLoading(true); setError(null);
        try {
            const response = await axiosInstance.delete('/api/carrito/items', { data: { productId, selectedSizeId, selectedColor } });
            toast.success(response.data.message || 'Producto eliminado del carrito.');
            await fetchCart();
            return { success: response.data.success, message: response.data.message };
        } catch (err) {
            console.error('Error removing cart item:', err);
            const errorMessage = err.response?.data?.message || 'Error al eliminar el producto.';
            setError(errorMessage); toast.error(errorMessage);
            return { success: false, message: errorMessage };
        } finally { setLoading(false); }
    }, [isAuthenticated, axiosInstance, fetchCart]);

    // Función para vaciar completamente el carrito.
    const clearCart = useCallback(async () => {
        if (!isAuthenticated) return { success: false, message: 'Debes iniciar sesión para vaciar el carrito.' };
        setLoading(true); setError(null);
        try {
            const response = await axiosInstance.delete('/api/carrito/clear');
            toast.success(response.data.message || 'Carrito vaciado correctamente.');
            await fetchCart();
            return { success: response.data.success, message: response.data.message };
        } catch (err) {
            console.error('Error clearing cart:', err);
            const errorMessage = err.response?.data?.message || 'Error al vaciar el carrito.';
            setError(errorMessage); toast.error(errorMessage);
            return { success: false, message: errorMessage };
        } finally { setLoading(false); }
    }, [isAuthenticated, axiosInstance, fetchCart]);

    // Valores proporcionados por el contexto del carrito.
    const cartContextValue = useMemo(() => ({
        cartItems, cartTotal, loading, error,
        addCartItem, updateItemQuantity: updateCartItemQuantity,
        removeItem: removeCartItem, clearCart,
        fetchCart, getTotalItems
    }), [cartItems, cartTotal, loading, error, addCartItem, updateCartItemQuantity, removeCartItem, clearCart, fetchCart, getTotalItems]);

    // Provee el contexto del carrito a los componentes hijos.
    return (
        <CartContext.Provider value={cartContextValue}>
            {children}
        </CartContext.Provider>
    );
};