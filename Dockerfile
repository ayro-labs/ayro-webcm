FROM node:carbon
WORKDIR /usr/src/ayro-webcm
COPY ./package*.json .
RUN npm install
COPY . .
EXPOSE 3100
EXPOSE 3102
CMD ["npm", "start"]