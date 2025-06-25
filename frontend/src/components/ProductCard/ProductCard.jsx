// frontend/src/components/ProductCard/ProductCard.jsx

import React from 'react'; // Solo necesitamos React
import { Link } from 'react-router-dom';
import './ProductCard.css';

// --- Subcomponente: ProductImageDisplay ---
function ProductImageDisplay({ imageUrl, name, discount }) {
  return (
    <div className="product-card__image-wrapper">
      <img src={imageUrl} alt={`Producto: ${name}`} className="product-card__image" />
      {discount && <span className="product-card__discount">{discount}</span>}
    </div>
  );
}

// --- Subcomponente: ProductPriceInfo ---
function ProductPriceInfo({ oldPrice, newPrice }) {
  return (
    <p className="product-card__price">
      {oldPrice && <span className="product-card__old-price">{oldPrice}</span>}
      <span className="product-card__new-price">{newPrice}</span>
    </p>
  );
}

// --- Subcomponente: ProductHeaderContent ---
function ProductHeaderContent({ id, name, onAddToCart }) {
  const handleCartClick = (e) => {
    e.preventDefault(); // Evita que el Link padre navegue
    e.stopPropagation(); // Evita que el evento se propague al Link padre
    onAddToCart(id);
  };

  return (
    <div className="product-card__header">
      {/* El nombre se renderiza directamente, el CSS lo truncará si es necesario */}
      <h4 className="product-card__name">{name}</h4>
      <button className="product-card__cart" onClick={handleCartClick} aria-label="Agregar al carrito">
        <img src="/src/assets/img/icon-cart-outline-b.svg" alt="Agregar al carrito" />
      </button>
    </div>
  );
}

// --- Subcomponente: ProductDescriptionDisplay ---
function ProductDescriptionDisplay({ description }) {
  return (
    // La descripción se renderiza directamente, el CSS la truncará si es necesario
    <p className="product-card__desc">{description}</p>
  );
}

// --- Componente Principal: ProductCard ---
function ProductCard({ id, imageUrl, oldPrice, newPrice, discount, name, description, onAddToCart }) {
  return (
    <article className="product-card">
      <Link to={`/product/${id}`} className="product-card__main-link">
        <ProductImageDisplay imageUrl={imageUrl} name={name} discount={discount} />

        <div className="product-card__info-area">
          <ProductPriceInfo oldPrice={oldPrice} newPrice={newPrice} />
          <ProductHeaderContent id={id} name={name} onAddToCart={onAddToCart} />
          <ProductDescriptionDisplay description={description} />
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;