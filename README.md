# 3d inventory

1. [3d inventory](#3d-inventory)
   1. [About project](#about-project)
      1. [Motivation](#motivation)
   2. [Technology stack](#technology-stack)
   3. [Demo](#demo)
   4. [Data Model](#data-model)
      1. [Logical model](#logical-model)
   5. [Aplication](#aplication)
      1. [List devices](#list-devices)
      2. [Models](#models)
      3. [Attributes](#attributes)
      4. [Attribute Dictionary](#attribute-dictionary)
      5. [Connections](#connections)
   6. [Run](#run)
   7. [Deploy](#deploy)
   8. [Google Cloud](#google-cloud)
   9. [APIs repos](#apis-repos)
   10. [Contributing](#contributing)
   11. [Next todo/progress/ideas](#next-todoprogressideas)

[![wakatime](https://wakatime.com/badge/user/3bbeedbe-0c6a-4a01-b3cd-a85d319a03bf/project/018c62ce-6164-4200-bca9-be53af7f6d80.svg)](https://wakatime.com/badge/user/3bbeedbe-0c6a-4a01-b3cd-a85d319a03bf/project/018c62ce-6164-4200-bca9-be53af7f6d80) [![GitHub latest commit](https://badgen.net/github/last-commit/karol-preiskorn/3d-inventory-angular-ui)](https://GitHub.com/karol-preiskorn/3d-inventory-angular-ui/commit/) [![GitHub stars](https://img.shields.io/github/stars/karol-preiskorn/3d-inventory-angular-ui.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/karol-preiskorn/3d-inventory-angular-ui/stargazers/) [![GitHub issues](https://img.shields.io/github/issues/karol-preiskorn/3d-inventory-angular-ui.svg)](https://GitHub.com/karol-preiskorn/3d-inventory-angular-ui/issues/)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/) [![TypeScript](https://img.shields.io/badge/--3178C6?logo=typescript&logoColor=ffffff)](https://www.typescriptlang.org/) [![Npm](https://badgen.net/badge/icon/npm?icon=npm&label)](https://https://npmjs.com/) [![GitHub license](https://badgen.net/github/license/karol-preiskorn/3d-inventory-angular-ui)](https://github.com/karol-preiskorn/3d-inventory-angular-ui/blob/master/LICENSE)

## About project

The ✨`3d inventory`✨ project allows you to build a spatial and database representation of your datacenters.

### Motivation

This project serves as a sandbox to explore relevant topics and issues related to creating a simple and efficient platform for IT inventory.

<img title="Architecture" src="src/assets/architecture.drawio.png" style="filter: drop-shadow(8px 8px 8px black); border-radius: 1%; margin-bottom: 16px" width="85%">

Project contain three repos:

- ⚓ https://github.com/karol-preiskorn/3d-inventory-angular-ui
- ⚓ https://github.com/karol-preiskorn/3d-inventory-mongo-api
- ⚓ https://github.com/karol-preiskorn/3d-inventory-oracle-api

## Technology stack

- `Angular` 17+ - as a Corp framework.
- `Bootstrap` 5.3+ - logic for insert `UI` data
- `tree.js` 163+ - as best graph framework.
- `MongoAtlas`|`Oracle` - I want in this project try different solution and different data structure and storage datamodels relational and noSQL.
- `REST` - prepared `API` in use in `Swagger`.
- `Podman` --> `Google Cloud` as containers

## Demo

Demo `3d inventory` use `Angular` and `three.js` framework for graphics representation.

[<img title="3-d inventory the video" src="src/assets/img/3d-inventory-demo.png" style="filter: drop-shadow(8px 8px 8px black); border-radius: 1%;" width="85%"/>](https://youtu.be/rNOxpZ0ti1Q '3-d inventory the video')

This project build from this example contain `three.js` in `Angular` [Tutorial to render 3D 3d in Angular + Three.js](https://srivastavaanurag79.medium.com/hello-3d-your-first-three-js-scene-in-angular-176c44b9c6c0).

## Data Model

This is the implementation of a parametric generic attribute class. All attributes for `Devices`, `Models`, and `Connections` are stored in this model.

Parameter types are defined in the `Attribute Dictionary`.

In `Attributes`, values defined in the `Attribute Dictionary` for `Devices`, `Models`, and `Connections` are stored. The `Attribute Dictionary` specifies parameters for these entities.

### Logical model

Relational data model is maped to noSQL model im MondoDb.

<img title="Logical model" src="src/assets/img/3d-inventory-data-model.png" style="filter: drop-shadow(8px 8px 8px black); border-radius: 1%;" width="85%"/>

## Aplication

### List devices

<img title="List devices" src="src/assets/img/Screenshot%202023-07-14%20at%2008-48-50%203d%20inventory-watermark.png" style="filter: drop-shadow(8px 8px 8px black); border-radius: 1%;" width="80%"/>

### Models

<img title="Models" src="src/assets/img/Screenshot%202023-07-14%20at%2008-49-31%203d%20inventory-watermark.png" style="filter: drop-shadow(8px 8px 8pxblack); border-radius: 1% 1% 1% 1%;" width="80%"/>

### Attributes

<img title="Attributes" src="src/assets/img/Screenshot%202023-07-14%20at%2008-49-42%203d%20inventory-watermark.png" style="filter: drop-shadow(8px 8px 8px black); border-radius: 1%;" width="80%"/>

### Attribute Dictionary

<img title="Attribute Dictionary" src="src/assets/img/Screenshot%202023-07-14%20at%2008-49-51%203d%20inventory-watermark.png" style="filter: drop-shadow(8px 8px 8px black); border-radius: 1%;" width="80%"/>

### Connections

<img title="Connections" src="src/assets/img/Screenshot%202023-07-14%20at%2008-50-00%203d%20inventory-watermark.png" style="filter: drop-shadow(8px 8px 8px black); border-radius: 1%;" width="80%"/>

## Run

```bash
git clone https://github.com/karol-preiskorn/3d-inventory-angular-ui.git
cd 3d-inventory-angular-ui
npm install
npm run start
```

or run separately `json-server` and `ui`

```bash
npm run start:json-server
npm run start:ng
```

Goto in browser http://localhost:4200

## Deploy

<https://angular.io/guide/deployment>

Build in first terminal: `ng build --watch` in npm alias:

```bash
npm run build
```

## Google Cloud

tbc

## APIs repos

- Oracle [3d-inventory-oracle-api](https://github.com/karol-preiskorn/3d-inventory-oracle-api)
- Mongo Atlas ✨ [3d-inventory-mongo-api](https://github.com/karol-preiskorn/3d-inventory-mongo-api)

## Contributing

Pull requests are welcome. For major changes, please open an [issue](https://github.com/karol-preiskorn/3d-inventory-angular-ui/issues/new) first to discuss what you would like to change. Please make sure to update tests as appropriate. Don't forget about the [code guidelines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines).

## Next todo/progress/ideas

- [x] Connection between showing 3D and defined devices.
- [x] Build interface to Mongo Atlas.
- [x] Set position and model in data and show this data in `3D`.
- [ ] Show attributes of `DEVICES`, `MODELS`, and `CONNECTIONS`.
  - [ ] Attributes will show as a table of AttributesDictionary types + value.
- [x] Generate `FLOOR`.
  - [x] As an array of squares (x, y, h).
- [x] `Docker` -> Serve application in `GitHub Pages` --> `AWS EC2`.
- [ ] ~~Use Dev container in `GitHub` for development.~~
- [x] Recognize `Grunt`/`Gulp` to `CI`/`CD` use in this project.
- [x] Add actual tasks from `GitHub` during build in README.md.
- [x] Add light/dark theme switch in `UI`.
- [ ] Use <https://formly.dev/> ?
- [ ] Create blog on GitHub Pages or use <https://ultimasolution.pl>.
  - [ ] Start writing blog articles.
- [x] Try using NgDoc to document [how to use code with NgDoc](https://medium.com/@askoropad/ngdoc-documentation-for-angular-projects-3f6ea8fc22b0).
  - [ ] Use tsdoc (middle fun).
