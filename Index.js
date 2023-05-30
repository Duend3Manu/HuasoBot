'use strict';
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// Crear instancia del cliente de WhatsApp
const client = new Client();

// URL base de la API de Mindicador
const apiUrl = 'https://mindicador.cl/api';

// Evento que se activa cuando se necesita escanear el código QR para iniciar sesión
client.on('qr', (qrCode) => {
   qrcode.generate(qrCode, { small: true });
});

// Evento que se activa cuando el cliente está listo para ser utilizado
client.on('ready', () => {
   console.log('El cliente está listo');
});

// Evento que se activa cuando se recibe un mensaje
client.on('message', async (msg) => {
   console.log('Mensaje recibido:', msg.body);

   const lowerCaseBody = msg.body.toLowerCase();

   // Obtener información del remitente
   const senderInfo = await msg.getContact();

   // Resto del código para otros comandos y funciones
   if (lowerCaseBody === '!menu' || lowerCaseBody === '!comandos') {
      sendMenu(msg.from);
   } else if (lowerCaseBody === '!hola') {
      const responses = JSON.parse(fs.readFileSync('saludos.json', 'utf8'));
      const randomResponse = getRandomResponse(responses);
      client.sendMessage(msg.from, randomResponse);
   } else if (lowerCaseBody === '!valores') {
      try {
         const response = await axios.get(apiUrl);
         const { uf, dolar, euro, utm } = response.data;

         const replyMessage = `Valores actuales:
- UF: $${uf.valor}
- Dólar: $${dolar.valor}
- Euro: $${euro.valor}
- UTM: $${utm.valor}`;

         client.sendMessage(msg.from, replyMessage);
      } catch (error) {
         console.log('Error al obtener los valores:', error.message);
         client.sendMessage(msg.from, 'Ocurrió un error al obtener los valores.');
      }
   }
});

// Iniciar sesión en WhatsApp
client.initialize();

/**
 * Enviar el menú de comandos al destinatario.
 * @param {string} recipient - Número de teléfono del destinatario.
 */
function sendMenu(recipient) {
   const menu = `¡Hola! Estos son los comandos disponibles:
- !hola: Saluda al bot.
- !valores: Muestra los valores actuales de las monedas y UTM.
¡Espero que te sean útiles!`;

   client.sendMessage(recipient, menu);
}

/**
 * Obtener una respuesta aleatoria de un array de respuestas.
 * @param {string[]} responses - Array de respuestas.
 * @returns {string} - Respuesta aleatoria.
 */
function getRandomResponse(responses) {
   const randomIndex = Math.floor(Math.random() * responses.length);
   return responses[randomIndex];
}
