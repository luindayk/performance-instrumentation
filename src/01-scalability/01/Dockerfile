FROM node:alpine

WORKDIR /usr/src/app

COPY ./package*.json ./

COPY src/01-scalability/01/index.js src/01-scalability/01/index.js

RUN npm install

CMD [ "node", "src/01-scalability/01/index.js" ]