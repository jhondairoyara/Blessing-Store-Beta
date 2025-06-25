// src/pages/InformativePages/ContactoPage.jsx

import React from 'react';
import './ContactoPage.css';

function ContactoPage() {
  return (
    <div className="contact-page-container">
      <h1 className="contact-page-title">Contáctanos: tu voz nos inspira</h1>

      {/* Sección de Introducción: Nuestra filosofía de conexión */}
      <section className="contact-section intro-section">
        <p className="section-paragraph">
          En Blessing Store, cada prenda es una historia, y cada cliente, parte de nuestra familia. Más allá de las tendencias, nuestro compromiso es tejer lazos duraderos contigo. Sabemos que el mundo digital puede parecer distante, por eso hemos cultivado un espacio donde la cercanía y la transparencia son el alma de cada interacción. Tu experiencia de compra no termina en el carrito; comienza una conversación auténtica.
        </p>
        <p className="section-paragraph">
          Operamos con la agilidad de lo digital, sin barreras geográficas, pero con la calidez del trato personal. Nuestro equipo de soporte no es un algoritmo, es un grupo de personas apasionadas listas para escucharte, guiarte y resolver cualquier inquietud. Desde el latido de un nuevo lanzamiento hasta el seguimiento de tu pedido o una sugerencia que ilumine nuestro camino: estamos aquí, siempre.
        </p>
      </section>

      <hr className="section-separator" /> {/* Línea separadora */}

      {/* Sección de Canales de Contacto Directo: Respuestas claras, atención real */}
      <section className="contact-section">
        <h2 className="contact-subtitle">Conecta directamente con nuestro equipo</h2>
        <p className="section-paragraph channel-description">
          Valoramos tu tiempo y tu confianza. Por eso, hemos optimizado nuestros canales para que tu comunicación sea siempre fluida y efectiva. Ya sea una duda sobre el ajuste perfecto de una prenda, el proceso de un cambio, o cualquier detalle sobre tu experiencia, nuestro equipo está listo para ofrecerte una respuesta clara y personalizada, sin demoras.
        </p>

        <div className="contact-details-group">
          <p className="contact-detail-item">
            <strong>Email para Consultas:</strong> <a href="mailto:soporte@blessingstore.com">soporte@blessingstore.com</a>
          </p>
          <p className="contact-detail-item">
            <strong>Atención por WhatsApp / Teléfono:</strong> <a href="tel:+573001234567">+57 300 123 4567</a>
          </p>
          <p className="contact-detail-item">
            <strong>Horario de Atención:</strong> Lunes a Viernes, de 9:00 AM a 6:00 PM (hora de Colombia). <br />
            ¿Nos escribes fuera de horario? No te preocupes, te responderemos al inicio del siguiente día hábil.
          </p>
          <p className="contact-detail-response-info">
            Tu tiempo es oro: el 85% de nuestros correos reciben respuesta en menos de 24 horas hábiles. ¡Nos esforzamos cada día por mejorar!
          </p>
        </div>
      </section>

      <hr className="section-separator" /> {/* Línea separadora */}

      {/* Sección de Formulario de Contacto: Envía tu mensaje con facilidad */}
      <section className="contact-section">
        <h2 className="contact-subtitle">¿Prefieres escribirnos aquí mismo?</h2>
        <p className="section-paragraph form-intro-text">
          Sabemos que cada consulta es única. Por eso, hemos diseñado este formulario para que nos cuentes tus inquietudes con total comodidad. Solo te pedimos que nos dejes tus datos correctos; así, garantizamos que nuestro equipo pueda darte una respuesta precisa y con la calidez que nos caracteriza. Cada mensaje es leído con detenimiento y tratado con la máxima prioridad.
        </p>
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Nombre Completo:</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Asunto:</label>
            <input type="text" id="subject" name="subject" placeholder="Ej: Duda sobre talla, seguimiento de mi pedido #BLS123" />
          </div>
          <div className="form-group">
            <label htmlFor="message">Mensaje:</label>
            <textarea id="message" name="message" rows="7" required placeholder="Describe aquí tu consulta o comparte tus ideas..."></textarea>
          </div>
          <button type="submit" className="submit-button">Enviar Mensaje</button>
        </form>
      </section>

      <hr className="section-separator" /> {/* Línea separadora */}

      {/* Sección de Información Administrativa: Claridad y transparencia operativa */}
      <section className="contact-section">
        <h2 className="contact-subtitle">Sede administrativa</h2>
        <p className="section-paragraph">
          En Blessing Store, hemos apostado por la eficiencia y flexibilidad de un modelo de negocio exclusivamente en línea. Esto nos permite invertir más en la calidad de nuestros productos y en la excelencia de tu experiencia digital. Por ello, es importante recordar que debes contactarnos de manera digital.
        </p>
        <p className="section-paragraph">
          Nuestra sede administrativa gestiona la logística, operaciones y correspondencia oficial. Si necesitas enviar documentos o realizar una devolución previamente autorizada, puedes hacerlo por medio de nuestro medios de comunicación.
        </p>
      </section>
    </div>
  );
}

export default ContactoPage;