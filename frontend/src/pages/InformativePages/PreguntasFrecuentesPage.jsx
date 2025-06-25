// src/pages/InformativePages/PreguntasFrecuentesPage.jsx

import React, { useState } from 'react';
import './PreguntasFrecuentesPage.css';

const PreguntasFrecuentesPage = () => {
  // Estado para controlar qué pregunta está abierta
  const [openQuestion, setOpenQuestion] = useState(null);

  // Función para alternar la visibilidad de la respuesta
  const toggleAnswer = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqs = [
    {
      question: "¿Cómo puedo realizar un pedido en Blessing Store?",
      answer: "Puedes navegar por nuestras colecciones, seleccionar los productos que te gusten, añadirlos al carrito y seguir los pasos de nuestro proceso de compra. Actualmente, estamos en proceso de mejora de nuestras pasarelas de pago, por lo que algunas opciones podrían estar limitadas. ¡Agradecemos tu paciencia!"
    },
    {
      question: "¿Cuáles son los métodos de pago disponibles?",
      answer: "Actualmente, aceptamos pagos a través de métodos seleccionados. Estamos trabajando activamente para integrar más opciones de pasarela de pagos y ofrecerte una experiencia de compra más fluida en el futuro cercano. Para conocer los métodos disponibles al momento de tu compra, por favor, revisa las opciones al finalizar tu pedido."
    },
    {
      question: "¿Cuál es el tiempo de envío de mi pedido?",
      answer: "El tiempo de envío varía según tu ubicación y el producto. Generalmente, los pedidos se procesan en 1-2 días hábiles y el envío toma entre 3 y 7 días hábiles adicionales. Te proporcionaremos un número de seguimiento una vez que tu pedido sea despachado para que puedas monitorear su estado."
    },
    {
      question: "¿Cómo puedo rastrear mi pedido?",
      answer: "Una vez que tu pedido sea enviado, recibirás un correo electrónico de confirmación con un número de seguimiento. Podrás usar este número en la página de nuestro socio de envíos para ver el estado de tu paquete."
    },
    {
      question: "¿Puedo modificar o cancelar mi pedido una vez realizado?",
      answer: "Si necesitas modificar o cancelar un pedido, por favor, contáctanos lo antes posible a través de nuestra página de Contacto. Haremos nuestro mejor esfuerzo para ayudarte antes de que el pedido sea procesado para envío, ya que una vez despachado, no podremos realizar cambios."
    },
    {
      question: "¿Cuál es vuestra política de devoluciones y cambios?",
      answer: "Aceptamos devoluciones y cambios dentro de los 30 días posteriores a la recepción de tu pedido, siempre que los productos estén en su estado original y sin usar. Para iniciar una devolución o cambio, por favor, visita nuestra sección de 'Política de Devoluciones' o contáctanos directamente."
    },
    {
      question: "¿Cómo puedo recuperar mi contraseña si la he olvidado?",
      answer: "Si has olvidado tu contraseña, por favor, no te preocupes. Por el momento, la función de recuperación automática no está completamente implementada. Te pedimos que te pongas en contacto directamente con nuestro equipo de soporte a través de la página de Contacto, y te ayudaremos a restablecerla de forma segura."
    },
    {
      question: "¿Ofrecen envíos internacionales?",
      answer: "Actualmente, nos enfocamos en envíos nacionales. Estamos explorando opciones para expandirnos internacionalmente en el futuro. Te invitamos a estar atento a nuestras actualizaciones."
    },
    {
      question: "¿Cómo puedo contactar con el servicio de atención al cliente?",
      answer: "Puedes contactarnos a través de nuestro formulario en la página de Contacto, enviándonos un correo electrónico a soporte@blessingstore.com o a través de nuestras redes sociales. Nuestro equipo está disponible para ayudarte de lunes a viernes en horario laboral."
    }
  ];

  return (
    <div className="faq-page-container">
      <h1 className="faq-page-title">Preguntas Frecuentes</h1>

      <section className="faq-section">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h2 className="faq-question" onClick={() => toggleAnswer(index)}>
              {faq.question}
              <span className={`arrow ${openQuestion === index ? 'up' : 'down'}`}></span>
            </h2>
            <div className={`faq-answer ${openQuestion === index ? 'open' : ''}`}>
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </section>

      <hr className="section-separator" />

      <section className="faq-section last-faq-section">
        <h2 className="faq-subtitle">¿No encontraste lo que buscabas?</h2>
        <p className="section-paragraph">
          Si tienes alguna otra pregunta o necesitas asistencia personalizada, no dudes en contactar con nuestro equipo de soporte. Estamos aquí para ayudarte.
        </p>
        <p className="section-paragraph">
          Visita nuestra sección de <a href="/contacto" className="contact-link">Contacto</a> para enviarnos un mensaje.
        </p>
      </section>
    </div>
  );
};

export default PreguntasFrecuentesPage;