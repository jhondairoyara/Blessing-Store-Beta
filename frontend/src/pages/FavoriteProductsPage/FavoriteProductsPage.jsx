// src/pages/FavoriteProductsPage/FavoriteProductsPage.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import FavoriteItem from '../../components/FavoriteItem/FavoriteItem';
import { toast } from 'react-toastify';

import './FavoriteProductsPage.css';

// Página que muestra la lista de productos favoritos del usuario.
function FavoriteProductsPage() {
    const { isLoggedIn } = useAuth();
    const { addCartItem } = useCart();
    const navigate = useNavigate();

    const {
        favorites,
        loadingFavorites, 
        error,
        toggleFavorite
    } = useFavorites();

    // Añade un producto (variante) al carrito desde la lista de favoritos.
    const handleAddToCartFromFavorite = async (item) => {
        const { Id_Producto, Id_Talla, Color_Seleccionado, nombre_producto, Nombre_Talla, stock } = item;

        // Muestra advertencia si el producto está agotado.
        if (stock === 0) {
            toast.warn(`"${nombre_producto}${Nombre_Talla ? ` (${Nombre_Talla})` : ''}" está agotado.`);
            return;
        }
        
        try {
            const result = await addCartItem({
                productId: Id_Producto,
                quantity: 1,
                selectedSizeId: Id_Talla,
                selectedColor: Color_Seleccionado,
            });
            // Muestra mensaje de éxito o error al añadir al carrito.
            if (result.success) {
                toast.success(`"${nombre_producto}${Nombre_Talla ? ` (${Nombre_Talla})` : ''}" añadido al carrito.`);
            }
        } catch (err) {
            console.error("Error al añadir al carrito desde favoritos:", err);
            toast.error("Ocurrió un error al añadir al carrito desde favoritos.");
        }
    };

    // Muestra mensaje si el usuario no ha iniciado sesión.
    if (!isLoggedIn) {
        return (
            <main className="favorites-page-container">
                <h1 className="favorites-title">Productos Favoritos</h1>
                <div className="no-favorites-message">
                    <p>Debes iniciar sesión para ver tus productos favoritos.</p>
                    <Link to="/login" className="primary-action-button">Iniciar Sesión</Link>
                </div>
            </main>
        );
    }

    // Muestra mensaje de error si falla la carga de favoritos.
    if (error) {
        return (
            <main className="favorites-page-container">
                <h1 className="favorites-title">Error al cargar favoritos</h1>
                <p className="error-message">{error}</p>
            </main>
        );
    }

    // Renderiza la lista de favoritos o un mensaje si está vacía.
    return (
        <main className="favorites-page-container">
            <h1 className="favorites-title">Tus productos favoritos</h1>
            {favorites.length === 0 ? (
                <div className="no-favorites-message">
                    <p>No tienes productos favoritos aún. ¡Explora nuestros productos y añade los que más te gusten!</p>
                    <Link to="/" className="primary-action-button">Explorar productos</Link>
                </div>
            ) : (
                <div className="favorite-items-grid">
                    {favorites.map((item) => (
                        <FavoriteItem
                            // Usa una clave única para cada ítem favorito, incluyendo variantes.
                            key={item.Id_Favorito || `${item.Id_Producto}-${item.Id_Talla || 'null'}-${item.Color_Seleccionado || 'null'}`}
                            item={item}
                            onRemoveFavorite={() => toggleFavorite(item.Id_Producto, item.Id_Talla, item.Color_Seleccionado)}
                            onAddToCartFromFavorite={handleAddToCartFromFavorite}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}

export default FavoriteProductsPage;