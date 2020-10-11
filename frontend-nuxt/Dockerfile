# initial stage
FROM node:13-alpine AS initial-stage

RUN apk --no-cache add autoconf automake gcc make g++ zlib-dev

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

RUN create-env.sh

RUN npm run build

FROM node:13-alpine AS production-stage

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
