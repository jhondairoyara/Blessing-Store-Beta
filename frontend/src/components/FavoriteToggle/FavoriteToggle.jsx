// src/components/FavoriteToggle/FavoriteToggle.jsx

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import { toast } from 'react-toastify';

import HeartIcon from '../../assets/img/icon-heart.svg'; // Corazón vacío
import HeartFilledIcon from '../../assets/img/icon-heart-filled.svg'; // Corazón lleno

import './FavoriteToggle.css';

/**
 * Componente FavoriteToggle
 * Permite añadir/quitar un producto (o su variante) de los favoritos del usuario.
 * @param {number | string} productId - El ID del producto.
 * @param {number | null} [sizeId=null] - El ID de la talla seleccionada (opcional).
 * @param {string | null} [colorName=null] - El nombre del color seleccionado (opcional).
 */
function FavoriteToggle({ productId, sizeId = null, colorName = null }) {
    // Hooks de autenticación y favoritos
    const { isLoggedIn } = useAuth();
    const { loadingFavorites, toggleFavorite, isProductVariantFavorite } = useFavorites();

    // Determina si la combinación producto/variante es favorita
    const isFavorite = isProductVariantFavorite(productId, sizeId, colorName);

    // Manejador para añadir/quitar de favoritos
    const handleToggleFavorite = async () => {
        if (!isLoggedIn) {
            toast.warn("Debes iniciar sesión para añadir productos a tus favoritos.");
            return;
        }
        if (!productId) {
            toast.error("No se pudo identificar el producto para esta acción.");
            return;
            // Retorna un botón de carga si los favoritos están cargando o no hay ID de producto
        }

        await toggleFavorite(productId, sizeId, colorName);
    };

    // Muestra estado de carga o si falta el ID del producto
    if (loadingFavorites || !productId) {
        return (
            <button className="btn-favorite loading" disabled aria-label="Cargando estado de favorito">
                <img src={HeartIcon} alt="Cargando..." aria-hidden="true" style={{ opacity: 0.5 }} />
            </button>
        );
    }

    // Renderiza el botón de favorito (lleno o vacío)
    return (
        <button
            className={`btn-favorite ${isFavorite ? 'is-favorite' : ''}`}
            aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            onClick={handleToggleFavorite}
            disabled={!isLoggedIn || loadingFavorites}
        >
            <img
                src={isFavorite ? HeartFilledIcon : HeartIcon}
                alt=""
                aria-hidden="true"
                className="heart-icon"
            />
        </button>
    );
}

export default FavoriteToggle;