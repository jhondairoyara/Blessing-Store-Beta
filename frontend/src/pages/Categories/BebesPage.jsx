// src/pages/Categories/BebesPage.jsx

import React from 'react';
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel.jsx';
import './category-base.css';

// Página para la categoría de productos de Bebés.
function BebesPage() {
  return (
    <main className="main-content-page">
      <section className="category__hero">
        <h2>Ropa para Bebés</h2>
      </section>

      <ProductCarousel
        title="Todos los productos para bebés"
        endpoint="/api/productos"
        categoryId={4} // ID de la categoría "Bebés".
        limit={999} 
      />
    </main>
  );
}

export default BebesPage;