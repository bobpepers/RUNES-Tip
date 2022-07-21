import { config } from "dotenv";
import runebaseSettings from './runebaseSettings';
import pirateSettings from './pirateSettings';
import dustSettings from './dustSettings';
import tokelSettings from './tokelSettings';

config();

const getCoinSettings = () => {
  if (process.env.CONFIG_FILE === 'RUNEBASE') {
    return runebaseSettings;
  }
  if (process.env.CONFIG_FILE === 'PIRATE') {
    return pirateSettings;
  }
  if (process.env.CONFIG_FILE === 'DUST') {
    return dustSettings;
  }
  if (process.env.CONFIG_FILE === 'TOKEL') {
    return tokelSettings;
  }
};

export default getCoinSettings;
