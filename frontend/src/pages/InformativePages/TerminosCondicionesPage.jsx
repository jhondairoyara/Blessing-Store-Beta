// src/pages/InformativePages/TerminosCondicionesPage.jsx

import React from 'react';
import './TerminosCondicionesPage.css'; // Asegúrate de que la ruta sea correcta

const TerminosCondicionesPage = () => {
  return (
    <div className="terms-page-container">
      <h1 className="terms-page-title">Términos y Condiciones</h1>

      <section className="terms-section">
        <h2 className="terms-subtitle">1. Introducción y Aceptación</h2>
        <p className="section-paragraph">
          Bienvenido a Blessing Store. Al acceder y utilizar nuestro sitio web, productos y servicios, usted acepta y se compromete a cumplir con los presentes Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, le pedimos que no utilice nuestros servicios.
        </p>
        <p className="section-paragraph">
          Blessing Store se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Cualquier cambio será efectivo inmediatamente después de su publicación en el sitio web. Le recomendamos revisar esta sección periódicamente para estar al tanto de las actualizaciones.
        </p>
      </section>

      <hr className="section-separator" />

      <section className="terms-section">
        <h2 className="terms-subtitle">2. Uso del Sitio Web</h2>
        <p className="section-paragraph">
          El contenido de este sitio web es para su información general y uso personal. Queda prohibida la reproducción, distribución, modificación, exhibición, venta o cualquier otra explotación comercial sin el consentimiento previo y por escrito de Blessing Store.
        </p>
        <p className="section-paragraph">
          Usted se compromete a utilizar el sitio web de manera lícita, sin violar los derechos de terceros, la privacidad, la seguridad o cualquier otra normativa aplicable.
        </p>
      </section>

      <hr className="section-separator" />

      <section className="terms-section">
        <h2 className="terms-subtitle">3. Registro de Cuenta</h2>
        <p className="section-paragraph">
          Para acceder a ciertas funciones de nuestro sitio, puede ser necesario crear una cuenta. Usted es responsable de mantener la confidencialidad de su información de cuenta, incluyendo su contraseña, y de todas las actividades que ocurran bajo su cuenta.
        </p>
        <p className="section-paragraph">
          Debe notificarnos inmediatamente cualquier uso no autorizado de su cuenta. Blessing Store no será responsable de ninguna pérdida o daño derivado de su incumplimiento de esta obligación.
        </p>
      </section>

      <hr className="section-separator" />

      <section className="terms-section">
        <h2 className="terms-subtitle">4. Productos y Precios</h2>
        <p className="section-paragraph">
          Blessing Store se esfuerza por mostrar la información de productos de la manera más precisa posible, incluyendo descripciones, imágenes y precios. Sin embargo, no garantizamos que toda la información sea completamente libre de errores. En caso de errores en precios, nos reservamos el derecho de cancelar o rechazar cualquier pedido realizado bajo un precio incorrecto.
        </p>
        <p className="section-paragraph">
          Los precios de nuestros productos están sujetos a cambios sin previo aviso. Nos esforzamos por mantener actualizadas nuestras pasarelas de pago y opciones de compra para su comodidad.
        </p>
      </section>

      <hr className="section-separator" />

      <section className="terms-section">
        <h2 className="terms-subtitle">5. Propiedad Intelectual</h2>
        <p className="section-paragraph">
          Todo el contenido presente en este sitio web, incluyendo textos, gráficos, logotipos, iconos, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad de Blessing Store o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual.
        </p>
      </section>

      <hr className="section-separator" />

      <section className="terms-section">
        <h2 className="terms-subtitle">6. Limitación de Responsabilidad</h2>
        <p className="section-paragraph">
          Blessing Store no será responsable de ningún daño directo, indirecto, incidental, consecuencial o especial que resulte del uso o la imposibilidad de usar nuestros productos o servicios. Esto incluye, pero no se limita a, la pérdida de datos o beneficios, interrupción de negocio, o daños personales.
        </p>
      </section>

      <hr className="section-separator" />

      <section className="terms-section">
        <h2 className="terms-subtitle">7. Privacidad y Datos</h2>
        <p className="section-paragraph">
          La privacidad de sus datos es de suma importancia para nosotros. Recopilamos y utilizamos información de acuerdo con nuestra Política de Privacidad. Para mejorar su experiencia y el funcionamiento de nuestros servicios, utilizamos diversas tecnologías y bases de datos.
        </p>
        <p className="section-paragraph">
          Nuestra infraestructura tecnológica incluye el uso de:
          <ul className="tech-list">
            <li>
              Bases de Datos: Para el almacenamiento y gestión eficiente de la información de usuarios, productos y pedidos.
            </li>
            <li>
              Cookies: Empleamos cookies para gestionar sesiones de usuario y mejorar la experiencia de navegación, recordando sus preferencias y adaptando el contenido.
            </li>
            <li>
              Seguridad: Utilizamos tecnologias para el hash seguro de contraseñas y para la autenticación de usuarios, protegiendo así su información personal.
            </li>
          </ul>
          Estas herramientas, entre muchas otras, nos permiten ofrecerle un servicio seguro, personalizado y eficiente que usted acepta. Para más detalles sobre cómo manejamos sus datos, consulte nuestra <a href="/politica-privacidad" className="privacy-link">Política de Privacidad</a>.
        </p>
      </section>

      <hr className="section-separator" />

      <section className="terms-section last-terms-section">
        <h2 className="terms-subtitle">8. Ley Aplicable y Jurisdicción</h2>
        <p className="section-paragraph">
          Estos Términos y Condiciones se rigen e interpretan de acuerdo con las leyes de la República de Colombia. Cualquier disputa relacionada con el uso de Blessing Store estará sujeta a la jurisdicción exclusiva de los tribunales de Gigante, Huila, Colombia.
        </p>
      </section>
    </div>
  );
};

export default TerminosCondicionesPage;