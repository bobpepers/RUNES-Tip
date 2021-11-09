## SUPPORTED .ENV CURRENCY_NAME LIST (Case sensitive, default fallback is Runebase config)
Runebase (Tested)
Pirate (UnTested)

### ADDING UNSUPPORTED CURRENCIES
- fork & modify rweb3.js 
- install package
- add currency to index.js/router.js/rclient.js
- create & edit service/sync.js file
- create helpers/patch.js file
- add currency to discord & telegram wallet controllers (./controllers/discord/wallet.js / ./controllers/telegram/wallet.js)

# SETUP

##Create .env

```
#RPC
RPC_USER=runebaseinfo
RPC_PASS=runebaseinfo
RPC_PORT=9432

#SYNC
START_SYNC_HEIGHT=230000

#DATABASE
DB_NAME=runestip
DB_USER=newuser
DB_PASS=@123TestDBFo
DB_HOST=localhost
DB_PORT=3306

## Telegrambot
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_RUNES_GROUP=xxx
TELEGRAM_BOT_COMMAND=runestip

## DISCORD
DISCORD_CLIENT_TOKEN=xxx
DISCORD_BOT_COMMAND=!tiprunes

#BOT
BOT_NAME=RunesTipBot
BOT_COLOR=0099ff

# CURRENCY
CURRENCY_SYMBOL=RUNES
CURRENCY_NAME=Runebase
CURRENCY_LOGO=https://downloads.runebase.io/logo-512x512.png


#OTHER
#MINUMUM_WITHDRAWAL (VALUE SATOSHIS)
MINIMUM_WITHDRAWAL=2e8

#MINUMUM_TIP (VALUE SATOSHIS)
MINIMUM_TIP=1e6

#MINUMUM_RAIN (VALUE SATOSHIS)
MINIMUM_RAIN=1e7

#MINUMUM_SLEET (VALUE SATOSHIS)
MINIMUM_SLEET=1e7

#MINUMUM_FLOOD (VALUE SATOSHIS)
MINIMUM_FLOOD=1e7

```
## Create database mysql terminal
```
CREATE DATABASE runestip;

GRANT ALL ON runestip.* TO 'newuser'@'localhost';

FLUSH PRIVILEGES;
```

## Init database

```
npx sequelize-cli db:migrate

```

## Node Config
```
daemon=1
rpcuser=runebaseinfo
rpcpassword=runebaseinfo
blocknotify= curl -X POST -d "{ \"payload\" : \"%s\"}" http://127.0.0.1:8080/api/chaininfo/block
walletnotify=curl --header "Content-Type: application/json" --request POST --data "{ \"payload\" : \"%s\"}" http://127.0.0.1:8080/api/rpc/walletnotify
server=1
txindex=1
zmqpubrawblock=tcp://127.0.0.1:29000
zmqpubrawtx=tcp://127.0.0.1:29000
zmqpubhashtx=tcp://127.0.0.1:29000
zmqpubhashblock=tcp://127.0.0.1:29000

rpcworkqueue=128

```