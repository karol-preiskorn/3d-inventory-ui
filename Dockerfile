# Build stage
FROM node:24-alpine AS build

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs && \
  adduser -S angular -u 1001

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN apk update && apk upgrade
RUN apk add --no-cache openssl
COPY package.json package-lock.json .npmrc ./
RUN npm ci
# RUN npx ng build --configuration development
RUN npx ng build 3d-inventory-angular-ui --configuration production

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /usr/src/app/localhost.key -out /usr/src/app/localhost.crt -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"


# Production stage
FROM nginx:latest AS production
# FROM node:24-alpine AS production
# RUN apk update && apk upgrade
# RUN apk add --no-cache nginx
COPY --from=build /usr/src/app/dist/browser /usr/share/nginx/html
COPY --from=build /usr/src/app/localhost.crt /etc/ssl/certs/localhost.crt
COPY --from=build /usr/src/app/localhost.key /etc/ssl/private/localhost.key
COPY --from=build /usr/src/app/default.conf /etc/nginx/sites-available/default
COPY --from=build /usr/src/app/default.conf /etc/nginx/conf.d/default.conf
# RUN ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
  chown nginx:nginx /etc/ssl/certs/localhost.crt && \
  chown nginx:nginx /etc/ssl/private/localhost.key && \
  chmod 644 /etc/ssl/certs/localhost.crt && \
  chmod 600 /etc/ssl/private/localhost.key

# Health check
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD curl -f https://localhost:443/ || exit 1

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
