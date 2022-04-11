import { config } from "dotenv";
import Runebase from "./rpc/runebase";
import Pirate from "./rpc/pirate";
import Komodo from "./rpc/komodo";

import getCoinSettings from '../config/settings';

const settings = getCoinSettings();
config();

let instance;

export function createInstance() {
  if (settings.coin.setting === 'Runebase') {
    return new Runebase(`http://${process.env.RPC_USER}:${process.env.RPC_PASS}@localhost:${process.env.RPC_PORT}`);
  }
  if (settings.coin.setting === 'Pirate') {
    return new Pirate(`http://${process.env.RPC_USER}:${process.env.RPC_PASS}@localhost:${process.env.RPC_PORT}`);
  }
  if (settings.coin.setting === 'Komodo') {
    return new Komodo(`http://${process.env.RPC_USER}:${process.env.RPC_PASS}@localhost:${process.env.RPC_PORT}`);
  }
}

export function getInstance() {
  if (!instance) {
    instance = createInstance();
  }
  return instance;
}
