// src/App.jsx

import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Componentes y Páginas Globales/Comunes
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import ProductDetail from './pages/ProductDetail/ProductDetail.jsx';
import UnderConstructionPage from './pages/UnderConstructionPage/UnderConstructionPage.jsx';
import CartPage from './pages/CartPage/CartPage.jsx';
import AccessPage from './pages/AccessPage/AccessPage.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
import FavoriteProductsPage from './pages/FavoriteProductsPage/FavoriteProductsPage.jsx';
import SearchResultsPage from './pages/SearchResultsPage/SearchResultsPage.jsx';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.jsx';

// Importaciones de Páginas de Categoría
import HombresPage from './pages/Categories/HombresPage.jsx';
import MujeresPage from './pages/Categories/MujeresPage.jsx';
import NinosPage from './pages/Categories/NinosPage.jsx';
import BebesPage from './pages/Categories/BebesPage.jsx';

// Importaciones de Páginas Informativas
import SobreNosotrosPage from './pages/InformativePages/SobreNosotrosPage.jsx';
import ContactoPage from './pages/InformativePages/ContactoPage.jsx';
import PreguntasFrecuentesPage from './pages/InformativePages/PreguntasFrecuentesPage.jsx';
import PoliticasPrivacidadPage from './pages/InformativePages/PoliticasPrivacidadPage.jsx';
import TerminosCondicionesPage from './pages/InformativePages/TerminosCondicionesPage.jsx';


// Importaciones de Estilos CSS Globales/Componente
import './assets/styles/globals.css';
import './components/Header/Header.css';
import './components/Footer/Footer.css';
import './pages/HomePage/HomePage.css';
import './pages/ProductDetail/ProductDetail.css';
import './pages/CartPage/CartPage.css';
import './components/CartList/CartList.css';
import './components/CartItem/CartItem.css';
import './pages/AccessPage/AccessPage.css';
import './pages/ProfilePage/ProfilePage.css';
import './pages/NotFoundPage/NotFoundPage.css';


// Componente principal que define las rutas de la aplicación.
function App() {
  return (
    <AppRoutes />
  );
}

// Gestiona las rutas de la aplicación y la lógica de autenticación.
function AppRoutes() {
  const { isLoggedIn, loadingAuth } = useAuth();

  // Muestra un estado de carga mientras se verifica la autenticación.
  if (loadingAuth) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.5em',
        color: '#333'
      }}>
        Cargando autenticación...
      </div>
    );
  }

  return (
    <Routes>
      {/* Ruta para la página "En Construcción". */}
      <Route path="/en-construccion" element={<UnderConstructionPage />} />

      {/* Rutas de acceso (login/registro). */}
      <Route path="/login" element={<AccessPage />} />
      <Route path="/registro" element={<AccessPage />} />

      {/* Ruta padre que aplica el layout principal (Header + Footer) a sus hijos. */}
      <Route path="/*" element={<MainLayout />}>
        <Route index element={<HomePage />} /> {/* Ruta por defecto para "/" */}
        <Route path="search-results" element={<SearchResultsPage />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="favoritos" element={<FavoriteProductsPage />} />

        {/* Rutas para las páginas de categoría. */}
        <Route path="categorias/hombre" element={<HombresPage />} />
        <Route path="categorias/mujer" element={<MujeresPage />} />
        <Route path="categorias/niños/as" element={<NinosPage />} />
        <Route path="categorias/bebes" element={<BebesPage />} />

        {/* Rutas para las páginas informativas (Nuevas). */}
        <Route path="sobre-nosotros" element={<SobreNosotrosPage />} />
        <Route path="contacto" element={<ContactoPage />} />
        <Route path="preguntas-frecuentes" element={<PreguntasFrecuentesPage />} />
        <Route path="politicas-privacidad" element={<PoliticasPrivacidadPage />} />
        <Route path="terminos-condiciones" element={<TerminosCondicionesPage />} />

        {/* Ruta de perfil protegida por autenticación. */}
        <Route
          path="profile"
          element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" replace />}
        />
        
        {/* Ruta 404 para cualquier URL no coincidente dentro del MainLayout. */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

// Componente de layout que incluye el Header y Footer.
function MainLayout() {
  return (
    <>
      <Header />
      <main>
        {/* Renderiza el componente de la ruta anidada aquí. */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;