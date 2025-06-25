// src/components/FavoriteItem/FavoriteItem.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import { toast } from 'react-toastify';

import './FavoriteItem.css';

import HeartFilledIcon from '../../assets/img/icon-heart-filled.svg';
import CartIcon from '../../assets/img/icon-cart.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Componente FavoriteItem
function FavoriteItem({ item, onAddToCartFromFavorite }) {
    // Hooks para el carrito y favoritos
    const { addCartItem } = useCart();
    const { toggleFavorite } = useFavorites();

    // No renderiza si el ítem es inválido
    if (!item || !item.Id_Producto) {
        console.error("FavoriteItem: El item proporcionado es inválido o no tiene Id_Producto.", item);
        return null;
    }

    // Manejador para quitar el ítem de favoritos
    const handleRemoveClick = async () => {
        try {
            await toggleFavorite(item.Id_Producto, item.Id_Talla || null, item.Color_Seleccionado || null);
        } catch (error) {
            console.error("Error al quitar favorito desde FavoriteItem:", error);
            toast.error("Ocurrió un error al quitar el favorito.");
        }
    };

    // Manejador para añadir el ítem al carrito
    const handleAddToCartClick = async () => {
        if (item.stock === 0) {
            toast.warn(`"${item.nombre_producto}" está agotado.`);
            return;
        }

        // Requiere talla o color para productos con variantes
        if (item.Id_Talla === null && item.Color_Seleccionado === null && item.stock > 0) {
            toast.warn(`El producto "${item.nombre_producto}" requiere una talla o color para ser añadido al carrito. Por favor, visita el detalle del producto.`);
            return;
        }

        if (onAddToCartFromFavorite) {
            onAddToCartFromFavorite(item);
        } else {
            try {
                const result = await addCartItem({
                    productId: item.Id_Producto,
                    quantity: 1,
                    selectedSizeId: item.Id_Talla || null,
                    selectedColor: item.Color_Seleccionado || null
                });

                if (result.success) {
                    const variantInfo = (item.Nombre_Talla ? ` (${item.Nombre_Talla})` : '') +
                                         (item.Color_Seleccionado && !item.Nombre_Talla ? ` (${item.Color_Seleccionado})` : '');
                    toast.success(`"${item.nombre_producto}${variantInfo}" añadido al carrito.`);
                } else {
                    toast.error(result.message || "Ocurrió un error al añadir al carrito.");
                }
            } catch (err) {
                console.error("Error al añadir al carrito desde FavoriteItem:", err);
                toast.error("Ocurrió un error al añadir al carrito.");
            }
        }
    };

    // Formateador de moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Construcción de la URL de la imagen
    let cleanedImageUrl = '';
    if (item.imagen_url) {
        if (item.imagen_url.startsWith('uploads/')) {
            cleanedImageUrl = item.imagen_url.substring('uploads/'.length);
        } else {
            cleanedImageUrl = item.imagen_url;
        }
    }
    const imageUrl = cleanedImageUrl ? `${API_BASE_URL}/${cleanedImageUrl}` : `${API_BASE_URL}/images/placeholder_image.jpg`;

    return (
        <div className="favorite-item">
            {/* Contenedor de la imagen */}
            <div className="favorite-item__image-wrapper">
                <Link to={`/product/${item.Id_Producto}`}>
                    <img
                        src={imageUrl}
                        alt={item.nombre_producto}
                        className="favorite-item__image"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `${API_BASE_URL}/images/placeholder_image.jpg`;
                        }}
                    />
                </Link>
            </div>

            {/* Detalles del producto */}
            <div className="favorite-item__details">
                <Link to={`/product/${item.Id_Producto}`} className="favorite-item__name-link">
                    <h3 className="favorite-item__name">{item.nombre_producto}</h3>
                </Link>

                {/* Atributos de variante (Color, Talla) */}
                {(item.Color_Seleccionado || item.Nombre_Talla) && (
                    <p className="favorite-item__attributes">
                        {item.Color_Seleccionado && <span>Color: {item.Color_Seleccionado}</span>}
                        {item.Color_Seleccionado && item.Nombre_Talla && ' | '}
                        {item.Nombre_Talla && <span>Talla: {item.Nombre_Talla}</span>}
                    </p>
                )}
                
                <p className="favorite-item__price">{formatCurrency(item.precio_unitario || 0)}</p>

                {/* Información de stock */}
                {item.stock !== undefined && item.stock !== null && (
                    <p className={`favorite-item__stock-info ${item.stock <= 5 && item.stock > 0 ? 'low-stock' : item.stock === 0 ? 'out-of-stock' : ''}`}>
                        {item.stock > 0 ? `Stock: ${item.stock} unidades` : 'Agotado'}
                    </p>
                )}
            </div>

            {/* Acciones (Agregar al carrito, Quitar de favoritos) */}
            <div className="favorite-item__actions">
                <button
                    onClick={handleAddToCartClick}
                    className="favorite-item__add-to-cart-btn" 
                    aria-label="Agregar al carrito"
                    disabled={
                        item.stock === 0 ||
                        (item.Id_Talla === null && item.Color_Seleccionado === null && item.stock > 0)
                    }
                >
                    <img src={CartIcon} alt="Agregar al carrito" aria-hidden="true" />
                    <span>Agregar</span>
                </button>
                <button
                    onClick={handleRemoveClick}
                    className="favorite-item__remove-btn"
                    aria-label="Quitar de favoritos"
                >
                    <img src={HeartFilledIcon} alt="Quitar de favoritos" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}

export default FavoriteItem;