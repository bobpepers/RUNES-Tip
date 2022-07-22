## SUPPORTED .ENV CURRENCY_NAME LIST (Case sensitive, default fallback is Runebase config)
- Runebase
- Pirate
- Dust

# SETUP

##Create .env

```
#RPC
RPC_USER=runebaseinfo
RPC_PASS=runebaseinfo
RPC_PORT=9432

#DATABASE
DB_NAME=runestip
DB_USER=newuser
DB_PASS=@123TestDBFo
DB_HOST=localhost
DB_PORT=3306

## Telegrambot
TELEGRAM_BOT_TOKEN=xx
TELEGRAM_RUNES_GROUP=-xx
TELEGRAM_ADMIN_ID=xx
TELEGRAM_API_ID=xx
TELEGRAM_API_HASH=xx

## DISCORD
DISCORD_CLIENT_TOKEN=xx

## MATRIX
MATRIX_USER=xx
MATRIX_PASS=xx


#OPEN EXHANGE RATES KEY APP KEY()
OPEN_EXCHANGE_RATES_KEY=xx

#SESSION DASHBOARD
SESSION_SECRET="xxx"

#EMAIL
MAIL_HOST=mail.xxx.io
MAIL_PORT=587
MAIL_USER=xx@xx.com
MAIL_PASS=xx

#RECAPTCHA
RECAPTCHA_SITE_KEY=xx
RECAPTCHA_SECRET_KEY=xx

#ROOT_URL
ROOT_URL=localhost

#CONFIG (RUNEBASE / PIRATE)
CONFIG_FILE=PIRATE

#PIRATE ONLY (has to be the same address used for consolidating pirate on node config)
PIRATE_MAIN_ADDRESS=zs1gk4gus9ya7f4rr3jr2v2rjsqrh8n67534u5dtnu3cjvcqw867ft3ewfeqg6fsakeh8vyqe2xyrg

##NOTE: If We Reinstate DUSTTIP This must be still added to it's .env file
#KOMODO TYPE BLOCKCHAINS ONLY (consolidation address for all the funds)
KOMODO_CONSOLIDATION_ADDRESS=xx

#RUNEBASE TYPE BLOCKCHAINS ONLY (consolidation address for all the funds)
RUNEBASE_CONSOLIDATION_ADDRESS=xx
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
npx sequelize-cli db:migrate:undo --name 20211208092519-Add-user-association-to-features.js

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
blocknotify=curl -X POST -d "{ \"payload\" : \"%s\"}" http://127.0.0.1:8080/api/chaininfo/block
walletnotify=curl --header "Content-Type: application/json" --request POST --data "{ \"payload\" : \"%s\"}" http://127.0.0.1:8080/api/rpc/walletnotify
server=1
txindex=1
zmqpubrawblock=tcp://127.0.0.1:29000
zmqpubrawtx=tcp://127.0.0.1:29000
zmqpubhashtx=tcp://127.0.0.1:29000
zmqpubhashblock=tcp://127.0.0.1:29000

rpcworkqueue=128

```

## Read this

https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository

https://choosealicense.com/no-permission/

## Contact

If you want host this tipbot yourself, you must ask the developer for permission.

If you want the developer to host this tipbot for your project and have your project integrated, you can apply in the appropriate channel on discord

join the discord:
https://discord.gg/CdUSaVfp8Q
