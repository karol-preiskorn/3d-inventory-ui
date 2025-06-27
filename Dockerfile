# Build stage
FROM node:24-alpine AS build

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN apk update && apk upgrade
RUN apk add --no-cache openssl
RUN npm install && npx ng build

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /usr/src/app/localhost.key -out /usr/src/app/localhost.crt -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"


# Production stage
FROM nginx:latest
# FROM node:24-alpine AS production
# RUN apk update && apk upgrade
# RUN apk add --no-cache nginx
COPY --from=build /usr/src/app/dist/browser /usr/share/nginx/html
COPY --from=build /usr/src/app/localhost.crt /etc/ssl/certs/localhost.crt
COPY --from=build /usr/src/app/localhost.key /etc/ssl/private/localhost.key
COPY --from=build /usr/src/app/default.conf /etc/nginx/sites-available/default
COPY --from=build /usr/src/app/default.conf /etc/nginx/conf.d/default.conf
# RUN ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
