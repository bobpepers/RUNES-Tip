const { Rweb3 } = require('rweb3');
const { ARRRweb3 } = require('arrrweb3');
require('dotenv').config();
import settings from '../config/settings';

const RClient = (() => {
  let instance;

  function createInstance() {
    if (settings.coin.name === 'Runebase') {
      return new Rweb3(`http://${process.env.RPC_USER}:${process.env.RPC_PASS}@localhost:${process.env.RPC_PORT}`);
    }
    if (settings.coin.name === 'Pirate') {
      return new ARRRweb3(`http://${process.env.RPC_USER}:${process.env.RPC_PASS}@localhost:${process.env.RPC_PORT}`);
    }
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

module.exports = RClient;
