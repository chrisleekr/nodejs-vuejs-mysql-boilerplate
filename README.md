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

| Service        | Endpoint |
| ------------- |-------------|
| API | [http://localhost/api](http://localhost/api)      | 
| Frontend      | [http://localhost/frontend](http://localhost/frontend) | 

### API 

API docker container will be launched as development mode with nodemon. Hence, you can see changes as soon as you change the code in the API.

## Frontend

Currently, Frontend docker container is configured to serve production mode due to the limitation of setting development environment of Vue.js in sub directory.

If you want to have Hot Reload feature, then you should launch the Frontend separately by `npm run serve`. 

```bash
$ cd frontend
$ npm run serve
```

Then access via your browser `http://localhost:8080`.

## Features

* API
  - Authentication
    - POST /login
    - POST /register
    - GET /register-confirm
    - POST /password-reset-request
    - GET /password-reset-verify
    - POST /password-reset
    - GET/POST /me
  - User
    - GET/POST /user
    - GET/PATCH/DELETE /user/:id
  - Todo
    - GET/POST /todo
    - GET/POST /todo/(pending|ongoing|completed|archived)
    - GET/PATCH/DELETE /todo/:id

* Frontend
  - Main page
  - Login
  - Register
  - Register confirm
  - Forget my password
  - My account
  - Update my account
  - Todo

## Todo
* [ ] Backend
* [ ] Unit tests
* [ ] E2E tests