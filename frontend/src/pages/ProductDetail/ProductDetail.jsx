// src/pages/ProductDetail/ProductDetail.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ProductDetail.css';
import { useCart } from '../../context/CartContext.jsx';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

// Iconos SVG
import StarIcon from '../../assets/img/icon-star.svg';
import HeartIcon from '../../assets/img/icon-heart.svg';
import HeartFilledIcon from '../../assets/img/icon-heart-filled.svg';
import MinusIcon from '../../assets/img/icon-minus.svg';
import PlusIcon from '../../assets/img/icon-plus.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addCartItem } = useCart();
    const { favorites, toggleFavorite, isProductVariantFavorite } = useFavorites();
    const { isAuthenticated } = useAuth(); 

    const navigate = useNavigate();

    const [mainImage, setMainImage] = useState('');
    const [selectedColor, setSelectedColor] = useState(null); // Esto es el color
    const [selectedSize, setSelectedSize] = useState(null); // Esto es el 'nombre' de la talla
    const [selectedSizeId, setSelectedSizeId] = useState(null); // Para almacenar el ID real de la talla
    const [quantity, setQuantity] = useState(1); // Esto es la cantidad

    // Estado para almacenar la variante seleccionada, hace más fácil acceder a stock y Id_Talla
    const [selectedVariantObject, setSelectedVariantObject] = useState(null);

    // Calcular la variante seleccionada y su Id_Talla y stock
    useEffect(() => {
        if (product && product.variantes) {
            // Encuentra la variante que coincide con el color y talla seleccionados
            const foundVariant = product.variantes.find(
                v => v.talla === selectedSize && v.color === selectedColor
            );
            setSelectedVariantObject(foundVariant || null);
            setSelectedSizeId(foundVariant ? foundVariant.Id_Talla : null);
            // Si la cantidad seleccionada excede el stock de la nueva variante, ajustarla.
            if (foundVariant && quantity > foundVariant.stock) {
                setQuantity(Math.max(1, foundVariant.stock)); 
            } else if (!foundVariant) {
                setQuantity(1);
            }
        } else {
            // Resetea si no hay producto o variantes
            setSelectedVariantObject(null);
            setSelectedSizeId(null);
            setQuantity(1);
        }
    }, [product, selectedSize, selectedColor, quantity]); // Dependencia 'quantity' para ajustar si excede el nuevo stock

    // Usar el stock de la variante seleccionada
    const currentVariantStock = selectedVariantObject?.stock || 0;
    const isFavorite = product ? isProductVariantFavorite(product.id, selectedSizeId, selectedColor) : false;
    const [activeTab, setActiveTab] = useState('description');

    const fetchProduct = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/productos/${id}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Producto no encontrado.');
                }
                throw new Error(`Error al cargar el producto: ${response.statusText}`);
            }
            const data = await response.json();

            const staticImageBaseUrl = API_BASE_URL;

            const originalPriceBackend = parseFloat(data.precio || 0);
            let finalPrice = originalPriceBackend;
            let strikethroughPrice = null;

            if (data.descuento_porcentaje > 0) {
                strikethroughPrice = originalPriceBackend;
                finalPrice = originalPriceBackend * (1 - data.descuento_porcentaje / 100);
            }

            const adaptedProduct = {
                id: data.id,
                name: data.nombre,
                description: data.descripcion,
                features: data.caracteristicas_principales ? data.caracteristicas_principales.split(',').map(s => s.trim()) : [],
                newPrice: finalPrice,
                oldPrice: strikethroughPrice,
                discount: data.descuento_porcentaje > 0 ? `${data.descuento_porcentaje}% OFF` : null,
                images: Array.isArray(data.imagenes)
                    ? data.imagenes.map(img => ({
                            url: `${staticImageBaseUrl}/${img.nombre_archivo}`,
                            color_asociado: img.color_asociado
                        }))
                    : [],
                colors: [], // Se llenará con objetos { name, image, hex }
                sizes: [], // Se llenará con nombres de tallas únicos
                variantes: Array.isArray(data.variantes) ? data.variantes.map(variant => ({
                    ...variant,
                    Id_Talla: variant.Id_Talla || null // Asegura que Id_Talla esté presente
                })) : [],
                category: data.categoria ? data.categoria.nombre : 'General',
                rating: data.calificacion || 0,
                reviewsCount: data.cantidad_reviews || 0,
            };

            const availableColors = new Map(); // Mapa para evitar duplicados y capturar imágenes/hex
            const processedSizes = new Set(); // Conjunto para nombres de talla únicos

            if (adaptedProduct.variantes && adaptedProduct.variantes.length > 0) {
                adaptedProduct.variantes.forEach(variant => {
                    if (variant.color) {
                        // Asegura que el color esté en el mapa
                        if (!availableColors.has(variant.color)) {
                            availableColors.set(variant.color, {
                                name: variant.color,
                                image: null, // Se llenará después con la imagen principal asociada
                                hex: variant.hex_color || null
                            });
                        } else if (variant.hex_color && !availableColors.get(variant.color).hex) {
                            // Si ya existe, pero ahora tenemos un hex, lo agregamos
                            availableColors.get(variant.color).hex = variant.hex_color;
                        }
                    }
                    if (variant.talla) { // Aquí usa el nombre de la talla
                        processedSizes.add(variant.talla);
                    }
                });
            }

            // Asocia imágenes a los colores si están disponibles
            if (adaptedProduct.images && adaptedProduct.images.length > 0) {
                adaptedProduct.images.forEach(img => {
                    if (img.color_asociado && availableColors.has(img.color_asociado)) {
                        // Solo toma la primera imagen asociada a ese color
                        if (!availableColors.get(img.color_asociado).image) {
                            availableColors.get(img.color_asociado).image = img.url;
                        }
                    }
                });
            }

            const finalColors = Array.from(availableColors.values()).filter(color =>
                color.image || color.hex // Solo colores que tengan imagen o hex
            ).sort((a, b) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente

            adaptedProduct.colors = finalColors;
            adaptedProduct.sizes = Array.from(processedSizes).sort((a,b) => {
                // Intenta ordenar numéricamente si son números, de lo contrario alfabéticamente
                const numA = parseFloat(a);
                const numB = parseFloat(b);
                if (!isNaN(numA) && !isNaN(numB)) {
                    return numA - numB;
                }
                return a.localeCompare(b);
            });

            setProduct(adaptedProduct);

            // Establece la selección inicial de color y talla
            let initialSelectedColor = null;
            let initialSelectedSize = null;
            let initialMainImage = `${staticImageBaseUrl}/placeholder_image.svg`; // Imagen por defecto

            if (adaptedProduct.colors.length > 0) {
                initialSelectedColor = adaptedProduct.colors[0].name;
                initialMainImage = adaptedProduct.colors[0].image || adaptedProduct.images[0]?.url || initialMainImage;
            } else if (adaptedProduct.images.length > 0) {
                initialMainImage = adaptedProduct.images[0].url;
            }

            if (adaptedProduct.sizes.length > 0) {
                initialSelectedSize = adaptedProduct.sizes[0];
            }

            setMainImage(initialMainImage);
            setSelectedColor(initialSelectedColor);
            setSelectedSize(initialSelectedSize);
            setQuantity(1);
            setActiveTab('description');

        } catch (err) {
            console.error("Error al cargar el producto:", err);
            setError(err.message || 'Ocurrió un error desconocido.');
            setProduct(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const handleColorSelect = (colorName, imageUrl) => {
        setSelectedColor(colorName);
        if (imageUrl) {
            setMainImage(imageUrl);
        } else {
            const genericImage = product.images.find(img => !img.color_asociado)?.url || product.images[0]?.url || `${API_BASE_URL}/images/placeholder_image.jpg`;
            setMainImage(genericImage);
        }
    };

    const handleSizeSelect = (sizeName) => {
        setSelectedSize(sizeName);
    };

    const handleQuantityChange = (type) => {
        setQuantity((prevQty) => {
            const maxQty = currentVariantStock;
            if (type === 'increase') {
                return Math.min(prevQty + 1, maxQty);
            } else {
                return Math.max(1, prevQty - 1);
            }
        });
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.info('Para agregar productos al carrito, debes iniciar sesión.');
            navigate('/login'); 
            return; // Detiene la ejecución si el usuario no está autenticado
        }

        if (!product) {
            toast.error("No se puede añadir al carrito: Producto no disponible.");
            return;
        }

        // Validación de selección de color y talla
        if (product.colors.length > 0 && !selectedColor) {
            toast.warn('Por favor, selecciona un color antes de añadir al carrito.');
            return;
        }
        if (product.sizes.length > 0 && !selectedSize) {
            toast.warn('Por favor, selecciona una talla antes de añadir al carrito.');
            return;
        }

        if (quantity <= 0) {
            toast.warn('La cantidad debe ser al menos 1.');
            return;
        }

        if (!selectedVariantObject) {
            toast.error("No se encontró una variante válida para la selección actual. Por favor, elige otra combinación de talla y color.");
            console.error("No se encontró variante para color:", selectedColor, "y talla:", selectedSize);
            return;
        }

        if (quantity > selectedVariantObject.stock) {
            toast.warn(`No hay suficiente stock para la combinación de color "${selectedColor || 'N/A'}" y talla "${selectedSize || 'N/A'}". Stock disponible: ${selectedVariantObject.stock}`);
            return;
        }
    
        if (product.sizes.length > 0 && (selectedSizeId === null || selectedSizeId === undefined)) {
            console.error("Error: Id_Talla de la variante seleccionada es nulo o indefinido.", selectedVariantObject);
            toast.error("Error interno: La talla seleccionada no tiene un ID válido. Por favor, contacta a soporte.");
            return;
        }

        const itemToAdd = {
            productId: product.id,
            quantity: quantity,
            selectedSizeId: selectedSizeId,
            selectedColor: selectedColor,
        };

        try {
            const result = await addCartItem(itemToAdd);
            if (result.success) {
                navigate('/cart');
            }
        } catch (err) {
            console.error("Error al añadir al carrito desde ProductDetail (capturado por el try/catch):", err);
            toast.error("Ocurrió un error inesperado al añadir al carrito. Inténtalo de nuevo.");
        }
    };

    const handleBuyNow = async () => {

        if (!product) {
            toast.error("No se puede comprar: Producto no disponible.");
            return;
        }

        if (product.colors.length > 0 && !selectedColor) {
            toast.warn('Por favor, selecciona un color antes de comprar.');
            return;
        }
        if (product.sizes.length > 0 && !selectedSize) {
            toast.warn('Por favor, selecciona una talla antes de comprar.');
            return;
        }

        if (quantity <= 0) {
            toast.warn('La cantidad debe ser al menos 1.');
            return;
        }

        if (!selectedVariantObject) {
            toast.error("No se encontró una variante válida para la selección actual. Por favor, elige otra combinación de talla y color.");
            return;
        }

        if (quantity > selectedVariantObject.stock) {
            toast.warn(`No hay suficiente stock para la combinación de color "${selectedColor || 'N/A'}" y talla "${selectedSize || 'N/A'}". Stock disponible: ${selectedVariantObject.stock}`);
            return;
        }

        if (product.sizes.length > 0 && (selectedSizeId === null || selectedSizeId === undefined)) {
            console.error("Error: Id_Talla de la variante seleccionada es nulo o indefinido.", selectedVariantObject);
            toast.error("Error interno: La talla seleccionada no tiene un ID válido. Por favor, contacta a soporte.");
            return;
        }

        toast.info('Redirigiendo para ver más información ...');
        navigate('/en-construccion');
    };

    // Lógica para handleHeartClick para soportar favoritos por variante
    const handleHeartClick = async () => {
        if (!product) {
            toast.error("No se puede gestionar favoritos: Producto no disponible.");
            return;
        }
        
        // Si el producto tiene tallas o colores, requerimos que se haya hecho una selección
        if (product.sizes.length > 0 && (selectedSizeId === null || selectedSizeId === undefined)) {
            toast.warn('Por favor, selecciona una talla para añadir/quitar de favoritos.');
            return;
        }
        if (product.colors.length > 0 && !selectedColor) {
            toast.warn('Por favor, selecciona un color para añadir/quitar de favoritos.');
            return;
        }
        
        // Llama a la función toggleFavorite del contexto con los IDs/nombres correctos
        await toggleFavorite(product.id, selectedSizeId, selectedColor);
    };

    if (loading) {
        return (
            <main className="product-main" aria-live="polite" aria-busy="true">
                <h2 className="product-main__status-title">Cargando producto...</h2>
                <p className='product-main__status-message'>Por favor espera mientras obtenemos los detalles del producto.</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="product-main" aria-live="assertive">
                <h2 className='product-main__status-title'>Error al cargar el producto</h2>
                <p className='product-main__status-message'>{error}</p>
                <Link to="/" className='product-main__status-link'>Volver a la página principal</Link>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="product-main">
                <h2 className='product-main__status-title'>Producto no encontrado</h2>
                <p className='product-main__status-message'>Lo sentimos, no pudimos encontrar el producto con el ID: {id}</p>
                <Link to="/" className='product-main__status-link'>Volver a la página principal</Link>
            </main>
        );
    }

    const displayedRating = 5; // Valor estático
    const ratingText = "5.0";

    // Un producto es "simple" si no tiene variantes de talla ni color.
    const hasVariants = product.sizes.length > 0 || product.colors.length > 0;

    const isAddToCartDisabled = (hasVariants && (!selectedColor || (product.sizes.length > 0 && !selectedSize))) || // Si tiene variantes, color y talla deben estar seleccionados
                                 currentVariantStock === 0 || // O el stock es 0
                                 (!hasVariants && currentVariantStock === 0); // Si no tiene variantes, y stock es 0 (caso de producto simple agotado)


    return (
        <main className="product-main">
            <div className="breadcrumb" aria-label="Ruta de navegación">
                <Link to="/">Blessing Store</Link>
                {product.category && <Link to={`/categorias/${product.category.toLowerCase()}`}>{product.category}</Link>}
                <span>{product.name}</span>
            </div>

            <section className="product">
                <div className="product__gallery">
                    <div className="product__main-image-container">
                        <img
                            id="img-producto"
                            src={mainImage}
                            alt={`Vista principal del ${product.name} en color ${selectedColor || 'seleccionado'}`}
                            className="product__main-image-display"
                        />
                    </div>
                    {/* Si hubiera thumbnails para cada color, irían aquí */}
                </div>

                <div className="product__details">
                    <div className="product__rating" role="img" aria-label={`Calificación del producto: ${displayedRating} de 5 estrellas.`}>
                        {Array(displayedRating).fill().map((_, i) => (
                            <img key={`star-${i}`} src={StarIcon} alt="" aria-hidden="true" className="star-icon" />
                        ))}
                        <span className="product-recommended-text">{ratingText}</span>
                    </div>
                    <h1 className="product__name">{product.name}</h1>

                    {/* Selector de colores */}
                    {product.colors && product.colors.length > 0 && (
                        <div role="radiogroup" aria-labelledby="color-selection-label">
                            <p id="color-selection-label">
                                <strong>Color:</strong> <span id="color-seleccionado">{selectedColor}</span>
                            </p>
                            <div className="product__colors">
                                {product.colors.map((color) => (
                                    <button
                                        key={color.name}
                                        className={`color-selector ${selectedColor === color.name ? 'active' : ''}`}
                                        onClick={() => handleColorSelect(color.name, color.image)}
                                        aria-label={`Seleccionar color ${color.name}`}
                                        role="radio"
                                        aria-checked={selectedColor === color.name}
                                        title={color.name}
                                    >
                                        {color.image ? (
                                            <img src={color.image} alt={color.name} />
                                        ) : (
                                            color.hex ? <span style={{ backgroundColor: color.hex, width: '100%', height: '100%', display: 'block', borderRadius: '0.3rem' }}></span> :
                                                <span className="color-placeholder">{color.name.substring(0, 1)}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Selector de tallas */}
                    {product.sizes && product.sizes.length > 0 ? (
                        <div role="radiogroup" aria-labelledby="size-selection-label">
                            <p id="size-selection-label">
                                <strong>Talla:</strong> <span id="talla-seleccionada">{selectedSize}</span>
                            </p>
                            <div className="product__sizes">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        className={`size-selector ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => handleSizeSelect(size)}
                                        aria-label={`Seleccionar talla ${size}`}
                                        role="radio"
                                        aria-checked={selectedSize === size}
                                        title={size}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Solo muestra "Talla: Única" si no hay tallas disponibles en las variantes
                        <p><strong>Talla:</strong> Única</p>
                    )}

                    <p className="product__stock" aria-live="polite">
                        Stock disponible: <span id="stock-disponible">{currentVariantStock} unidad{currentVariantStock !== 1 ? 'es' : ''}</span> ({currentVariantStock} disponible{currentVariantStock !== 1 ? 's' : ''})
                    </p>

                    <p className="product__return">
                        <strong>Devolución gratis:</strong> Tienes 30 días desde que lo recibes para solicitar una devolución.
                        <Link to="/preguntas-frecuentes">Conocer más</Link>
                    </p>
                </div>

                <div className="product__actions">
                    <div className="product__favorite">
                        <button
                            className="btn-favorite"
                            aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                            onClick={handleHeartClick}
                            // Deshabilitar el botón de favoritos si no hay una variante seleccionada
                            disabled={hasVariants && (!selectedColor || (product.sizes.length > 0 && !selectedSize))}
                        >
                            <img src={isFavorite ? HeartFilledIcon : HeartIcon} alt="" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="product__price" role="status" aria-live="polite">
                        <p>
                            <span className="product__price-unit" aria-label={`Precio actual: ${formatCurrency(product.newPrice)}`}>{formatCurrency(product.newPrice)}</span>
                            <br />
                            {product.oldPrice && <del aria-label={`Precio anterior: ${formatCurrency(product.oldPrice)}`}>{formatCurrency(product.oldPrice)}</del>}
                            {product.discount && <span className="product__price-discount" aria-label={`Descuento de ${product.discount}`}>{product.discount}</span>}
                        </p>
                    </div>

                    <div className="product__buttons">
                        <button className="btn btn-primary" onClick={handleBuyNow} disabled={isAddToCartDisabled}>Comprar Ahora</button>
                        <button
                            className="btn btn-warning"
                            onClick={handleAddToCart}
                            disabled={isAddToCartDisabled}
                        >
                            Agregar al carrito
                        </button>
                    </div>

                    <div className="product__quantity">
                        <button type="button" className="qty-btn qty-decrease" onClick={() => handleQuantityChange('decrease')} aria-label="Disminuir cantidad">
                            <img src={MinusIcon} alt="" aria-hidden="true" />
                        </button>
                        <input
                            type="number"
                            id="cantidad"
                            name="cantidad"
                            min="1"
                            max={currentVariantStock}
                            value={quantity}
                            readOnly
                            aria-label={`Cantidad seleccionada: ${quantity}`}
                            aria-live="polite"
                        />
                        <button type="button" className="qty-btn qty-increase" onClick={() => handleQuantityChange('increase')} aria-label="Aumentar cantidad">
                            <img src={PlusIcon} alt="" aria-hidden="true" />
                        </button>
                    </div>

                    <p className="product__extra">
                        <Link to="/preguntas-frecuentes">Compra protegida</Link>, recibe el producto que esperabas o te devolvemos tu dinero.
                    </p>
                </div>
            </section>

            <section className="product-detail-info">
                <div className="product-detail-info__tabs" role="tablist" aria-label="Información del producto">
                    <button
                        id="description-tab"
                        role="tab"
                        aria-controls="description-panel"
                        aria-selected={activeTab === 'description'}
                        className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
                        onClick={() => setActiveTab('description')}
                    >
                        Descripción detallada
                    </button>
                    <button
                        id="features-tab"
                        role="tab"
                        aria-controls="features-panel"
                        aria-selected={activeTab === 'features'}
                        className={`tab-button ${activeTab === 'features' ? 'active' : ''}`}
                        onClick={() => setActiveTab('features')}
                    >
                        Características
                    </button>
                    <button
                        id="guide-tab"
                        role="tab"
                        aria-controls="guide-panel"
                        aria-selected={activeTab === 'guide'}
                        className={`tab-button ${activeTab === 'guide' ? 'active' : ''}`}
                        onClick={() => setActiveTab('guide')}
                    >
                        Guía de tallas
                    </button>
                </div>

                <div className="product-detail-info__content">
                    {activeTab === 'description' && (
                        <div id="description-panel" role="tabpanel" aria-labelledby="description-tab" className="tab-pane">
                            <h3>Descripción del producto</h3>
                            <p>{product.description}</p>
                        </div>
                    )}

                    {activeTab === 'features' && (
                        <div id="features-panel" role="tabpanel" aria-labelledby="features-tab" className="tab-pane">
                            <h3>Características principales</h3>
                            <ul>
                                {product.features && product.features.length > 0 ? (
                                    product.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))
                                ) : (
                                    <li>No hay características disponibles para este producto.</li>
                                )}
                            </ul>
                        </div>
                    )}

                    {activeTab === 'guide' && (
                        <div id="guide-panel" role="tabpanel" aria-labelledby="guide-tab" className="tab-pane">
                            <h3>Guía de tallas</h3>
                            {product.sizes && product.sizes.length > 0 ? (
                                <div>
                                    <h4>Tallas disponibles para este producto:</h4>
                                    <ul>
                                        {product.sizes.map((size, index) => (
                                            <li key={`guide-size-${index}`}>{size}</li>
                                        ))}
                                    </ul>
                                    <p>Por favor, selecciona una talla para ver la disponibilidad exacta.</p>
                                </div>
                            ) : (
                                <p>Este producto no tiene tallas específicas. Es de talla única.</p>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default ProductDetail;