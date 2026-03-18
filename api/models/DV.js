function calcularDV(fila) {
  const datos = Object.entries(fila)
    .filter(([key, _]) => key !== 'dvh' && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt')
    .map(([_, v]) => (v === null || v === undefined) ? '' : String(v));
  const str = datos.join('');
  let suma = 0;
  for (let i = 0; i < str.length; i++) suma += str.charCodeAt(i);
  return suma % 7;
}

async function actualizarDVH(modelo) {
  const filas = await modelo.findAll();
  for (const fila of filas) {
    const dvh = calcularDV(fila.dataValues);
    if ((fila.dvh || null) !== dvh) {
      // Usar queryInterface para evitar hooks completamente
      try {
        const queryInterface = modelo.sequelize.getQueryInterface();
        await queryInterface.bulkUpdate(
          modelo.getTableName(),
          { dvh },
          { id: fila.id }
        );
        } catch (error) {
        console.error(`❌ Error actualizando DVH:`, error);
      }
    }
  }
}

async function actualizarDVV(modelo, nombreTabla) {
  const filas = await modelo.findAll({ attributes: ['dvh'] });
  const dvv = filas.reduce((acc, fila) => acc + (Number(fila.dvh) || 0), 0);

  const { DigitoVerificador } = require('./DigitoVerificador');
  await DigitoVerificador.upsert({ tabla: nombreTabla, dvv });
}

async function actualizarDV(modelo, tabla) {
  await actualizarDVH(modelo);
  await actualizarDVV(modelo, tabla);
}

module.exports = { calcularDV, actualizarDV };