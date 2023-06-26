ECHO OFF

cd .docker
docker-compose up
cd ..
node ./rm-client/rm-http-middleware.js


PAUSE
