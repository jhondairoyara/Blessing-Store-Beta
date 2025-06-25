// src/pages/CartPage/CartPage.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import CartList from '../../components/CartList/CartList.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { toast } from 'react-toastify';
import './CartPage.css';

function CartPage() {
    // Obtiene datos y funciones del contexto del carrito.
    const { cartItems, cartTotal, loading, error, clearCart } = useCart();
    const navigate = useNavigate();

    // Manejador para el botón de proceder al pago.
    const handleCheckout = () => {
        navigate('/en-construccion');
    };

    // Manejador para vaciar el carrito.
    const handleClearCart = async () => {
        toast.info('Vaciando tu carrito...', { autoClose: 2000, toastId: 'clearingCart' });
        await clearCart();
    };

    // Muestra estado de carga del carrito.
    if (loading) {
        return (
            <main className="cart-page-main loading-state">
                <p>Cargando tu carrito, por favor espera...</p>
                <div className="loading-spinner"></div>
            </main>
        );
    }

    // Muestra mensaje de error si falla la carga del carrito.
    if (error) {
        return (
            <main className="cart-page-main error-state">
                <h2>¡Ups! Algo salió mal al cargar tu carrito.</h2>
                <p>Parece que tuvimos un problema. Detalles: <b>{error}</b></p>
                <p>
                    <button onClick={() => window.location.reload()} className="cart-page-btn-primary">Intentar Recargar</button>
                    <Link to="/" className="cart-page-btn-secondary">Volver a la Tienda</Link>
                </p>
            </main>
        );
    }

    // Renderiza la página del carrito.
    return (
        <main className="cart-page-main">
            <h1 className="cart-page-title">Carrito de compras</h1>

            {cartItems.length === 0 ? (
                // Muestra mensaje si el carrito está vacío.
                <div className="cart-empty-message">
                    <p>¡Tu carrito está vacío!</p>
                    <p>¡Explora nuestros productos y encuentra algo increíble para empezar a comprar!</p>
                    <Link to="/" className="cart-page-btn-primary">Empezar a comprar</Link>
                </div>
            ) : (
                // Muestra el contenido del carrito si hay ítems.
                <div className="cart-content">
                    {/* Lista de ítems del carrito */}
                    <div className="cart-items-section">
                        <CartList items={cartItems} />
                        <div className="cart-actions-bottom">
                            <Link to="/" className="cart-page-btn-secondary">Seguir comprando</Link>
                            <button onClick={handleClearCart} className="cart-page-btn-danger">Vaciar carrito</button>
                        </div>
                    </div>

                    {/* Resumen del pedido */}
                    <aside className="cart-summary">
                        <h2>Resumen de tu pedido</h2>
                        <div className="summary-item">
                            <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'})</span>
                            <span>{formatCurrency(cartTotal)}</span>
                        </div>
                        <div className="summary-item">
                            <span>Envío estándar</span>
                            <span>Gratis</span>
                        </div>
                        <hr />
                        <div className="summary-total">
                            <h3>Total a pagar</h3>
                            <h3>{formatCurrency(cartTotal)}</h3>
                        </div>
                        <button className="cart-page-btn-checkout" onClick={handleCheckout}>Proceder al Pago</button>
                    </aside>
                </div>
            )}
        </main>
    );
}

export default CartPage;