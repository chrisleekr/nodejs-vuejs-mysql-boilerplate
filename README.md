# Node.js + Vue.js + MySQL Boilerplate

This is a boilerplate project. The project contains Node.js REST API and frontend/backend developed by Vue.js with BootstrapVue.

* API
  * Node.js, Express, Express Validator, JWT, Bunyan, Promise MySQL, Node Mailer
* Frontend
  * Vue.js, Vuex, Vue Router, Vue Draggable, Vuelidate, BootstrapVue
* Backend
  * Vue.js, Vuex, Vue Router, Vuelidate, BootstrapVue

## Demo
| Service        | Endpoint |
| ------------- |-------------|
| API           | [https://nvm-boilerplate.chrislee.kr/api](https://nvm-boilerplate.chrislee.kr/api)      |
| Frontend      | [https://nvm-boilerplate.chrislee.kr/frontend](https://nvm-boilerplate.chrislee.kr/frontend) |
| Backend       | [https://nvm-boilerplate.chrislee.kr/backend](https://nvm-boilerplate.chrislee.kr/backend) |
| Mailhog       | [https://nvm-boilerplate.chrislee.kr/mailhog](https://nvm-boilerplate.chrislee.kr/mailhog) |


## How to start in your local environment

```bash
$ docker-compose up -d
```

Once docker containers are up, then you can access services with below URL.

| Service        | Endpoint |
| ------------- |-------------|
| API           | [http://localhost/api](http://localhost/api)      |
| Frontend      | [http://localhost/frontend](http://localhost/frontend) |
| Backend       | [http://localhost/backend](http://localhost/backend) |
| Mailhog       | [http://localhost/mailhog](http://localhost/mailhog) |
| MySQL         | localhost:3307 |


There are three users in the database initially. You can use them to login Frontend/Backend.

| Service       | Username      | Email                   | Password  |
| ------------- | ------------- | --------------          | --------- |
| Backend       | admin         | admin@boilerplate.local | 123456    |
| Backend       | staff         | staff@boilerplate.local | 123456    |
| Frontend      | user          | user@boilerplate.local  | 123456    |

### API

API docker container will be launched as development mode with nodemon. However, it won't detect any changes unless uncomment volumes.

To enable live change for the API, simply uncomment following lines in `docker-compose.yml`

```
  volumes:
    - ./api:/srv
```

Please make sure you run `npm install` in the `api` folder.

### Frontend & Backend

Currently, Frontend and Backend docker container is configured to serve production mode due to the limitation of setting development environment of Vue.js in sub directory.

If you want to have Hot Reload feature, then you should launch the Frontend separately by `npm run serve`.

```bash
$ cd frontend
$ npm run serve

or 

$ cd backend
$ npm run serve
```

Then access Frontend with `http://localhost:8080` and Backend with `http://localhost:8081` via your browser.

### Mailhog

Currently, API is configured to point Mailhog to send an email. Any email sent by the API can be viewed in Mailhog web interface.

Access via your browser `http://localhost/mailhog`

### MySQL

In the folder `mysql/sql`, there is a SQL file called `inital.sql`, which will become initial database table/rows.
MySQL port is mapped to 3307.

## Features

- Frontend
  - User registration
  - Confirm user email address
  - Reset user password
  - User login/logout
  - Manage todo
  - Manage account information

- Backend
  - Staff login/logout
  - Staff permission mangement
  - List todo
  - Manage users
  - Manage staffs
  - Manage settings


## Todo

* [ ] CI/CD
* [ ] Unit tests
* [ ] E2E tests
