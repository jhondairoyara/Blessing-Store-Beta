// src/pages/UnderConstructionPage/UnderConstructionPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './UnderConstructionPage.css';

import underConstructionGraphic from '../../assets/img/icon-construction.svg';

const UnderConstructionPage = () => {
  return (
    <div className="under-construction-container">
      
      {/* Sección principal de encabezado */}
      <img
        src={underConstructionGraphic}
        alt="Sección en Construcción"
        className="under-construction-image"
      />
      <h1 className="under-construction-title">¡Estamos construyendo algo grandioso!</h1>
      <p className="under-construction-message">
        Nuestra web está recibiendo una gran actualización para ofrecerte la mejor experiencia.
        Agradecemos tu paciencia y te invitamos a volver pronto.
      </p>

      {/* Sección de botones de acción */}
      <div className="action-buttons">
        <Link to="/" className="btn-back-home">
          Volver a la página principal
        </Link>
      </div>

      {/* Texto de Copyright */}
      <p className="copyright-text">© 2025 Blessing Store - Todos los derechos reservados</p>
    </div>
  );
};

export default UnderConstructionPage;