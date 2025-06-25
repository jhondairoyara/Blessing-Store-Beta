// src/pages/NotFoundPage/NotFoundPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

// Página mostrada cuando una ruta no es encontrada.
function NotFoundPage() {
  return (
    <div className="not-found-page">
      <h1 className="not-found-title">404 - ¡Recurso no encontrado!</h1>
      <p className="not-found-message">
        Parece que la página que buscas no existe o ha sido movida.
      </p>
      <Link to="/" className="explore-button">
        Seguir explorando
      </Link>
    </div>
  );
}

export default NotFoundPage;