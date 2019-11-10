# initial stage
FROM node:12-alpine as initial-stage

RUN apk add --no-cache python make g++

WORKDIR /srv

COPY package*.json ./

RUN npm install

# dev stage
FROM node:12-alpine AS dev-stage

WORKDIR /srv

COPY --from=initial-stage /srv/node_modules .

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]

# product stage
FROM node:12-alpine AS production-stage

WORKDIR /srv

COPY --from=initial-stage /srv/node_modules .

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]`
