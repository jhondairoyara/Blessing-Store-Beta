// frontend/src/components/ProductCarousel/ProductCarousel.jsx

import React, { useState, useEffect, useRef } from 'react';
import './ProductCarousel.css';
import ProductCard from '../ProductCard/ProductCard.jsx';

/**
 * Componente ProductCarousel
 * Muestra un carrusel de productos obtenidos desde una API.
 * Permite filtrar por búsqueda y categoría, y soporta desplazamiento.
 * 
 * @param {string} title - Título del carrusel.
 * @param {string} endpoint - Ruta de la API para obtener los productos (e.g., '/api/products').
 * @param {string} [searchQuery] - Término de búsqueda para filtrar productos.
 * @param {string} [categoryId] - ID de la categoría para filtrar productos.
 * @param {number} [limit=10] - Número máximo de productos a mostrar en el carrusel.
 */
function ProductCarousel({ title, endpoint, searchQuery, categoryId, limit = 10 }) {
  // --- Estados del componente ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Referencia para el elemento del carrusel, usada para el desplazamiento
  const carouselRef = useRef(null);

  // URL base de la API, obtenida de las variables de entorno
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  // --- Hook useEffect para la carga de productos ---
  useEffect(() => {
    const fetchProductsData = async () => {
      setLoading(true);
      setError(null);

      let url = `${API_BASE_URL}${endpoint}`;
      const queryParams = new URLSearchParams();

      // Añade parámetros de búsqueda y categoría si están definidos
      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }
      if (categoryId) {
        queryParams.append('category', categoryId);
      }

      // Concatena los parámetros de consulta a la URL
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP! Estado: ${response.status}`);
        }
        const data = await response.json();

        const expandedProducts = [];
        // Procesa los datos para crear una tarjeta por cada imagen de producto
        if (Array.isArray(data)) {
          data.forEach(product => {
            // Calcula precios y descuentos
            const originalPrice = product.precio || 0;
            const discountPercentage = product.descuento_porcentaje || 0;
            let finalPrice = originalPrice;
            let oldPriceFormatted = null;
            let discountText = null;

            if (discountPercentage > 0) {
              finalPrice = originalPrice * (1 - discountPercentage / 100);
              oldPriceFormatted = originalPrice.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
              discountText = `${discountPercentage}% OFF`;
            }
            const newPriceFormatted = finalPrice.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

            // Si el producto tiene imágenes, crea una tarjeta para cada una
            if (product.imagenes && product.imagenes.length > 0) {
              product.imagenes.forEach(image => {
                const displayImageUrl = `${API_BASE_URL}/${image.nombre_archivo}`;
                expandedProducts.push({
                  id: product.id, // ID del producto principal
                  nombre: product.nombre,
                  descripcion: product.descripcion,
                  imageUrl: displayImageUrl, // URL de la imagen específica
                  oldPrice: oldPriceFormatted,
                  newPrice: newPriceFormatted,
                  discount: discountText,
                  uniqueCardKey: `${product.id}-${image.id}` // Clave única para la tarjeta
                });
              });
            } else {
              // Si no hay imágenes, usa una imagen por defecto
              expandedProducts.push({
                id: product.id,
                nombre: product.nombre,
                descripcion: product.descripcion,
                imageUrl: '/src/assets/img/default-product.png', // Asegúrate de que esta ruta exista
                oldPrice: oldPriceFormatted,
                newPrice: newPriceFormatted,
                discount: discountText,
                uniqueCardKey: `${product.id}-noimage`
              });
            }
          });
        }

        // Aplica el límite después de expandir los productos
        setProducts(expandedProducts.slice(0, limit));
      } catch (err) {
        console.error(`Error al cargar productos para "${title}":`, err);
        setError(`No pudimos cargar los productos de "${title}".`);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    // Solo realiza la llamada a la API si se proporciona un endpoint
    if (endpoint) {
      fetchProductsData();
    } else {
      setLoading(false);
      setError("Endpoint de API no proporcionado para el carrusel de productos.");
    }
  }, [API_BASE_URL, endpoint, searchQuery, categoryId, limit, title]); // Dependencias del useEffect

  // --- Manejador para añadir productos al carrito ---
  const handleAddToCartFromCarousel = (productId) => {
    console.log(`¡Producto con ID ${productId} añadido al carrito desde el carrusel!`);
    // Aquí se integraría la lógica real para añadir al carrito,
  };

  // --- Función para desplazar el carrusel ---
  const scroll = (scrollOffset) => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += scrollOffset;
    }
  };

  // --- Renderizado condicional basado en el estado de carga y errores ---
  if (loading) {
    return (
      <section className="products">
        <h3 className="products__title">{title}</h3>
        <div className="products__carousel">
          <p className="loading-message">Cargando productos...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products">
        <h3 className="products__title">{title}</h3>
        <div className="products__carousel">
          <p className="error-message">{error}</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="products">
        <h3 className="products__title">{title}</h3>
        <div className="products__carousel">
          <p className="no-products-message">No hay productos disponibles en esta sección.</p>
        </div>
      </section>
    );
  }

  // --- Renderizado del carrusel con productos ---
  return (
    <section className="products">
      <h3 className="products__title">
        {title}
      </h3>

      <div className="products__carousel">
        {/* Botón para desplazar a la izquierda */}
        <button className="products__arrow-left" onClick={() => scroll(-200)} aria-label="Desplazar a la izquierda">
          <img src="/src/assets/img/icon-arrow-left.svg" alt="Flecha izquierda" />
        </button>

        {/* Contenedor de la lista de productos con referencia para el desplazamiento */}
        <div className="products__list" ref={carouselRef}>
          {products.map(product => (
            <ProductCard
              key={product.uniqueCardKey} // Clave única para cada tarjeta generada
              id={product.id} // ID del producto base
              imageUrl={product.imageUrl}
              oldPrice={product.oldPrice}
              newPrice={product.newPrice}
              discount={product.discount}
              name={product.nombre}
              description={product.descripcion}
              onAddToCart={handleAddToCartFromCarousel}
            />
          ))}
        </div>

        {/* Botón para desplazar a la derecha */}
        <button className="products__arrow-right" onClick={() => scroll(200)} aria-label="Desplazar a la derecha">
          <img src="/src/assets/img/icon-arrow-right.svg" alt="Flecha derecha" />
        </button>
      </div>
    </section>
  );
}

export default ProductCarousel;