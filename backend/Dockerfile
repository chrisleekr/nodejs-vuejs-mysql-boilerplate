# initial stage
FROM node:13 AS initial-stage

RUN apt-get update -y && \
  apt-get install -yq \
  cmake \
  build-essential \
  libpng-dev \
  libjpeg-dev \
  gifsicle \
  xvfb \
  libgtk-3-dev \
  libnotify-dev \
  libgconf-2-4 \
  libnss3 \
  libxss1 \
  libasound2

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

# Add configuration files
COPY image-files/ /

COPY . .

RUN npm run build --mode=production

ENTRYPOINT [ "docker-entrypoint.dev.sh" ]

# production stage
FROM nginx:stable-alpine AS production-stage

# Add configuration files
COPY image-files/ /

RUN chmod +x /usr/local/bin/docker-entrypoint*.sh
ENV PATH /usr/local/bin:$PATH

COPY --from=build-stage /srv/dist /srv/backend/

EXPOSE 80

ENTRYPOINT [ "docker-entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]
