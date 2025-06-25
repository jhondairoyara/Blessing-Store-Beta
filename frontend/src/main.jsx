// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './assets/styles/globals.css';
import './assets/styles/fonts.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Renderiza la aplicación React en el elemento 'root' del DOM.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Enrutador principal de React Router DOM */}
    <BrowserRouter>
      {/* Provee el estado de autenticación a toda la aplicación */}
      <AuthProvider>
        {/* Gestiona el estado del carrito de compras */}
        <CartProvider>
          {/* Gestiona el estado de los productos favoritos */}
          <FavoritesProvider>
            {/* Componente principal de la aplicación con rutas */}
            <App />
            
            {/* Contenedor global para mostrar notificaciones Toastify */}
            <ToastContainer
              position="top-right" // Posición de las notificaciones.
              autoClose={5000}     // Tiempo en ms para cierre automático.
              hideProgressBar={false} // Muestra/oculta la barra de progreso.
              newestOnTop={false}   // Las notificaciones nuevas aparecen al final.
              closeOnClick          // Cierra la notificación al hacer clic.
              rtl={false}           // Soporte para diseño RTL.
              pauseOnFocusLoss      // Pausa el temporizador si la ventana pierde el foco.
              draggable             // Permite arrastrar las notificaciones.
              pauseOnHover          // Pausa el temporizador al pasar el ratón.
            />
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);