// src/pages/HomePage/HomePage.jsx

import React from 'react';
import './HomePage.css';
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel.jsx';

// Página principal de la aplicación.
function HomePage() {
  return (
    <main className="main-home">
      <section className="main__hero">
        <span className="line"></span>
        <h2>
          Descubre tu estilo con un <br />
          toque de bendición
        </h2>
        <span className="line"></span>
      </section>

      {/* Sección de botones principales. */}
      <section className="main__hero-buttons">
        <a href="#" className="main__btn main__btn--yellow">
          <strong>Ofertas especiales</strong>
          <span>¡COMPRA AHORA!</span>
        </a>
        <a href="#" className="main__btn main__btn--dark">
          <strong>Novedades</strong>
          <span>VER COLECCIÓN</span>
        </a>
      </section>

      {/* Carrusel de productos para Hombre. */}
      <ProductCarousel
        title="Colección Masculina"
        endpoint="/api/productos"
        categoryId={1} 
        limit={30} 
      />

      {/* Carrusel de productos para Mujer. */}
      <ProductCarousel
        title="Colección Femenina"
        endpoint="/api/productos"
        categoryId={2} 
        limit={30} 
      />

      {/* Carrusel de productos para Niños/as. */}
      <ProductCarousel
        title="Ropa para Niños/as"
        endpoint="/api/productos"
        categoryId={3} 
        limit={30} 
      />
      
      {/* Carrusel de productos para Bebés. */}
      <ProductCarousel
        title="Ropa para Bebés"
        endpoint="/api/productos"
        categoryId={4} 
        limit={30} 
      />

      {/* Carrusel de ofertas y descuentos. */}
      <ProductCarousel
        title="Ofertas y descuentos"
        endpoint="/api/productos"
        limit={50}
      />
    </main>
  );
}

export default HomePage;