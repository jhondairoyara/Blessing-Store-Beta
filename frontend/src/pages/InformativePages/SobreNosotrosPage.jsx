// src/pages/InformativePages/SobreNosotrosPage.jsx

import React from 'react';
import './SobreNosotrosPage.css';

const SobreNosotrosPage = () => {
  return (
    <div className="about-us-page-container">
      <h1 className="about-us-page-title">Sobre Nosotros</h1>

      <section className="about-us-section">
        <h2 className="about-us-subtitle">Nuestra Historia</h2>
        <p className="section-paragraph">
          Blessing Store nació de una pasión por la moda y el deseo de ofrecer prendas únicas y de alta calidad que empoderen a quienes las visten. Fundada en 2024, comenzamos como una pequeña boutique en línea, con la visión de crear un espacio donde cada cliente pudiera encontrar algo especial que reflejara su estilo personal.
        </p>
        <p className="section-paragraph">
          Desde nuestros humildes comienzos, hemos crecido gracias al apoyo de nuestra increíble comunidad. Cada colección es cuidadosamente seleccionada, buscando piezas que no solo sigan las últimas tendencias, sino que también ofrezcan comodidad y durabilidad.
        </p>
      </section>

      <hr className="section-separator" />

      <section className="about-us-section">
        <h2 className="about-us-subtitle">Nuestra Misión</h2>
        <p className="section-paragraph">
          En Blessing Store, nuestra misión es simple: inspirar confianza y celebrar la individualidad a través de la moda. Creemos que la ropa es una forma de expresión, y nos esforzamos por proporcionar una diversidad de estilos que se adapten a cada ocasión y personalidad.
        </p>
        <p className="section-paragraph">
          Nos comprometemos a ofrecer un servicio al cliente excepcional y a mantener una relación de cercanía con quienes confían en nosotros. Tu satisfacción es nuestra prioridad, y trabajamos constantemente para superar tus expectativas.
        </p>
      </section>

      <hr className="section-separator" />

      <section className="about-us-section">
        <h2 className="about-us-subtitle">Nuestros Valores</h2>
        <ul className="values-list">
          <li>
            <strong>Calidad:</strong> Seleccionamos cuidadosamente cada prenda para garantizar la mejor calidad y durabilidad.
          </li>
          <li>
            <strong>Autenticidad:</strong> Fomentamos la expresión personal y la autenticidad en cada estilo.
          </li>
          <li>
            <strong>Atención al Cliente:</strong> Ofrecemos un soporte dedicado y cercano para resolver todas tus dudas.
          </li>
          <li>
            <strong>Innovación:</strong> Nos mantenemos al día con las últimas tendencias para ofrecerte siempre lo más nuevo y relevante.
          </li>
        </ul>
        <p className="section-paragraph">
          Estos valores son el pilar de todo lo que hacemos en Blessing Store y guían cada una de nuestras decisiones.
        </p>
      </section>

      <hr className="section-separator" />

      <section className="about-us-section">
        <h2 className="about-us-subtitle">Únete a Nuestra Comunidad</h2>
        <p className="section-paragraph">
          Te invitamos a explorar nuestra colección y a formar parte de la familia Blessing Store. Síguenos en nuestras redes sociales para estar al tanto de las novedades, promociones y mucho más.
        </p>
        {/* Aquí podrías añadir enlaces a redes sociales si los tienes */}
        <p className="section-paragraph join-community-call-to-action">
          ¡Gracias por elegir Blessing Store!
        </p>
      </section>
    </div>
  );
};

export default SobreNosotrosPage;