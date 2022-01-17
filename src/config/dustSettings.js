module.exports = {
  startSyncBlock: 460912,
  bot: {
    name: "DustTipBot",
    color: "#0099ff",
    url: {
      telegram: "",
      discord: "https://discord.com/oauth2/authorize?client_id=924779779499110443&scope=bot&permissions=523328",
    },
    command: {
      discord: "!dusttip",
      telegram: "!dusttip",
    },
  },
  coin: {
    setting: "Komodo", // Supported names for setting (Runebase, Pirate, Komodo) // default fallback settings are Runebase
    name: "Dragonfairy",
    ticker: "DUST",
    logo: "https://downloads.runebase.io/dust.png",
    website: "https://www.runebase.io",
    explorer: "https://explorer.runebase.io",
    github: "https://github.com/runebase",
    telegram: "https://t.me/runebase_runes",
    discord: "https://discord.gg/jvdjWEEtHh",
    description: "Runebase is a combination of Bitcoin Core, Proof of stake and the Ethereum Virtual Machine (EVM). Runebase Core, allows smart contracts to execute on a Proof-of-Stake consensus model. The ecosystem provides familiar enviroment for smart contract and Decentralized Application Developers.",
    exchanges: [
      "none",
    ],
    exampleAddress: 'ReU2nhYXamYRd2VBk4auwresov6jwLEuSg',
  },
  faucet: 1, // (50 = 0,5% / 100 = 1% / ...) percentage of total per claim
  min: {
    confirmations: 6,
  },
};
