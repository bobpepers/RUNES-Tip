## SUPPORTED .ENV CURRENCY_NAME LIST (Case sensitive, default fallback is Runebase config)
- Runebase (Tested)
- Pirate (UnTested)

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
START_SYNC_HEIGHT=500000

#DATABASE
DB_NAME=runestip
DB_USER=newuser
DB_PASS=@123TestDBFo
DB_HOST=localhost
DB_PORT=3306

## Telegrambot
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_RUNES_GROUP=xxx
TELEGRAM_ADMIN_ID=xxx

## DISCORD
DISCORD_CLIENT_TOKEN=xx

#OPEN EXHANGE RATES KEY APP KEY()
OPEN_EXCHANGE_RATES_KEY=xxx


#PIRATE ONLY (replace with address from current pirate wallet)
PIRATE_MAIN_ADDRESS=zs1gk4gus9ya7f4rr3jr2v2rjsqrh8n67534u5dtnu3cjvcqw867ft3ewfeqg6fsakeh8vyqe2xyrg

```
## Create database mysql terminal
```
CREATE DATABASE runestip;

GRANT ALL ON runestip.* TO 'newuser'@'localhost';

FLUSH PRIVILEGES;
```

## Migrations

run migrations
````
npx sequelize-cli db:migrate
````

generate a new empty migration file
````
npx sequelize-cli migration:generate --name Sleet-table

````


undo single migration
````
npx sequelize-cli db:migrate:undo --name 20210416015813-add-countryid-to-user.js

````

undo migration
````
npx sequelize-cli db:migrate:undo
````

deploy demo seeds (development only)
````
npx sequelize-cli db:seed:all
````

generte empty seed file
````
npx sequelize-cli seed:generate --name demo-jackpot
````



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