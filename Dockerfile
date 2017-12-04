FROM node:carbon-alpine
WORKDIR /usr/src/ayro-webcm
COPY ./package*.json ./
RUN apk add --no-cache --virtual .build-deps make gcc g++ python && \
  npm install --production --silent && \
  apk del .build-deps && \
  touch config.properties
COPY . .
EXPOSE 3100
EXPOSE 3102
CMD ["npm", "start"]