// src/components/Footer/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    // Contenedor principal del pie de página
    <footer className="footer-blessing">
      {/* Contenedor de las secciones principales del pie de página */}
      <div className="footer-blessing__container">
        {/* Sección de la marca (logo y título) */}
        <section className="footer-blessing__brand">
          <div className="footer-blessing__logo-title">
            <img src="/src/assets/img/img-blessing-store.png" alt="Logo Blessing Store" className="footer-blessing__logo" />
            <p className="footer-blessing__title">Blessing Store</p>
          </div>
        </section>

        {/* Sección de la misión de la tienda */}
        <section className="footer-blessing__mission">
          <h4>Nuestra Misión</h4>
          <p>En Blessing Store, nuestra misión es ofrecerte una cuidada selección de productos únicos y de alta calidad que no solo complementen tu estilo personal, sino que también te hagan sentir especial y seguro de ti mismo en cada ocasión.</p>
        </section>

        {/* Sección de redes sociales */}
        <section className="footer-blessing__social">
          <h4>Síguenos</h4>
          <div className="footer-blessing__social-icons">
            {/* Enlace a Facebook */}
            <a href="https://www.facebook.com/" className="footer-blessing__icon-link" target="_blank" rel="noopener noreferrer"><img src="/src/assets/img/icon-facebook.svg" alt="Facebook" /></a>
            {/* Enlace a Instagram */}
            <a href="https://www.instagram.com/" className="footer-blessing__icon-link" target="_blank" rel="noopener noreferrer"><img src="/src/assets/img/icon-instagram.svg" alt="Instagram" /></a>
            {/* Enlace a YouTube */}
            <a href="https://www.youtube.com/" className="footer-blessing__icon-link" target="_blank" rel="noopener noreferrer"><img src="/src/assets/img/icon-youtube.svg" alt="YouTube" /></a>
            {/* Enlace a X (Twitter) */}
            <a href="https://x.com/" className="footer-blessing__icon-link" target="_blank" rel="noopener noreferrer"><img src="/src/assets/img/icon-x.svg" alt="X (Twitter)" /></a>
          </div>
        </section>
      </div>

      {/* Separador visual entre secciones */}
      <div className="footer-blessing__links-separator"></div>

      {/* Enlaces de navegación en la parte inferior del pie de página */}
      <div className="footer-blessing__bottom-links">
        <Link to="/sobre-nosotros">Sobre nosotros</Link>
        <Link to="/contacto">Contacto</Link>
        <Link to="/preguntas-frecuentes">Preguntas Frecuentes</Link>
        <Link to="/politicas-privacidad">Políticas de Privacidad</Link>
        <Link to="/terminos-condiciones">Términos y Condiciones</Link>
      </div>

      {/* Información de derechos de autor y créditos */}
      <div className="footer-blessing__copyright-info">
        <p>© 2025 Blessing Store - Todos los derechos reservados.</p>
        <p>Hecho en React con ❤ por Jhon Dairo</p>
        <p>Envíos a todo el país.</p>
      </div>
    </footer>
  );
}

export default Footer;