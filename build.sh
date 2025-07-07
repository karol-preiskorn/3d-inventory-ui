#!/bin/bash
docker rm -f 3d-inventory-angular-ui 2>/dev/null
docker build -t 3d-inventory-angular-ui .
docker tag 3d-inventory-angular-ui docker.io/kpreiskorn/3d-inventory-angular-ui:latest
docker run -d --name 3d-inventory-angular-ui 3d-inventory-angular-ui
