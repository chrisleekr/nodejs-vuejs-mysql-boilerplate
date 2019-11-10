# initial stage
FROM node:12-alpine AS initial-stage

RUN apk add --no-cache --update \
  build-base \
  libtool \
  autoconf \
  automake \
  bash \
  g++ \
  lcms2-dev \
  libpng-dev \
  libc6-compat \
  libjpeg-turbo-dev \
  libpng-dev \
  gcc \
  g++ \
  make \
  nasm \
  gifsicle \
  && rm -rf /var/cache/apk/*

WORKDIR /srv

COPY package*.json ./

RUN npm install

# build stage
FROM initial-stage AS build-stage

ARG NODE_ENV
ARG BASE_URL
ENV NODE_ENV=${NODE_ENV}
ENV BASE_URL=${BASE_URL}

WORKDIR /srv

COPY . .

RUN npm run build

# production stage
FROM nginx:stable-alpine AS production-stage

# Add configuration files
COPY image-files/ /

# Copy compiled
ARG BASE_URL
COPY --from=build-stage /srv/dist /usr/share/nginx/html/${BASE_URL}

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
