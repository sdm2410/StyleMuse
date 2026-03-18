// ✅ api/middlewares/getIp.js
const detectarIP = (req, res, next) => {
  let ip =
    req.headers['x-forwarded-for']?.split(',').shift() ||
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    req.ip ||
    null;

  if (ip) ip = ip.replace(/^.*:/, ''); // Limpia formato IPv6 (::ffff:127.0.0.1)
  if (!ip || ip === '1' || ip === '::1') ip = '127.0.0.1'; // Valor por defecto local

  req.ipUsuario = ip;
  next();
};

// 🔹 También exportamos la función para usarla directamente en controladores
const getIp = (req) => {
  let ip =
    req.headers['x-forwarded-for']?.split(',').shift() ||
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    req.ip ||
    null;

  if (ip) ip = ip.replace(/^.*:/, '');
  if (!ip || ip === '1' || ip === '::1') ip = '127.0.0.1';
  return ip;
};

module.exports = { detectarIP, getIp };

