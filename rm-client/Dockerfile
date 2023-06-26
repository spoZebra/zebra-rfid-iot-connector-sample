FROM node:16


# Create app directory
WORKDIR /usr/src/app

RUN rm -rf /usr/src/app/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY /rm-client/package*.json .


RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./rm-client/ .

RUN apt update && apt install -y sudo && apt install netcat inetutils-* net-tools iproute2 less --yes && apt install socat && apt install tcpdump --yes
EXPOSE 3997
CMD [ "node", "rm-http-middleware.js" ]

