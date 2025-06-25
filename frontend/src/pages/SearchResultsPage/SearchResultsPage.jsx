// src/pages/SearchResultsPage/SearchResultsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';

import './SearchResultsPage.css';

// Componente de página para mostrar resultados de búsqueda de productos.
function SearchResultsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const location = useLocation();

    // Obtiene el término de búsqueda y la categoría de los parámetros de URL.
    const searchTerm = searchParams.get('search');
    const categoryId = searchParams.get('category');

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    // Función simulada para añadir productos al carrito.
    const handleAddToCart = useCallback((productId, color, size) => {
        console.log(`Producto ID: ${productId}, Color: ${color || 'N/A'}, Talla: ${size || 'N/A'} agregado al carrito (simulado).`);
    }, []);

    // Función para obtener productos de la API basada en el término de búsqueda o categoría.
    const fetchProducts = useCallback(async (term, category) => {
        setLoading(true);
        setError(null);
        setProducts([]);

        let url = `${API_BASE_URL}/api/productos`;
        const queryParams = new URLSearchParams();

        if (term) {
            queryParams.append('search', term);
        }
        if (category) {
            queryParams.append('category', category);
        }

        if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                throw new Error(errorData.message || 'Error al cargar los productos');
            }
            const result = await response.json();
            const productsData = Array.isArray(result) ? result : result.data || [];

            const expandedAndAdaptedProducts = [];

            productsData.forEach(product => {
                const originalPrice = product.precio || 0;
                const discountPercentage = product.descuento_porcentaje || 0;
                let finalPrice = originalPrice;
                let oldPriceFormatted = null;
                let discountText = null;

                if (discountPercentage > 0) {
                    finalPrice = originalPrice * (1 - discountPercentage / 100);
                    oldPriceFormatted = `$${originalPrice.toLocaleString('es-CO')}`;
                    discountText = `${discountPercentage}% OFF`;
                }
                const newPriceFormatted = `$${finalPrice.toLocaleString('es-CO')}`;

                const defaultFallbackImageUrl = '/src/assets/img/default-product.png';

                // Procesa variantes por color único o una tarjeta principal si no hay variantes con color.
                const processedColors = new Set(); 

                if (product.variantes && product.variantes.length > 0) {
                    product.variantes.forEach(variant => {
                        if (variant.color && !processedColors.has(variant.color)) {
                            let variantImageUrl = defaultFallbackImageUrl;

                            if (product.imagenes && product.imagenes.length > 0) {
                                const normalizedColor = variant.color.toLowerCase();
                                const foundImage = product.imagenes.find(img =>
                                    img.color_asociado && img.color_asociado.toLowerCase() === normalizedColor
                                );
                                if (foundImage) {
                                    variantImageUrl = `${API_BASE_URL}/${foundImage.nombre_archivo}`;
                                } else if (product.imagenes.length > 0) {
                                    variantImageUrl = `${API_BASE_URL}/${product.imagenes[0].nombre_archivo}`;
                                }
                            }

                            expandedAndAdaptedProducts.push({
                                id: product.id,
                                uniqueCardKey: `${product.id}-${variant.color}`,
                                name: `${product.nombre} - ${variant.color}`,
                                description: product.descripcion,
                                imageUrl: variantImageUrl,
                                oldPrice: oldPriceFormatted,
                                newPrice: newPriceFormatted,
                                discount: discountText,
                                color: variant.color,
                                size: variant.talla,
                            });
                            processedColors.add(variant.color);
                        }
                    });
                }

                // Agrega una tarjeta principal si no hay variantes procesadas por color.
                if (processedColors.size === 0) {
                    const primaryImageUrl = (product.imagenes && product.imagenes.length > 0)
                        ? `${API_BASE_URL}/${product.imagenes[0].nombre_archivo}`
                        : defaultFallbackImageUrl;

                    expandedAndAdaptedProducts.push({
                        id: product.id,
                        uniqueCardKey: `${product.id}-main`,
                        name: product.nombre,
                        description: product.descripcion,
                        imageUrl: primaryImageUrl,
                        oldPrice: oldPriceFormatted,
                        newPrice: newPriceFormatted,
                        discount: discountText,
                        color: null,
                        size: null,
                    });
                }
            });

            setProducts(expandedAndAdaptedProducts);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.message);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    // Llama a la función de obtención de productos cuando cambian los parámetros de búsqueda.
    useEffect(() => {
        if (searchTerm || categoryId) {
            fetchProducts(searchTerm, categoryId);
        } else {
            setProducts([]);
            setLoading(false);
        }
    }, [searchTerm, categoryId, fetchProducts, location.search]);

    return (
        <div className="search-results-page">
            {/* Encabezado de la página de resultados de búsqueda. */}
            <div className="search-results-header">
                {searchTerm && (
                    <h1 className="search-results-title">
                        Resultados para: "<span className="search-term-highlight">{searchTerm}</span>"
                    </h1>
                )}
                {!searchTerm && categoryId && (
                    <h1 className="search-results-title">
                        Productos en categoría: <span className="search-term-highlight">{categoryId}</span>
                    </h1>
                )}
                {!searchTerm && !categoryId && (
                    <h1 className="search-results-title">Explora nuestros productos</h1>
                )}
            </div>

            {/* Mensajes de estado: cargando, error o sin resultados. */}
            {loading && (
                <div className="loading-message">
                    <p>Cargando productos...</p>
                </div>
            )}

            {error && (
                <div className="error-message">
                    <p>Error: {error}</p>
                    <p>Por favor, inténtalo de nuevo más tarde.</p>
                </div>
            )}

            {!loading && !error && products.length === 0 && (
                <div className="no-results-message">
                    <p>No se encontraron productos que coincidan con tu búsqueda.</p>
                    <p>Intenta con otras palabras clave o explora nuestro <Link to="/">catálogo</Link>.</p>
                </div>
            )}

            {/* Cuadrícula de productos encontrados. */}
            {!loading && !error && products.length > 0 && (
                <div className="product-grid">
                    {products.map(product => (
                        <ProductCard
                            key={product.uniqueCardKey}
                            id={product.id}
                            imageUrl={product.imageUrl}
                            oldPrice={product.oldPrice}
                            newPrice={product.newPrice}
                            discount={product.discount}
                            name={product.name}
                            description={product.description}
                            onAddToCart={() => handleAddToCart(product.id, product.color, product.size)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchResultsPage;