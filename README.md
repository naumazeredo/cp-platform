# Competitive Programming Platform

Platform to ease Competitive Programming learning.

## Todo List

- [x] Configure Docker Compose
- [x] Convert HTML mockup to Jade/Pug
- [ ] Convert CSS mockup to SASS
- [ ] Create Pages
  - [x] Register
  - [x] Login
  - [x] Article list
  - [ ] Article page
  - [ ] Glossary
  - [ ] New/Edit article
  - [ ] User settings
  - [ ] Search
  - [ ] Pending articles (extra)
- [ ] Improve editor
  - [ ] Don't use SimpleME (?)
  - [ ] Add LaTeX support (MathJax)
  - [ ] Add image upload (Dropzone)
- [x] Write _Contributing_ section in README

#### Removed

- [x] Create login system (GitHub OAuth)

## Contributing

### Install Docker Engine

https://docs.docker.com/engine/installation/

### Install Docker Compose

https://docs.docker.com/compose/install/

### Clone repository

```
$ git clone https://github.com/naumazeredo/cp-platform.git
```

You can also fork the repo in GitHub and clone your repo.

### Running

Build containers:

```
$ docker-compose build
```

Create database and collections:

```
$ docker-compose up mongo
$ docker exec -it mongo mongo
$ use cpplatform
$ db.createCollection('users')
```

Run the application:

```
$ docker-compose up
```
