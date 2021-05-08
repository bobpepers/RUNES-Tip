#!/bin/bash -l

cd /home/bago/runebase.io/server
/usr/bin/screen -X -S websiteapi quit
/usr/bin/screen -dmS websiteapi
/usr/bin/screen -S websiteapi -p 0 -X stuff "bash $(printf \\r)"
sleep 10
/usr/bin/screen -S websiteapi -p 0 -X stuff "npm run start $(printf \\r)"
sleep 10

