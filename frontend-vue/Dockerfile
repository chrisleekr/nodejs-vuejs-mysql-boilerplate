# initial stage
FROM node:16-buster AS initial-stage

RUN apt-get update -y && \
  apt-get install -yq --no-install-recommends \
  cmake=3.13.4-1 \
  build-essential=12.6 \
  libpng-dev=1.6.36-6 \
  libjpeg-dev=1:1.5.2-2+deb10u1 \
  gifsicle=1.91-5 \
  xvfb=2:1.20.4-1+deb10u3 \
  libgtk-3-dev=3.24.5-1 \
  libnotify-dev=0.7.7-4 \
  libgconf-2-4=3.2.6-5 \
  libnss3=2:3.42.1-1+deb10u3 \
  libxss1=1:1.2.3-1 \
  libasound2=1.1.8-1 && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /srv

COPY package*.json ./

RUN npm install

# build stage
FROM initial-stage AS build-stage

ARG NODE_ENV
ARG BASE_URL
ENV NODE_ENV=${NODE_ENV}
ENV BASE_URL=${BASE_URL}

# Add configuration files
COPY image-files/ /

WORKDIR /srv

COPY . .

RUN npm run build --mode=production

ENTRYPOINT [ "docker-entrypoint.dev.sh" ]

# production stage
FROM nginx:stable-alpine AS production-stage

# Add configuration files
COPY image-files/ /

COPY --from=build-stage /srv/dist /srv

EXPOSE 80

ENTRYPOINT [ "docker-entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]
