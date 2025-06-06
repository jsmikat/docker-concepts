FROM node:22.16-alpine
WORKDIR /usr/express-mongo
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000
ENTRYPOINT ["npm", "run", "dev"]

