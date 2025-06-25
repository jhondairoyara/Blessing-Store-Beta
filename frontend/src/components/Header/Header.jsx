// src/components/Header/Header.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import CartIcon from '../CartIcon/CartIcon.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useFavorites } from '../../context/FavoritesContext.jsx';

// Importación de imágenes estáticas
import blessingStoreLogo from '../../assets/img/img-blessing-store.png';
import locationIcon from '../../assets/img/icon-location.svg';
import searchIcon from '../../assets/img/icon-search.svg';
import arrowRightIcon from '../../assets/img/icon-arrow-right.svg';
import notificationIconLight from '../../assets/img/icon-notification-light.svg';
import userIcon from '../../assets/img/icon-user.svg';

function Header() {
    // Hooks de autenticación y favoritos
    const { isLoggedIn, user, logout, token, updateUserContext } = useAuth();
    const { favorites } = useFavorites();

    // Hook para navegación programática
    const navigate = useNavigate();

    // --- Estados para la gestión de Ubicación ---
    const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
    const [selectedDepartmentName, setSelectedDepartmentName] = useState('');
    const [selectedMunicipioId, setSelectedMunicipioId] = useState('');
    const [selectedMunicipioName, setSelectedMunicipioName] = useState('');
    const [displayLocation, setDisplayLocation] = useState('Cargando ubicación...');
    const [isLocationFormVisible, setIsLocationFormVisible] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [loadingDepartments, setLoadingDepartments] = useState(true);
    const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [locationUpdateMessage, setLocationUpdateMessage] = useState({ type: '', text: '' });

    // Ref para evitar recargas innecesarias de municipios
    const loadedDepartmentIdRef = useRef(null);

    // --- Estados para otras funcionalidades del Header ---
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Estado para el valor del input de búsqueda
    const [searchInputValue, setSearchInputValue] = useState('');

    // URL base de la API
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    // --- EFECTOS Y LLAMADAS A LA API ---

    // Función utilitaria para fetching de datos desde la API
    const fetchDataFromApi = useCallback(async (url, transformData = (data) => data, errorSetter, loadingSetter) => {
        loadingSetter(true);
        errorSetter(null);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            const result = await response.json();
            let dataToSet = [];
            if (typeof result === 'object' && result !== null && Array.isArray(result.data)) {
                dataToSet = result.data;
            } else if (Array.isArray(result)) {
                dataToSet = result;
            } else {
                throw new Error("La respuesta de la API no es un array válido, ni un objeto con 'data'.");
            }
            return transformData(dataToSet);
        } catch (error) {
            console.error(`Error al cargar datos de ${url}:`, error);
            errorSetter(`No se pudieron cargar los datos de ubicación: ${error.message}.`);
            return [];
        } finally {
            loadingSetter(false);
        }
    }, []);

    // Efecto para cargar la ubicación del usuario logueado o establecer valores iniciales
    useEffect(() => {
        if (isLoggedIn && user) {
            if (user.Id_Departamento && user.Nombre_Departamento) {
                setSelectedDepartmentId(String(user.Id_Departamento));
                setSelectedDepartmentName(user.Nombre_Departamento);
            } else {
                setSelectedDepartmentId('');
                setSelectedDepartmentName('');
            }

            if (user.Id_Ciudad && user.Nombre_Ciudad) {
                setSelectedMunicipioId(String(user.Id_Ciudad));
                setSelectedMunicipioName(user.Nombre_Ciudad);
            } else {
                setSelectedMunicipioId('');
                setSelectedMunicipioName('');
            }
        } else {
            // Reinicia los estados de ubicación si el usuario no está logueado
            setSelectedDepartmentId('');
            setSelectedDepartmentName('');
            setSelectedMunicipioId('');
            setSelectedMunicipioName('');
        }
    }, [isLoggedIn, user]);

    // Efecto para obtener Departamentos al inicio o cuando se necesite recargar
    useEffect(() => {
        const loadDepartments = async () => {
            const fetchedDeps = await fetchDataFromApi(
                `${API_BASE_URL}/api/ubicaciones/departamentos`,
                (data) => data.map(dep => ({ id: String(dep.id), nombre: dep.nombre })),
                setLocationError,
                setLoadingDepartments
            );
            setDepartments(fetchedDeps);

            // Establece Cundinamarca/primer departamento como predeterminado si no hay ubicación de usuario
            if (!user?.Id_Departamento && fetchedDeps.length > 0 && selectedDepartmentId === '') {
                const cundinamarca = fetchedDeps.find(d => d.nombre === 'Cundinamarca');
                if (cundinamarca) {
                    setSelectedDepartmentId(cundinamarca.id);
                    setSelectedDepartmentName(cundinamarca.nombre);
                } else {
                    setSelectedDepartmentId(fetchedDeps[0].id);
                    setSelectedDepartmentName(fetchedDeps[0].nombre);
                }
            }
        };
        // Carga departamentos si la lista está vacía, o si el usuario logueado tiene una ubicación diferente a la actual
        if (departments.length === 0 || (isLoggedIn && user && user.Id_Departamento && selectedDepartmentId !== String(user.Id_Departamento)) || (!isLoggedIn && selectedDepartmentId === '')) {
            loadDepartments();
        }
    }, [API_BASE_URL, departments.length, loadingDepartments, fetchDataFromApi, user, isLoggedIn, selectedDepartmentId]);

    // Efecto para obtener Municipios cuando el departamento seleccionado cambie
    useEffect(() => {
        const currentDepartmentId = selectedDepartmentId;

        const loadMunicipalities = async () => {
            if (!currentDepartmentId) {
                setMunicipalities([]);
                loadedDepartmentIdRef.current = null;
                return;
            }

            // Evita recargar municipios si el departamento no ha cambiado
            if (currentDepartmentId !== loadedDepartmentIdRef.current) {
                setMunicipalities([]);
                setLocationError(null);
                setSelectedMunicipioId('');
                setSelectedMunicipioName('');

                try {
                    const fetchedMuns = await fetchDataFromApi(
                        `${API_BASE_URL}/api/ubicaciones/municipios?departamentoId=${encodeURIComponent(currentDepartmentId)}`,
                        (data) => data.map(mun => ({ id: String(mun.id), nombre: mun.nombre })),
                        setLocationError,
                        setLoadingMunicipalities
                    );
                    setMunicipalities(fetchedMuns);
                    loadedDepartmentIdRef.current = currentDepartmentId;
                } catch (error) {
                    console.error('Error al cargar municipios para el departamento:', error);
                    loadedDepartmentIdRef.current = null;
                }
            }
        };

        // Pequeño retardo para evitar llamadas excesivas al cambiar rápidamente de departamento
        const handler = setTimeout(() => {
            loadMunicipalities();
        }, 100);

        return () => clearTimeout(handler); // Limpia el temporizador en el unmount o si el efecto se ejecuta de nuevo
    }, [API_BASE_URL, selectedDepartmentId, fetchDataFromApi]);

    // Efecto para establecer el municipio predeterminado (Bogotá) o el del usuario si aplica
    useEffect(() => {
        // Si el usuario está logueado y tiene una ciudad en el departamento actual
        if (isLoggedIn && user?.Id_Ciudad && municipalities.length > 0 && String(user.Id_Departamento) === selectedDepartmentId && selectedMunicipioId === '') {
            const userCity = municipalities.find(m => String(m.id) === String(user.Id_Ciudad));
            if (userCity) {
                setSelectedMunicipioId(userCity.id);
                setSelectedMunicipioName(userCity.nombre);
                return;
            }
        }

        // Si el departamento es Cundinamarca y no hay municipio seleccionado, selecciona Bogotá
        if (selectedDepartmentName === 'Cundinamarca' && municipalities.length > 0 && selectedMunicipioId === '') {
            const bogota = municipalities.find(m => m.nombre === 'Bogotá');
            if (bogota) {
                setSelectedMunicipioId(bogota.id);
                setSelectedMunicipioName(bogota.nombre);
            }
        }
    }, [isLoggedIn, user, selectedDepartmentId, selectedDepartmentName, municipalities, selectedMunicipioId]);

    // Efecto para actualizar el texto visible de la ubicación
    useEffect(() => {
        if (selectedMunicipioName && selectedDepartmentName) {
            setDisplayLocation(`${selectedMunicipioName}, ${selectedDepartmentName}`);
        } else if (selectedDepartmentName) {
            setDisplayLocation(selectedDepartmentName);
        } else if (!loadingDepartments && !locationError && departments.length === 0) {
            setDisplayLocation('Ingresa tu ubicación');
        } else if (loadingDepartments) {
            setDisplayLocation('Cargando ubicación...');
        } else if (locationError) {
            setDisplayLocation('Error de ubicación');
        }
    }, [selectedDepartmentName, selectedMunicipioName, loadingDepartments, locationError, departments.length]);

    // Efecto para obtener las categorías de productos
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/categorias`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setCategories(Array.isArray(result) ? result : (Array.isArray(result.data) ? result.data : []));
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories([]);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, [API_BASE_URL]);

    // --- Handlers de Eventos para Ubicación ---

    // Maneja el cambio de selección de departamento
    const handleDepartmentChange = (e) => {
        const departmentId = e.target.value;
        const departmentName = e.target.options[e.target.selectedIndex].text;
        setSelectedDepartmentId(departmentId);
        setSelectedDepartmentName(departmentName);
        setSelectedMunicipioId(''); // Resetea el municipio al cambiar de departamento
        setSelectedMunicipioName('');
        setMunicipalities([]); // Limpia la lista de municipios
        loadedDepartmentIdRef.current = null; // Reinicia la referencia del departamento cargado
    };

    // Maneja el cambio de selección de municipio
    const handleMunicipioChange = (e) => {
        const municipioId = e.target.value;
        const municipioName = e.target.options[e.target.selectedIndex].text;
        setSelectedMunicipioId(municipioId);
        setSelectedMunicipioName(municipioName);
    };

    // Maneja el envío del formulario de actualización de ubicación
    const handleLocationUpdateSubmit = async (e) => {
        e.preventDefault();
        setLocationUpdateMessage({ type: '', text: '' }); // Limpia mensajes anteriores

        if (!selectedMunicipioId || !selectedDepartmentId) {
            setLocationUpdateMessage({ type: 'error', text: 'Por favor, selecciona un departamento y una ciudad válidos.' });
            return;
        }

        const payload = {
            Id_Ciudad: selectedMunicipioId ? parseInt(selectedMunicipioId, 10) : null
        };

        if (!user || !token) {
            setLocationUpdateMessage({ type: 'error', text: 'No estás autenticado o faltan datos de usuario para actualizar.' });
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/usuarios/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    logout(); // Cierra sesión si el token no es válido
                    setLocationUpdateMessage({ type: 'error', text: 'Sesión expirada. Por favor, inicia sesión de nuevo.' });
                    return;
                }
                throw new Error(data.message || data.error || 'Error al actualizar la ubicación.');
            }

            setLocationUpdateMessage({ type: 'success', text: data.message || 'Ubicación actualizada exitosamente.' });
            setIsLocationFormVisible(false); // Cierra el formulario al éxito

            // Actualiza el contexto del usuario con la nueva ubicación
            if (data.user) {
                updateUserContext(data.user);
            } else {
                updateUserContext(prevUser => ({
                    ...prevUser,
                    Id_Ciudad: payload.Id_Ciudad,
                    Id_Departamento: selectedDepartmentId ? parseInt(selectedDepartmentId, 10) : null,
                    Nombre_Ciudad: selectedMunicipioName,
                    Nombre_Departamento: selectedDepartmentName
                }));
            }

        } catch (error) {
            console.error('Error al actualizar ubicación desde Header:', error);
            setLocationUpdateMessage({ type: 'error', text: error.message || 'Error al actualizar la ubicación.' });
        }
    };

    // Alterna la visibilidad del formulario de ubicación
    const toggleLocationFormVisibility = () => {
        setIsLocationFormVisible(!isLocationFormVisible);
        setLocationUpdateMessage({ type: '', text: '' }); // Limpia mensajes
        setLocationError(null); // Limpia errores
    };

    // --- Handler para el formulario de búsqueda ---
    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Evita la recarga de la página
        if (searchInputValue.trim()) { // Si el campo de búsqueda no está vacío
            // Redirige a la página de resultados con el término de búsqueda
            navigate(`/search-results?search=${encodeURIComponent(searchInputValue.trim())}`);
        }
    };

    return (
        <header>
            {/* Primera sección del Header: Logo y Selector de Ubicación */}
            <section className="header__first-section">
                {/* Contenedor del logo y título de la tienda */}
                <div className="header__logo-title">
                    <div className="header__logo">
                        <Link to="/">
                            <img src={blessingStoreLogo} alt="Logo: Blessing Store" />
                        </Link>
                    </div>
                    <div className="header__title">
                        <Link to="/">Blessing Store</Link>
                    </div>
                </div>

                {/* Componente de selección de ubicación (dropdown) */}
                <div
                    className="header__location dropdown"
                    onClick={toggleLocationFormVisibility}
                >
                    <img src={locationIcon} alt="Icon: Location" />
                    <p id="ubicacionTexto">{displayLocation}</p>

                    {/* Formulario de selección de ubicación visible condicionalmente */}
                    {isLocationFormVisible && (
                        <div
                            className={`location-form dropdown-menu ${isLocationFormVisible ? 'visible' : ''}`}
                            onClick={(e) => e.stopPropagation()} // Evita cerrar el dropdown al hacer clic dentro del formulario
                        >
                            <p className="location-title">Elige dónde recibir tus compras</p>
                            <p className="location-subtitle">Podrás ver costos y tiempos de entrega precisos en todo lo que busques.</p>

                            {/* Mensajes de éxito o error de actualización de ubicación */}
                            {locationUpdateMessage.text && (
                                <p className={`location-message ${locationUpdateMessage.type}`}>{locationUpdateMessage.text}</p>
                            )}
                            {locationError && (
                                <p className="location-error">{locationError}</p>
                            )}

                            {/* Selector de Departamento */}
                            <label htmlFor="departamento">Departamento</label>
                            <select
                                id="departamento"
                                name="departamento"
                                value={selectedDepartmentId}
                                onChange={handleDepartmentChange}
                                disabled={loadingDepartments}
                            >
                                <option value="" disabled>
                                    {loadingDepartments ? "Cargando departamentos..." : "Selecciona un departamento"}
                                </option>
                                {departments && departments.map((dep) => (
                                    <option key={dep.id} value={dep.id}>
                                        {dep.nombre}
                                    </option>
                                ))}
                            </select>

                            {/* Selector de Municipio */}
                            <label htmlFor="municipio">Municipio, capital o localidad</label>
                            <select
                                id="municipio"
                                name="municipio"
                                value={selectedMunicipioId}
                                onChange={handleMunicipioChange}
                                disabled={!selectedDepartmentId || loadingMunicipalities}
                            >
                                <option value="" disabled>
                                    {loadingMunicipalities ? "Cargando municipios..." : (selectedDepartmentId ? "Selecciona un municipio" : "Primero selecciona un departamento")}
                                </option>
                                {municipalities && municipalities.map((mun) => (
                                    <option key={mun.id} value={mun.id}>
                                        {mun.nombre}
                                    </option>
                                ))}
                            </select>

                            {/* Botón para aceptar y guardar la ubicación */}
                            <button
                                type="button"
                                className="location-submit"
                                onClick={handleLocationUpdateSubmit}
                                disabled={!selectedDepartmentId || !selectedMunicipioId}
                            >
                                Aceptar
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Segunda sección del Header: Barra de búsqueda y Navegación principal */}
            <section className="header__second-section">
                {/* Formulario de búsqueda */}
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <input
                        type="search"
                        id="search"
                        name="search"
                        placeholder="Busca lo que más deseas"
                        aria-label="Buscar productos"
                        value={searchInputValue}
                        onChange={(e) => setSearchInputValue(e.target.value)}
                    />
                    <button type="submit" aria-label="Buscar">
                        <img src={searchIcon} alt="Buscar" />
                    </button>
                </form>

                {/* Navegación principal del Header */}
                <nav>
                    <ul>
                        {/* Dropdown de Categorías */}
                        <li className="dropdown">
                            <button id="categoryToggle" className="dropdown-toggle">
                                Categorías
                            </button>
                            <ul id="categoryMenu" className="dropdown-menu">
                                {loadingCategories ? (
                                    <li><p className="loading-message">Cargando categorías...</p></li>
                                ) : (
                                    categories && categories.length > 0 ? (
                                        categories.map((cat) => (
                                            <li key={cat.Id_Categoria || cat.id}>
                                                <Link to={`/categorias/${(cat.Nombre_Cat || cat.nombre).toLowerCase().replace(/\s/g, '-')}`}>
                                                    {cat.Nombre_Cat || cat.nombre}
                                                </Link>
                                            </li>
                                        ))
                                    ) : (
                                        <li><p className="no-categories-message">No hay categorías disponibles.</p></li>
                                    )
                                )}
                            </ul>
                        </li>

                        {/* Dropdown de Mis compras */}
                        <li className="dropdown">
                            <button className="dropdown-toggle">
                                Mis compras
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link to="/en-construccion">Mis Pedidos</Link></li>
                                <li><Link to="/en-construccion">Ultimos Pedidos</Link></li>
                                <li><Link to="/en-construccion">Comprobantes</Link></li>
                                <li><Link to="/contacto">Soporte</Link></li>
                            </ul>
                        </li>

                        {/* Dropdown de Favoritos */}
                        <li className="dropdown">
                            <button className="dropdown-toggle">Favoritos</button>
                            <ul className="dropdown-menu">
                                <li>
                                    <Link to="/favoritos">
                                        Mis Favoritos
                                        {favorites.length > 0 && <span className="favorites-count"> ({favorites.length})</span>}
                                    </Link>
                                </li>
                                <li><Link to="/en-construccion">Próximamente</Link></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </section>

            {/* Tercera sección del Header: Acceso de usuario, Notificaciones y Carrito */}
            <section className="header__third-section">
                {/* Enlace de acceso o perfil de usuario (condicional según estado de autenticación) */}
                {isLoggedIn ? (
                    <Link to="/profile" id="access" className="header__user-info">
                        Cuenta
                        <img src={userIcon} alt="Icono: Cuenta de usuario" />
                    </Link>
                ) : (
                    <Link to="/login" id="access">
                        Acceder
                        <img src={arrowRightIcon} alt="Icono: Flecha a la derecha" />
                    </Link>
                )}

                {/* Enlace a Notificaciones */}
                <Link to="/notifications">
                    <img src={notificationIconLight} alt="Icono: Notificación" />
                </Link>

                {/* Componente del icono del carrito de compras */}
                <CartIcon />
            </section>
        </header>
    );
}

export default Header;