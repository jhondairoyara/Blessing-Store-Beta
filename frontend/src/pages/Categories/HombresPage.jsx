// src/pages/Categories/HombresPage.jsx

import React from 'react';
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel.jsx';
import './category-base.css';

// Página para la categoría de productos de Hombres.
function HombresPage() {
  return (
    <main className="main-content-page">
      <section className="category__hero">
        <h2>Colección Masculina</h2>
      </section>

      <ProductCarousel
        title="Todos los productos para hombres"
        endpoint="/api/productos"
        categoryId={1} // ID de la categoría "Hombres".
        limit={999}
      />
    </main>
  );
}

export default HombresPage;