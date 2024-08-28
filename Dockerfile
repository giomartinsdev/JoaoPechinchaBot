FROM node:slim

WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
RUN npm run build:dev

CMD ["npm", "run", "start:dev"]