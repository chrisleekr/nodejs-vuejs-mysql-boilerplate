# development stage
FROM node:13-alpine AS dev-stage

RUN apk update && apk add --no-cache python make g++

WORKDIR /srv

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]

# build stage
FROM dev-stage AS build-stage

RUN npm install --production

RUN npm run build

# production stage
FROM node:13-alpine AS production-stage

WORKDIR /srv

COPY --from=build-stage /srv /srv

EXPOSE 3000

CMD [ "node", "dist/server.js"]
