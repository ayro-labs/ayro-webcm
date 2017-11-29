FROM node:carbon
WORKDIR /usr/src/ayro-webcm
COPY . .
EXPOSE 3100
EXPOSE 3102
CMD ["npm", "start"]