# 3d inventory

![Entity model](src/assets/3d-inventory.png)

1. [3d inventory](#3d-inventory)
   1. [Description](#description)
      1. [About project](#about-project)
      2. [About background and motivation](#about-background-and-motivation)
   2. [Technology stack](#technology-stack)
   3. [Demo](#demo)
   4. [Data Model](#data-model)
      1. [Entity model](#entity-model)
      2. [Logical model](#logical-model)
      3. [Entity attributes](#entity-attributes)
   5. [Current functionality](#current-functionality)
   6. [Future development ideas](#future-development-ideas)
      1. [List devices](#list-devices)
         1. [Edit device](#edit-device)
      2. [Models](#models)
      3. [Attributes](#attributes)
      4. [Attribute Dictionary](#attribute-dictionary)
      5. [Connections](#connections)
      6. [Application 3d view](#application-3d-view)
   7. [Run](#run)
   8. [Upgrades](#upgrades)
   9. [Debug](#debug)
   10. [Deploy](#deploy)
   11. [Json server](#json-server)
   12. [Swagger client to generate API structures](#swagger-client-to-generate-api-structures)
2. [Mongo Atlas](#mongo-atlas)
   1. [myAtlasClusterEDU cluster](#myatlasclusteredu-cluster)
   2. [Contributing](#contributing)
      1. [Next tasks](#next-tasks)
3. [Tools](#tools)

## Description

### About project

Project create `3d inventory`. A simple solution that allows you to build a spatial and database representation of all types of warehouses and server rooms.

### About background and motivation

This project solves several problems I encountered while integrating inventory database solutions in a corporate environment.

I want to focus here to topic build database inventory applications and interfaces.

I'm programming to incorporate database systems. I develop in `PLSQL` and `ABAP`. I have some experience in create frontend/interfaces to database app in `Node.JS` (`Rx`/`Ag`), `Python` and `Java`. This project covers relevant topics and issues related to create simple and efficient platform for IT inventory.

You are welcome to cooperate and leave a few words of comment.

## Technology stack

- `Angular` 15+ (as a corpo framework)
- `Bootstrap` 5.3+ - logic for insert UI data
- `Tree` 150+ (as best graph framework)
- [`Neo4j`|`Oracle`|`jsonserver`] `Oracle` as database (for development `json server` -> rest `Oracle` -> rest `Neo4j`. I want in this project try different solution and different data structure and storage.
- `REST` - prepared `API` in use in `Swagger`.
- [`Docker`|`OpenShift`|`Podman`|`GitHub Container`] as containers

## Demo

Underconstrution (not work jet)

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=0000000&machine=premiumLinux&devcontainer_path=.devcontainer%2Fdevcontainer.json&location=WestUs2)

[![3-d inventory the video](https://youtu.be/rNOxpZ0ti1Q)](https://youtu.be/rNOxpZ0ti1Q)

## Data Model

This is implementation parametric generic attribute class. All attributes for `Devices`, `Models` and `Connections` are stored in this model.

Parameters types are defined in `Attribute Dictionary`.

In `Attributes` are stored values defined in `Attributes Dictionary` for `Devices`, `Model` and `Connections`.

`Attributes Dictionary` are defined for specyfice.

### Entity model

![Entity model](src/assets/img/Screenshot%20from%202023-05-20%2016-54-30-watermark.png)

### Logical model

![Logical model](src/assets/img/Screenshot%20from%202023-05-20%2017-20-39-watermark.png)

### Entity attributes

- `MODELS`
  - ID (UUID4)
  - NAME
  - DIMENSION
    - X
    - Y
    - H
- `DEVICES`
  - ID (UUID4)
  - NAME
  - MODEL_ID
  - POSITION
    - X
    - Y
    - H
- `CONNECTION`
  - ID (UUID4)
  - TO_DEVICE_ID
  - FROM_DEVICE_ID
- `ATTRIBUTES`
  - ID (UUID4)
  - DEVICE_ID
  - MODEL_ID
  - CONNECTION_ID
  - ATTRIBUTE_TYPE_ID
  - VALUE
- `ATTRIBUTES_TYPES`
  - ID (UUID4)
  - NAME
  - DESCRIPTION
  - COMPONENTS (list of values)
- `FLOORS` (@TODO)
  - ARRAY SHAPE
    - DIMENSION
      - X
      - Y
      - H
    - POSITION
      - X
      - Y
      - H
    - ENTERS ARRAY
      - X
      - Y
      - H
      - TYPE [ENTER|EMPTY]
- `LOGS`
  - ID (UUID4)
  - DATETIME
  - OBJECT_ID (UUID4)
  - OPERATION
  - COMPONENT
  - MESSAGE

## Current functionality

- [Reactive forms](https://angular.io/guide/reactive-forms?ref=cup-t) in `Angular` 15+
- [Bootstrap 5.3](https://getbootstrap.com/)+ show
- `3D` representation in [three.js](https://threejs.org/) 150+
- Dynamic define attributes to components:
  - `DEVICES`
  - `MODELS`
  - `FLOORS`
  - `CONNECTIONS`
- Show dynamic attributes for `Device`: ![Device with attributes](image.png)

## Future development ideas

Sth. like development plan:

- [ ] Set position and model in data ans show this data in `3d`.
- [ ] Show attributes of `DEVICES`, `MODELS` and `CONNECTIONS`.
- [ ] Generate `FLOOR`
- [ ] as array of square (x, y, h)
- [ ] Use `Mongo` to strore `JSON` data.
- [ ] `Docker` -> serve application in `Github Pages` --> `AWS EC2`
- [ ] Use Dev container in `GitHub` for development.
- [ ] Recognize `Grunt`/`Glup` to `CI`/`DI` use in this project.
- [ ] Add actual tasks form `GitHub` during build in README.md.
- [ ] Add light/dark theme switch in `UI`
- [ ] For development `JSON` server -> rest `Oracle` --> rest `Neo4j`
- [ ] Use https://formly.dev/ ?

### List devices

![List devices](src/assets/img/Screenshot%202023-07-14%20at%2008-48-50%203d%20inventory-watermark.png)

#### Edit device

![Edit Device](image-1.png)


### Models

![Models](<src/assets/img/Screenshot%202023-07-14%20at%2008-49-31%203d%20inventory-watermark.png>)

### Attributes

![Alt text](<src/assets/img/Screenshot%202023-07-14%20at%2008-49-42%203d%20inventory-watermark.png>)

### Attribute Dictionary

![Alt text](<src/assets/img/Screenshot%202023-07-14%20at%2008-49-51%203d%20inventory-watermark.png>)

### Connections

![Alt text](<src/assets/img/Screenshot%202023-07-14%20at%2008-50-00%203d%20inventory-watermark.png>)

### Application 3d view

View in `3d` inventory use [three.js](https://threejs.org/) framework.

![Example random generated blocks in floor](src/assets/img/Screenshot%20from%202023-05-01%2008-29-25-watermark.png)


This project build from this example contain `three.js` in `Angular`[Tutorial to render 3D Cube in Angular + Three.js](https://srivastavaanurag79.medium.com/hello-cube-your-first-three-js-scene-in-angular-176c44b9c6c0).

## Run

```bash
# clone repo
git clone https://github.com/karol-preiskorn/3d-inventory-angular-ui.git
# install dependences
npm install
# run server
npm run start
# run data server
npm run start:json-server
# goto in browser
http://localhost:4200
```

On this stage of project I use single branch `master`. If I finish this stage when app will be usefully I will use also develop.

## Upgrades

https://angular.io/guide/versions

## Debug

Try use Firefox plugin in `VS code`. Without success i used Chronium.

- https://github.com/microsoft/vscode-recipes/tree/main/Angular-CLI

## Deploy

https://angular.io/guide/deployment

Build in first terminal: `ng build --watch` in npm alias:

```bash
npm run build
```

On the second terminal, install a web server (such as `lite-server`), and run it against the output folder. For example:

```bash
lite-server --baseDir='dist/3d-inventory-angular-ui/browser'
```

npm alias: `npm run server`

## Json server

For testing UI API run `jsonserver`.

In `npm` run script:

```js
"jsonserver:devices": "json-server --watch devices.json"
```

Server `url`:

```json
baseurl = 'http://localhost:3000';
```

## Swagger client to generate API structures

Abandoned until I do not have clear situation with data entity and operations. Now I use `json-swager` to store data.

```bash
ng generate library swagger-client
```

Generate library: `projects/swagger-client`

Copy to src all generated by `swaggercodegen` code

# Mongo Atlas

One of good options `3d-inventory` data storage.

## myAtlasClusterEDU cluster

Cluster Name: `myAtlasClusterEDU`
Cloud Provider and Region: `AWS - US_EAST_1``
Database User Username: `myAtlasDBUser`
Allow connections from (IP Address):    `35.205.118.189`

We are deploying myAtlasClusterEDU...

Please store your database authentication access details in a secure location:
Database User Username: `myAtlasDBUser`
Database User Password: `myatlas-001`

Your connection string: `mongodb+srv://myatlasclusteredu.q9fmori.mongodb.net`

MongoDB Shell detected. Connecting to your Atlas cluster:

```bash
$ mongosh -u myAtlasDBUser -p myatlas-001 mongodb+srv://myatlasclusteredu.q9fmori.mongodb.net
```
Current Mongosh Log ID: `64ce684aa70378d31457ab87`
Connecting to:          `mongodb+srv://<credentials>@myatlasclusteredu.q9fmori.mongodb.net/?appName=mongosh+1.10.1`

- Using MongoDB:          6.0.8
- Using Mongosh:          1.10.1

For mongosh info see: https://docs.mongodb.com/mongodb-shell/

user: 3d-inventory
password: HNPBhKUaBsLZAvER

## Contributing

Pull requests are welcome. For major changes, please open an [issue](https://github.com/karol-preiskorn/3d-inventory-angular-ui/issues/new) first to discuss what you would like to change.

Please make sure to update tests as appropriate.

Not forget about [code guide-lines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines).

### Next tasks

+ [https://github.com/karol-preiskorn/3d-inventory-angular-ui/issues](https://github.com/karol-preiskorn/3d-inventory-angular-ui/issues)

# Tools

- https://glyphsearch.com/ Icons


