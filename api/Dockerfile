# development stage
FROM node:13-alpine AS dev-stage

RUN apk update && apk add --no-cache python make g++

WORKDIR /srv

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]

# production stage
FROM node:13-alpine AS production-stage

RUN apk update && apk add --no-cache python make g++

WORKDIR /srv

COPY package*.json ./

RUN npm install --proudction

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]`
