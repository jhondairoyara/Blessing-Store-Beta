// src/components/CartIcon/CartIcon.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import CartSvg from '../../assets/img/icon-cart.svg';
import './CartIcon.css';

function CartIcon() {
  const { getTotalItems } = useCart(); // Hook para acceder a la lógica del carrito

  const totalItems = getTotalItems(); // Obtiene el número total de artículos en el carrito

  return (
    <Link to="/cart" className="cart-icon-container" aria-label={`Carrito de compras con ${totalItems} artículos`}>
      <img src={CartSvg} alt="Ícono de carrito de compras" className="cart-icon" />
      
      {/* Muestra el contador solo si hay ítems en el carrito */}
      {totalItems > 0 && <span className="cart-item-count">{totalItems}</span>}
    </Link>
  );
}

export default CartIcon;