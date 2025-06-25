// src/utils/formatCurrency.js

/**
 * Formatea un número a una cadena de texto con formato de moneda local (Colombiana).
 * @param {number} amount - El número a formatear.
 * @param {string} [locale='es-CO'] - Código de localización.
 * @param {string} [currency='COP'] - Código de moneda.
 * @returns {string} El valor formateado (ej. "$ 83.700").
 */
export const formatCurrency = (amount, locale = 'es-CO', currency = 'COP') => {
    const numericAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0,
    }).format(numericAmount);
};