import { Rweb3 } from "rweb3";
import { ARRRweb3 } from "arrrweb3";
import { config } from "dotenv";
import getCoinSettings from '../config/settings';

const settings = getCoinSettings();

config();
let instance;

export function createInstance() {
  if (settings.coin.setting === 'Runebase') {
    return new Rweb3(`http://${process.env.RPC_USER}:${process.env.RPC_PASS}@localhost:${process.env.RPC_PORT}`);
  }
  if (settings.coin.setting === 'Pirate') {
    return new ARRRweb3(`http://${process.env.RPC_USER}:${process.env.RPC_PASS}@localhost:${process.env.RPC_PORT}`);
  }
}
export function getInstance() {
  if (!instance) {
    instance = createInstance();
  }
  return instance;
}
