# 3d inventory

1. [3d inventory](#3d-inventory)
   1. [About](#about)
   2. [Motivation](#motivation)
   3. [Architecture](#architecture)
   4. [Technology stack](#technology-stack)
   5. [Demo video](#demo-video)
   6. [Data Model](#data-model)
      1. [Logical model](#logical-model)
   7. [Application](#application)
      1. [List devices](#list-devices)
      2. [Models](#models)
      3. [Attributes](#attributes)
      4. [Attribute Dictionary](#attribute-dictionary)
      5. [Connections](#connections)
   8. [Run](#run)
   9. [Deploy](#deploy)
   10. [Containers](#containers)
   11. [Contributing](#contributing)
   12. [License](#license)

[![wakatime](https://wakatime.com/badge/user/3bbeedbe-0c6a-4a01-b3cd-a85d319a03bf/project/018c62ce-6164-4200-bca9-be53af7f6d80.svg)](https://wakatime.com/badge/user/3bbeedbe-0c6a-4a01-b3cd-a85d319a03bf/project/018c62ce-6164-4200-bca9-be53af7f6d80) [![GitHub latest commit](https://badgen.net/github/last-commit/karol-preiskorn/3d-inventory-angular-ui)](https://GitHub.com/karol-preiskorn/3d-inventory-angular-ui/commit/) [![GitHub stars](https://img.shields.io/github/stars/karol-preiskorn/3d-inventory-angular-ui.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/karol-preiskorn/3d-inventory-angular-ui/stargazers/) [![GitHub issues](https://img.shields.io/github/issues/karol-preiskorn/3d-inventory-angular-ui.svg)](https://GitHub.com/karol-preiskorn/3d-inventory-angular-ui/issues/)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/) [![TypeScript](https://img.shields.io/badge/--3178C6?logo=typescript&logoColor=ffffff)](https://www.typescriptlang.org/) [![Npm](https://badgen.net/badge/icon/npm?icon=npm&label)](https://https://npmjs.com/) [![GitHub license](https://badgen.net/github/license/karol-preiskorn/3d-inventory-angular-ui)](https://github.com/karol-preiskorn/3d-inventory-angular-ui/blob/master/LICENSE)

## About

Project creates ✨`3d inventory`✨—a solution that allows you to build a spatial and database representation of your warehouses or datacenters.

## Motivation

I am developing this project as a sandbox to explore database systems. It covers relevant topics and issues related to creating a simple and efficient platform for graphical representation of IT inventory.

## Architecture

Project contain three repos:

- ⚓ https://github.com/karol-preiskorn/3d-inventory-angular-ui
- ⚓ https://github.com/karol-preiskorn/3d-inventory-mongo-api
- ⚓ https://github.com/karol-preiskorn/3d-inventory-oracle-api

## Technology stack

- `Angular` 19+ - as a Corp framework.
- `Bootstrap` 5.3+ - logic for insert `UI` data
- `tree.js` 163+ - as best graph framework.
- `MongoAtlas`|`Oracle` - I want to try different solutions and data structures, including both relational and NoSQL data models using MongoAtlas and Oracle.
- `REST` - prepared `API` documented and used in `Swagger`.
- `Docker` as containers

## Demo video

The `3d inventory` project leverages `Angular` for building the user interface and utilizes the `three.js` library to render interactive 3D graphics.

[<img title="3-d inventory the demo video" src="src/assets/img/2025-06-20_12-18_1.png" style="fborder-radius: 1%;filter: drop-shadow(0 0 1rem black); border-radius: 1%;" width="85%"/>](https://youtu.be/rNOxpZ0ti1Q '3-d inventory the video')

## Data Model

The data model is based on a parametric, generic attribute class. All attributes for `Devices`, `Models`, and `Connections` are stored in this model.

Parameter types are defined in the `Attribute Dictionary`.

Attributes store values defined in the `Attribute Dictionary` for `Devices`, `Models`, and `Connections`. The `Attribute Dictionary` specifies parameters for these entities.

I had a lot of fun learning how to convert relational DB structures to correct collections in NoSQL MongoDB.

### Logical model

Relational data model is mapped to a NoSQL model in MongoDB.

<img title="Logical model" src="src/assets/3d-inventory.png" style="filter: drop-shadow(0 0 1rem black); border-radius: 1%;" width="85%"/>

## Application

The 3D Inventory UI provides a comprehensive interface for managing inventory with spatial visualization and complete audit tracking.

### Key Features

#### 🎯 **Inventory Management**

- **3D Visualization**: Interactive three.js-based 3D floor plans
- **Device Management**: Create, edit, delete, and position devices on floor plans
- **Model Management**: Define device types, categories, and specifications
- **Connection Tracking**: Visualize and manage connections between devices
- **Attribute System**: Flexible metadata management with attribute dictionaries

#### 🔐 **User Management**

- **Role-Based Access**: Admin, User, and Viewer permission levels
- **User Profiles**: Personal profile management with login history
- **Authentication**: Secure JWT-based authentication with password requirements
- **Account Security**: Login attempt tracking and account protection

#### 📊 **Activity Monitoring & Audit Logs**

- **Activity Logs Dashboard** (Admin): Comprehensive audit trail for all system operations
  - Filter by component (device, model, floor, user, connection, etc.)
  - Filter by operation type (create, update, delete, clone)
  - Filter by date range
  - Search by username or object details
- **Change Tracking**: Detailed before/after value tracking for all updates
  - Field-level change detection (name, position, attributes, etc.)
  - Visual before → after display for modified values
  - Smart formatting for different data types (coordinates, arrays, objects)
- **Login History**:
  - View login attempts with success/failure status
  - IP address and timestamp tracking
  - Color-coded status indicators (success/failed/error)
  - Available in user profile and admin user management
- **User Context**: Every log entry includes who performed the action

### List devices

<img title="List devices" src="src/assets/img/Screenshot%202023-07-14%20at%2008-48-50%203d%20inventory-watermark.png" style="border-radius: 1%;filter: drop-shadow(0 0 1rem black); border-radius: 1%;" width="80%"/>

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
http://localhost:4200/

## Deploy

The application is deployed to Google Cloud Run:

- **Production URL**: https://d-inventory-ui-wzwe3odv7q-ew.a.run.app
- **Current Revision**: d-inventory-ui-00110-q8s
- **Backend API**: https://d-inventory-api-wzwe3odv7q-ew.a.run.app
- **Backend Revision**: d-inventory-api-00108-pr2

### Latest Features (October 12, 2025)

- ✅ Device change tracking with before/after values
- ✅ Activity Logs dashboard for administrators
- ✅ Login history tracking with IP addresses
- ✅ Enhanced audit trail for all CRUD operations
- ✅ Smart value formatting in activity logs

### Deployment Commands

<https://angular.io/guide/deployment>

Build in first terminal: `ng build --watch` in npm alias:

```bash
npm run build
```

## Containers

Docker is used for containerization, and deployment to Google Cloud is planned.

## Contributing

Pull requests are welcome. For major changes, please open an [issue](https://github.com/karol-preiskorn/3d-inventory-angular-ui/issues/new) first to discuss what you would like to change. Please make sure to update tests as appropriate. Do not forget about [code guidelines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines).

## License

[Creative Commons Legal Code](https://github.com/karol-preiskorn/3d-inventory-angular-ui/LICENSE)
