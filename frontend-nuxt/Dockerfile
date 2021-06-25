# initial stage
FROM node:16-alpine3.13 AS initial-stage

RUN apk --no-cache add autoconf=2.69-r3 \
  automake=1.16.3-r0 \
  gcc=10.2.1_pre1-r3 \
  make=4.3-r0 \
  g++=10.2.1_pre1-r3 \
  zlib-dev=1.2.11-r3

WORKDIR /srv

COPY package*.json ./

RUN npm install

# build stage
FROM initial-stage AS build-stage

ARG BASE_URL
ARG API_URL

ENV BASE_URL=${BASE_URL}
ENV API_URL=${API_URL}

WORKDIR /srv

# Add configuration files
COPY image-files/ /

RUN chmod +x /usr/local/bin/create-env.sh
ENV PATH /usr/local/bin:$PATH

COPY . .

RUN create-env.sh && \
  npm run build

FROM node:16-alpine AS production-stage

# Add configuration files
COPY image-files/ /

RUN chmod +x /usr/local/bin/create-env.sh
ENV PATH /usr/local/bin:$PATH

WORKDIR /srv

COPY --from=build-stage /srv /srv
ENV HOST 0.0.0.0
EXPOSE 3000

ENTRYPOINT [ "docker-entrypoint.sh" ]

CMD ["npm", "run", "prod"]
