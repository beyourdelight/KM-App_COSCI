const { mergeConfig } = require('vite');

module.exports = (config) => {
return mergeConfig(config, {
    server: {
      // อนุญาตให้ทุกเว็บเข้าถึงได้
    allowedHosts: true,
    },
});
};