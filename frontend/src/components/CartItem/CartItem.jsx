// src/components/CartItem/CartItem.jsx

import React from 'react';
import { useCart } from '../../context/CartContext.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import TrashIcon from '../../assets/img/icon-trash.svg';
import MinusIcon from '../../assets/img/icon-minus.svg';
import PlusIcon from '../../assets/img/icon-plus.svg';
import './CartItem.css';
import { toast } from 'react-toastify'; 

// Renderiza un único ítem en el carrito de compras.
function CartItem({ item }) {
    const { updateItemQuantity, removeItem } = useCart();
    const productPrice = parseFloat(item.precio_unitario || 0);
    const itemQuantity = item.cantidad;
    const itemSubtotal = parseFloat(item.Subtotal || 0);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    // Maneja el aumento o disminución de la cantidad de un ítem.
    const handleQuantityChange = async (type) => {
        // Calcula la nueva cantidad.
        const newQuantity = type === 'increase' ? itemQuantity + 1 : itemQuantity - 1;

        // Previene aumentar la cantidad si no hay stock.
        if (type === 'increase' && itemQuantity >= item.stock) {
            toast.warn('No hay más stock disponible de este producto.');
            return;
        }

        // Elimina el ítem si la nueva cantidad es menor a 1.
        if (newQuantity < 1) {
            await removeItem({
                productId: item.Id_Producto,
                selectedSizeId: item.Id_Talla,
                selectedColor: item.Color_Seleccionado
            });
            return;
        }

        // Prepara los datos para actualizar la cantidad.
        const dataForUpdate = {
            productId: item.Id_Producto,
            selectedSizeId: item.Id_Talla,
            selectedColor: item.Color_Seleccionado,
            newQuantity: newQuantity
        };

        // Actualiza la cantidad del ítem en el carrito.
        await updateItemQuantity(dataForUpdate);
    };

    // Maneja la eliminación completa de un ítem del carrito.
    const handleRemoveItem = async () => {
        await removeItem({
            productId: item.Id_Producto,
            selectedSizeId: item.Id_Talla,
            selectedColor: item.Color_Seleccionado
        });
    };

    return (
        <div className="cart-item">
            {/* Contenedor de la imagen del producto */}
            <div className="cart-item__image-wrapper">
                {/* Imagen del producto con fallback */}
                <img
                    src={item.imagen_url ? `${API_BASE_URL}/${item.imagen_url}` : '/path/to/default-image.jpg'}
                    alt={item.nombre_producto}
                    className="cart-item__image"
                />
            </div>

            {/* Detalles del producto (nombre, atributos, precio, stock) */}
            <div className="cart-item__details">
                <h3 className="cart-item__name">{item.nombre_producto}</h3>
                {/* Atributos del producto (Color y Talla) */}
                <p className="cart-item__attributes">
                    Color: <span>{item.Color_Seleccionado}</span> | Talla: <span>{item.Nombre_Talla}</span>
                </p>
                {/* Precio unitario del producto */}
                <p className="cart-item__price">{formatCurrency(productPrice)}</p>

                {/* Información de stock */}
                {item.stock !== undefined && item.stock !== null && (
                    // Muestra el stock disponible o "Agotado" con estilos condicionales.
                    <p className={`cart-item__stock-info ${item.stock <= 5 && item.stock > 0 ? 'low-stock' : item.stock === 0 ? 'out-of-stock' : ''}`}>
                        {item.stock > 0 ? `Stock: ${item.stock} unidades` : 'Agotado'}
                    </p>
                )}
            </div>

            {/* Acciones del ítem (controles de cantidad y eliminar) */}
            <div className="cart-item__actions">
                {/* Controles para modificar la cantidad del producto */}
                <div className="cart-item__quantity-controls">
                    {/* Botón para disminuir la cantidad */}
                    <button
                        onClick={() => handleQuantityChange('decrease')}
                        className="qty-btn"
                        aria-label="Disminuir cantidad"
                        disabled={itemQuantity <= 1}
                    >
                        <img src={MinusIcon} alt="Decrease quantity" />
                    </button>
                    {/* Campo de entrada de la cantidad (solo lectura) */}
                    <input type="number" value={itemQuantity} readOnly className="qty-input" />
                    {/* Botón para aumentar la cantidad */}
                    <button
                        onClick={() => handleQuantityChange('increase')}
                        className="qty-btn"
                        aria-label="Aumentar cantidad"
                        disabled={itemQuantity >= item.stock}
                    >
                        <img src={PlusIcon} alt="Increase quantity" />
                    </button>
                </div>
                {/* Botón para eliminar el producto del carrito */}
                <button
                    onClick={handleRemoveItem}
                    className="cart-item__remove-btn"
                    aria-label="Eliminar producto del carrito"
                >
                    <img src={TrashIcon} alt="Eliminar" />
                </button>
            </div>

            {/* Sección del subtotal del ítem */}
            <div className="cart-item__subtotal">
                <span>Subtotal:</span>
                {/* Valor del subtotal formateado */}
                <span className="cart-item__subtotal-value">{formatCurrency(itemSubtotal)}</span>
            </div>
        </div>
    );
}

export default CartItem;