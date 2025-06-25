// src/pages/Categories/NinosPage.jsx

import React from 'react';
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel.jsx';
import './category-base.css';

// Página para la categoría de productos de Niños/as.
function NinosPage() {
  return (
    <main className="main-content-page">
      <section className="category__hero">
        <h2>Ropa para Niños/as</h2>
      </section>

      <ProductCarousel
        title="Todos los productos para niños/as"
        endpoint="/api/productos"
        categoryId={3} // ID de la categoría "Niños/as".
        limit={999} 
      />
    </main>
  );
}

export default NinosPage;