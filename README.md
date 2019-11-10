# Node.js + Vue.js Boilerplate

This is a boilerplate project. The project contains Node.js REST API and frontend developed by Vue.js with BootstrapVue.

* API
  * Node.js, Express, Express Validator, JWT, Bunyan, Promise MySQL, Node Mailer
* Frontend
  * Vue.js, Vuex, Vue Router, Vue Draggable, Vuelidate, BootstrapVue

[![VuejsBoilerplate.gif](https://s5.gifyu.com/images/VuejsBoilerplate.gif)](https://gifyu.com/image/vLfJ)

## How to start

```bash
$ docker-compose up -d
```

Once docker containers are up, then you can access services with below URL.

| Service        | Endpoint |
| ------------- |-------------|
| API           | [http://localhost/api](http://localhost/api)      |
| Frontend      | [http://localhost/frontend](http://localhost/frontend) |
| Mailhog       | [http://localhost:8025](http://localhost:8025) |
| MySQL         | localhost:3307 |


There are three users in the database initially. You can use them to login Frontend.

| Username      | Email          | Password   |
| ------------- | -------------- | ---------  |
| admin         | admin@boilerplate.local | 123456 |
| staff         | staff@boilerplate.local | 123456 |
| user          | user@boilerplate.local  | 123456 |

### API

API docker container will be launched as development mode with nodemon. However, it won't detect any changes unless uncomment volumes.

To enable live change for the API, simply uncomment following lines in `docker-compose.yml`

```
  volumes:
    - ./api:/srv
```

Please make sure you run `npm install` in the `api` folder.

### Frontend

Currently, Frontend docker container is configured to serve production mode due to the limitation of setting development environment of Vue.js in sub directory.

If you want to have Hot Reload feature, then you should launch the Frontend separately by `npm run serve`.

```bash
$ cd frontend
$ npm run serve
```

Then access via your browser `http://localhost:8080`.

### Mailhog

Currently, API is configured to point Mailhog to send an email. Any email sent by the API can be viewed in Mailhog web interface.

Access via your browser `http://localhost:8025`

### MySQL

In the folder `mysql/sql`, there is a SQL file called `inital.sql`, which will become initial database table/rows.
MySQL port is mapped to 3307.

## Features

* API
  * Authentication
    * POST /login
    * POST /register
    * GET /register-confirm
    * POST /password-reset-request
    * GET /password-reset-verify
    * POST /password-reset
    * GET/POST /me
  * User
    * GET/POST /user
    * GET/PATCH/DELETE /user/:id
  * Todo
    * GET/POST /todo
    * GET/POST /todo/(pending|ongoing|completed|archived)
    * GET/PATCH/DELETE /todo/:id

* Frontend
  * Main page
  * Login
  * Register
  * Register confirm
  * Forget my password
  * My account
  * Update my account
  * Todo

## Todo

* [ ] Backend
* [ ] Unit tests
* [ ] E2E tests
