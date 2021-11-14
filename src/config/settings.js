
module.exports = {
  bot: {
    name: "RunesTipBot",
    color: "#0099ff",
    command: {
      discord: "!runestip",
      telegram: "runestip",
    },
  }, 
  coin: {
    name: "Runebase", // Supported names for setting (Runebase, Pirate) // default fallback settings are Runebase
    ticker: "RUNES",
    logo: "https://downloads.runebase.io/logo-512x512.png",
    website: "https://www.runebase.io",
    explorer: "https://explorer.runebase.io",
    github: "https://github.com/runebase",
    telegram: "https://t.me/runebase_runes",
    discord: "https://discord.gg/jvdjWEEtHh",
    description: "Runebase is a combination of Bitcoin Core, Proof of stake and the Ethereum Virtual Machine (EVM). Runebase Core, allows smart contracts to execute on a Proof-of-Stake consensus model. The ecosystem provides familiar enviroment for smart contract and Decentralized Application Developers.",
    exchanges: [
      "https://bololex.com/trading/?symbol=RUNES-BTC",
      "https://bololex.com/trading/?symbol=RUNES-USDT",
      "https://bololex.com/trading/?symbol=RUNES-DOGE",
      "https://bololex.com/trading/?symbol=RUNES-ETH",
      "https://bololex.com/trading/?symbol=RUNES-BOLO",
      "https://v2.altmarkets.io/trading/runesdoge",
      "https://txbit.io/Trade/RUNES/BTC",
      "https://txbit.io/Trade/RUNES/ETH",
      "https://stakecenter.co/client/exchange/BTC/RUNES",
      "https://stakecenter.co/client/exchange/LTC/RUNES",
      "https://stakecenter.co/client/exchange/DOGE/RUNES",
      "https://stakecenter.co/client/exchange/RDD/RUNES",
      "https://www.localrunes.com",
    ],
  },
  fee: {
    withdrawal: 1e7,  
  },
  min: { 
    withdrawal: 2e8,
    confirmations: 6,
    discord: {
      tip: 1e7,
      rain: 1e7,
      flood: 1e7,
      sleet: 1e7,
      reactdrop: 1e7,
    },
    telegram: {
      tip: 1e7,
      rain: 1e7,
    },    
  },
};

