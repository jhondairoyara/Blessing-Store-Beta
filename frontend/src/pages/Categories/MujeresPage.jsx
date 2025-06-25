// src/pages/Categories/MujeresPage.jsx

import React from 'react';
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel.jsx';
import './category-base.css';

// Página para la categoría de productos de Mujeres.
function MujeresPage() {
  return (
    <main className="main-content-page">
      <section className="category__hero">
        <h2>Colección Femenina</h2>
      </section>

      <ProductCarousel
        title="Todos los productos para mujeres"
        endpoint="/api/productos"
        categoryId={2} // ID de la categoría "Mujeres".
        limit={999}
      />
    </main>
  );
}

export default MujeresPage;