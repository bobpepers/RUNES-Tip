module.exports = {
  startSyncBlock: 500000,
  bot: {
    name: "RunesTipBot",
    color: "#0099ff",
    url: {
      telegram: "",
      discord: "https://discord.com/oauth2/authorize?client_id=906563045248094249&scope=bot&permissions=523328",
    },
    command: {
      discord: "!runestip",
      telegram: "!runestip",
      matrix: "!runestip",
    },
    enabled: {
      telegram: true,
      discord: true,
      matrix: true,
    },
  },
  coin: {
    setting: "Runebase", // Supported names for setting (Runebase, Pirate) // default fallback settings are Runebase
    name: "Runebase",
    ticker: "RUNES",
    logo: "https://downloads.runebase.io/runes.png",
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
    ],
    exampleAddress: 'ReU2nhYXamYRd2VBk4auwresov6jwLEuSg',
  },
  faucet: 1, // (50 = 0,5% / 100 = 1% / ...) percentage of total per claim
  min: {
    confirmations: 6,
  },
};
