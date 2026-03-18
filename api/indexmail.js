const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'stylemusesm@gmail.com',
    pass: 'zuku wyye toww qino'
  }
});

// Verificamos que el transporter esté listo (opcional pero útil)
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error al verificar transporter:', error);
  } else {
    console.log('✅ Transporter listo para enviar correos');
  }
});

// Exportación correcta en CommonJS
module.exports = transporter;

