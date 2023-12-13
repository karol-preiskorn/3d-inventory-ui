# STAGE 1
FROM node:alpine as build
RUN apk update && apk add --no-cache make git python3 g++
WORKDIR /usr/src/app

RUN npm install -g @angular/cli

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# STAGE 2
FROM docker://nginx as runtime
# COPY nginx.conf /etc/nginx/nginx.conf
COPY backend /usr/share/nginx/html
COPY --from=build /usr/src/app/dist/3d-inventory-angular-ui/browser /usr/share/nginx/html
