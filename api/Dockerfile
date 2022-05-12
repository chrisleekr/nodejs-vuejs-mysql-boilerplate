# development stage
FROM node:16-alpine3.13 AS dev-stage

RUN apk update && \
  apk add --no-cache \
  python3=3.8.10-r0 \
  make=4.3-r0 \
  g++=10.2.1_pre1-r3 \
  mysql-client=10.5.15-r0 \
  busybox=1.32.1-r8 \
  libcrypto1.1=1.1.1o-r0 \
  libssl1.1=1.1.1o-r0 \
  ssl_client=1.32.1-r8 \
  zlib=1.2.12-r1

# Add configuration files
COPY image-files/ /

WORKDIR /srv

COPY package*.json ./

# Upgrade npm due to vulnerabilities on packaged version
RUN npm install -g npm@8.10.0 && \
  npm install

COPY . .

EXPOSE 3000

ENTRYPOINT [ "docker-entrypoint.sh" ]

CMD [ "npm", "run", "dev" ]

# build stage
FROM dev-stage AS build-stage

RUN npm install && \
  npm run build

# production stage
FROM node:16-alpine3.13 AS production-stage

RUN apk update && \
  apk add --no-cache \
  mysql-client=10.5.15-r0 \
  busybox=1.32.1-r8 \
  libcrypto1.1=1.1.1o-r0 \
  libssl1.1=1.1.1o-r0 \
  ssl_client=1.32.1-r8 \
  zlib=1.2.12-r1

# Add configuration files
COPY image-files/ /

WORKDIR /srv

COPY --from=build-stage /srv /srv

# Upgrade npm due to vulnerabilities on packaged version
RUN npm install -g npm@8.10.0 && \
  # Remove dev dependencies
  npm prune --omit=dev

EXPOSE 3000

ENTRYPOINT [ "docker-entrypoint.sh" ]

CMD [ "node", "dist/server.js"]
