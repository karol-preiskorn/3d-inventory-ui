# 3d inventory

1. [3d inventory](#3d-inventory)
   1. [About project](#about-project)
   2. [Technology stack](#technology-stack)
   3. [Inventory](#inventory)
   4. [Data Model](#data-model)
      1. [Logical model](#logical-model)
   5. [Application](#application)
      1. [List devices](#list-devices)
      2. [Models](#models)
      3. [Attributes](#attributes)
      4. [Attribute Dictionary](#attribute-dictionary)
      5. [Connections](#connections)
   6. [Run](#run)
   7. [Deploy](#deploy)
   8. [Containers](#containers)
   9. [APIs repos](#apis-repos)
   10. [Contributing](#contributing)
   11. [Next todo](#next-todo)

[![wakatime](https://wakatime.com/badge/user/3bbeedbe-0c6a-4a01-b3cd-a85d319a03bf/project/018c62ce-6164-4200-bca9-be53af7f6d80.svg)](https://wakatime.com/badge/user/3bbeedbe-0c6a-4a01-b3cd-a85d319a03bf/project/018c62ce-6164-4200-bca9-be53af7f6d80) [![GitHub latest commit](https://badgen.net/github/last-commit/karol-preiskorn/3d-inventory-angular-ui)](https://GitHub.com/karol-preiskorn/3d-inventory-angular-ui/commit/) [![GitHub stars](https://img.shields.io/github/stars/karol-preiskorn/3d-inventory-angular-ui.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/karol-preiskorn/3d-inventory-angular-ui/stargazers/) [![GitHub issues](https://img.shields.io/github/issues/karol-preiskorn/3d-inventory-angular-ui.svg)](https://GitHub.com/karol-preiskorn/3d-inventory-angular-ui/issues/)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/) [![TypeScript](https://img.shields.io/badge/--3178C6?logo=typescript&logoColor=ffffff)](https://www.typescriptlang.org/) [![Npm](https://badgen.net/badge/icon/npm?icon=npm&label)](https://https://npmjs.com/) [![GitHub license](https://badgen.net/github/license/karol-preiskorn/3d-inventory-angular-ui)](https://github.com/karol-preiskorn/3d-inventory-angular-ui/blob/master/LICENSE)

## About project

Project create ✨`3d inventory`✨— solution that allows you to build a spatial and database representation of yours warehouses or datacenters.

Motivation

    I'm programming to incorporate database systems. This project it is sandbox to covers relevant topics
    and issues related to create simple and efficient platform for graphics representation IT inventory.

<img title="Architecture" src="src/assets/architecture.drawio.png" style="filter: drop-shadow(8px 8px 8px black); border-radius: 1%; margin-bottom: 16px" width="85%">

Project contain three repos:

- ⚓ https://github.com/karol-preiskorn/3d-inventory-angular-ui
- ⚓ https://github.com/karol-preiskorn/3d-inventory-mongo-api
- ⚓ https://github.com/karol-preiskorn/3d-inventory-oracle-api

## Technology stack

- `Angular` 19+ - as a Corp framework.
- `Bootstrap` 5.3+ - logic for insert `UI` data
- `tree.js` 163+ - as best graph framework.
- `MongoAtlas`|`Oracle` - I want in this project try different solution and different data structure and storage datamodels relational and noSQL.
- `REST` - prepared `API` in use in `Swagger`.
- `Docker` as containers

## Inventory

`3d inventory` use `Angular` for UI and `three.js` framework for graphics representation.

[<img title="3-d inventory the video" src="src/assets/img/3d-inventory-demo.png" style="filter: drop-shadow(8px 8px 8px black); border-radius: 1%;" width="85%"/>](https://youtu.be/rNOxpZ0ti1Q '3-d inventory the video')

This project build from this example: [Tutorial to render 3D 3d in Angular + Three.js](https://srivastavaanurag79.medium.com/hello-3d-your-first-three-js-scene-in-angular-176c44b9c6c0).

## Data Model

Data model starts from implementation parametric generic attribute class. All attributes for `Devices`, `Models` and `Connections` are stored in this model.

Parameters types are defined in `Attribute Dictionary`.

In `Attributes` are stored values defined in `Attributes Dictionary` for `Devices`, `Model` and `Connections`. `Attributes Dictionary` are defined for specyfice parameters this entities.

I have a lot oo fun to learn how convert relational DB structures to correct collection in noSql Mongo DB.

### Logical model

Relational data model is mapped to noSQL model im MondoDb.

<img title="Logical model" src="src/assets/3d-inventory.png" style="filter: drop-shadow(0 0 1rem black); border-radius: 1%;" width="85%"/>

## Application

### List devices

<img title="List devices" src="src/assets/img/Screenshot%202023-07-14%20at%2008-48-50%203d%20inventory-watermark.png" style="filter: drop-shadow(0 0 1rem black); border-radius: 1%;" width="80%"/>

### Models

<img title="Models" src="src/assets/img/Screenshot%202023-07-14%20at%2008-49-31%203d%20inventory-watermark.png" style="filter: drop-shadow(0 0 1rem black); border-radius: 1%;" width="80%"/>

### Attributes

<img title="Attributes" src="src/assets/img/Screenshot%202023-07-14%20at%2008-49-42%203d%20inventory-watermark.png" style="filter: drop-shadow(0 0 1rem black); border-radius: 1%;" width="80%"/>

### Attribute Dictionary

<img title="Attribute Dictionary" src="src/assets/img/Screenshot%202023-07-14%20at%2008-49-51%203d%20inventory-watermark.png" style="filter: drop-shadow(0 0 1rem black); border-radius: 1%;" width="80%"/>

### Connections

<img title="Connections" src="src/assets/img/Screenshot%202023-07-14%20at%2008-50-00%203d%20inventory-watermark.png" style="filter: drop-shadow(0 0 1rem black); border-radius: 1%;" width="80%"/>

## Run

```bash
git clone https://github.com/karol-preiskorn/3d-inventory-angular-ui.git
cd 3d-inventory-angular-ui
npm install
npm run start
```

Goto in browser [http://localhost:4200](http://localhost:4200)

## Deploy

<https://angular.io/guide/deployment>

Build in first terminal: `ng build --watch` in npm alias:

```bash
npm run build
```

## Containers

To containerize i use Docker as most popular at this moment. I have plan to put this containers to Google Cloud.

## APIs repos

- Oracle [3d-inventory-oracle-api](https://github.com/karol-preiskorn/3d-inventory-oracle-api)
- Mongo Atlas ✨ [3d-inventory-mongo-api](https://github.com/karol-preiskorn/3d-inventory-mongo-api)

## Contributing

Pull requests are welcome. For major changes, please open an [issue](https://github.com/karol-preiskorn/3d-inventory-angular-ui/issues/new) first to discuss what you would like to change. Please make sure to update tests as appropriate. Not forget about [code guide-lines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines).

## Next todo

- [ ] Show attributes of `DEVICES`, `MODELS` and `CONNECTIONS`. Waiting for MongoDB|Oracle API.
- [ ] as array of square (x, y, h).
- [ ] `Docker` -> serve application in `Github Pages` --> `AWS EC2`
- [ ] Use Dev container in `GitHub` for development.
- [ ] Use <https://formly.dev/>.
- [ ] Create blog on GitHub Pages or use <https://ultimasolution.pl>.
