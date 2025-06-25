// src/components/CartList/CartList.jsx

import React from 'react';
import CartItem from '../CartItem/CartItem.jsx';
import './CartList.css';

// Componente CartList
function CartList({ items }) {
    // Muestra un mensaje si el carrito está vacío
    if (!items || items.length === 0) {
        return <p className="cart-empty-message">Tu carrito está vacío.</p>;
    }

    // Renderiza la lista de ítems del carrito
    return (
        <div className="cart-list-container">
            {items.map((item) => (
                <CartItem 
                    // Usa una clave única para cada ítem del carrito
                    key={`${item.Id_Producto}-${item.Id_Talla}-${item.Color_Seleccionado}`} 
                    item={item} 
                />
            ))}
        </div>
    );
}

export default CartList;