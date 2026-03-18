const { actualizarDV } = require('../DV');

function agregarHooksDV(modelo, nombreTabla) {
  modelo.addHook('afterCreate', async (instancia) => {
    // Evitar recálculo si ya se está actualizando el DVH
    if (!instancia.changed('dvh')) {
      await actualizarDV(modelo, nombreTabla);
    }
  });

  modelo.addHook('afterUpdate', async (instancia) => {
    // Evitar recálculo si el único campo modificado fue el DVH
    if (!instancia.changed('dvh')) {
      await actualizarDV(modelo, nombreTabla);
    }
  });

  modelo.addHook('afterDestroy', async () => {
    await actualizarDV(modelo, nombreTabla);
  });
}

module.exports = { agregarHooksDV };