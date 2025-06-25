// src/pages/InformativePages/PoliticasPrivacidadPage.jsx

import React from 'react';
import './PoliticasPrivacidadPage.css'; // Asegúrate de que la ruta sea correcta

const PoliticasPrivacidadPage = () => {
  return (
    <div className="privacy-page-container">
      <h1 className="privacy-page-title">Política de Privacidad</h1>

      <section className="privacy-section">
        <h2 className="privacy-subtitle">1. Introducción</h2>
        <p className="section-paragraph">
          En Blessing Store, nos comprometemos a proteger su privacidad y a manejar sus datos personales de manera transparente y segura. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos la información que usted nos proporciona al utilizar nuestro sitio web y servicios.
        </p>
        <p className="section-paragraph">
          Al utilizar nuestros servicios, usted acepta la recopilación y el uso de su información de acuerdo con esta política. Le recomendamos leerla detenidamente.
        </p>
      </section>

      <hr className="section-separator" />

      <section className="privacy-section">
        <h2 className="privacy-subtitle">2. Información que Recopilamos</h2>
        <p className="section-paragraph">
          Recopilamos diferentes tipos de información para proporcionarle y mejorar nuestros servicios:
        </p>
        <ul className="info-list">
          <li>
            <strong>Información personal identificable:</strong> Incluye datos como su nombre, dirección de correo electrónico, dirección de envío, número de teléfono y detalles de pago. Recopilamos esta información cuando usted realiza una compra, se registra en nuestro sitio, próximamente cuando se suscriba a nuestro boletín o se pone en contacto con nosotros.
          </li>
          <li>
            <strong>Información de uso:</strong> Recopilamos automáticamente información sobre cómo accede y utiliza el sitio web. Esto puede incluir su dirección IP, tipo de navegador, páginas visitadas, hora y fecha de su visita, y otros datos de diagnóstico.
          </li>
          <li>
            <strong>Datos de cookies y tecnologías similares:</strong> Utilizamos cookies y tecnologías de seguimiento para rastrear la actividad en nuestro servicio y mantener cierta información. Las cookies son pequeños archivos de datos que se almacenan en su dispositivo.
          </li>
        </ul>
      </section>

      <hr className="section-separator" />

      <section className="privacy-section">
        <h2 className="privacy-subtitle">3. Cómo Utilizamos Su Información</h2>
        <p className="section-paragraph">
          Utilizamos la información recopilada para diversos fines, principalmente para operar, mantener y mejorar nuestros servicios, y para ofrecerle una mejor experiencia. Nos apoyamos en las siguientes tecnologías para gestionar y proteger sus datos:
        </p>
        <ul className="tech-list">
          <li>
            <p>
              Almacenamiento de Datos: Guardamos de forma segura la información de su cuenta, detalles de pedidos y preferencias. Esto nos permite procesar sus transacciones y personalizar su experiencia en nuestra tienda.
            </p>
          </li>
          <li>
            <p>
              Gestión de Sesiones y Preferencias: Empleamos herramientas que nos permiten recordar sus configuraciones y mantener su sesión activa. Esto nos ayuda a entender cómo interactúa con nuestro sitio y mejora su navegación general.
            </p>
          </li>
          <li>
            <p>
              Seguridad de la Información: Sus contraseñas se almacenan de manera encriptada para protegerlas. Para autenticar a los usuarios, usamos métodos seguros que verifican su identidad y protegen su información personal.
            </p>
          </li>
          <li>
            <p>
              Comunicación y Estabilidad de la Plataforma:
              <ul className="sub-tech-list">
                <li>Aseguramos una comunicación segura y controlada entre las diferentes partes de nuestra plataforma.</li>
                <li>Administramos las configuraciones sensibles de nuestro sistema para mantener sus datos protegidos.</li>
                <li>Utilizamos una estructura que nos permite construir servicios robustos y eficientes para manejar sus solicitudes.</li>
                <li>Validamos los datos que usted nos proporciona para asegurar la integridad de la información que procesamos.</li>
              </ul>
            </p>
          </li>
        </ul>
        <p className="section-paragraph">
          Su información también nos ayuda a:
        </p>
        <ul className="info-list">
          <li>Procesar sus transacciones y gestionar sus pedidos.</li>
          <li>Personalizar su experiencia y ofrecerle contenido y productos relevantes.</li>
          <li>Mejorar nuestro sitio web, productos y servicios.</li>
          <li>Comunicarnos con usted sobre su cuenta o pedidos, o para fines de marketing (con su consentimiento).</li>
          <li>Detectar, prevenir y abordar problemas técnicos o de seguridad.</li>
        </ul>
      </section>

      <hr className="section-separator" />

      <section className="privacy-section">
        <h2 className="privacy-subtitle">4. Compartir Su Información</h2>
        <p className="section-paragraph">
          No vendemos, alquilamos ni comercializamos su información personal identificable con terceros. Podemos compartir su información con:
        </p>
        <ul className="info-list">
          <li>
            <strong>Proveedores de Servicios:</strong> Terceros que nos ayudan a operar nuestro negocio (por ejemplo, procesamiento de pagos, servicios de envío, análisis de datos). Estos terceros solo tienen acceso a la información necesaria para realizar sus funciones y están obligados a mantenerla confidencial.
          </li>
          <li>
            <strong>Cumplimiento Legal:</strong> Cuando la ley lo exija o en respuesta a solicitudes válidas de autoridades públicas (por ejemplo, un tribunal o una agencia gubernamental).
          </li>
        </ul>
      </section>

      <hr className="section-separator" />

      <section className="privacy-section">
        <h2 className="privacy-subtitle">5. Seguridad de Sus Datos</h2>
        <p className="section-paragraph">
          La seguridad de su información es primordial para nosotros. Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos contra el acceso no autorizado, la divulgación, la alteración o la destrucción. Sin embargo, ninguna transmisión de datos por internet o método de almacenamiento electrónico es 100% seguro. Aunque nos esforzamos por proteger su información, no podemos garantizar su seguridad absoluta.
        </p>
      </section>

      <hr className="section-separator" />

      <section className="privacy-section">
        <h2 className="privacy-subtitle">6. Sus Derechos de Protección de Datos</h2>
        <p className="section-paragraph">
          Usted tiene derechos sobre sus datos personales, incluyendo el derecho a acceder, corregir, actualizar o solicitar la eliminación de su información. Para ejercer estos derechos, por favor, contáctenos a través de los canales proporcionados en nuestra página de <a href="/contacto" className="contact-link">Contacto</a>.
        </p>
      </section>

      <hr className="section-separator" />

      <section className="privacy-section">
        <h2 className="privacy-subtitle">7. Cambios en Esta Política de Privacidad</h2>
        <p className="section-paragraph">
          Podemos actualizar nuestra Política de Privacidad periódicamente. Le notificaremos cualquier cambio publicando la nueva política en esta página y actualizando la "última fecha de actualización" en la parte superior. Le recomendamos revisar esta Política de Privacidad regularmente para cualquier cambio.
        </p>
        <p className="section-paragraph">
          Última actualización: 13 de Junio de 2025.
        </p>
      </section>

      <hr className="section-separator" />

      <section className="privacy-section last-privacy-section">
        <h2 className="privacy-subtitle">8. Contacto</h2>
        <p className="section-paragraph">
          Si tiene alguna pregunta sobre esta Política de Privacidad o sobre nuestras prácticas de datos, por favor, contáctenos en:
        </p>
        <p className="section-paragraph contact-info">
          Email: <a href="mailto:soporte@blessingstore.com" className="contact-link">soporte@blessingstore.com</a>
        </p>
      </section>
    </div>
  );
};

export default PoliticasPrivacidadPage;