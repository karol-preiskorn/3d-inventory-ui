#!/bin/bash

if [[ -r .env ]]; then
  source .env
else
  exit 1
fi

trap 'docker ps -a --format "{{.Names}}" | grep -q "^3d-inventory-ui$" && docker rm -f 3d-inventory-ui 2>/dev/null' EXIT
# Ensure any existing container is removed on exit or error
trap 'docker rm -f 3d-inventory-ui 2>/dev/null' EXIT

docker ps --filter "name=3d-inventory-ui" --format "{{.ID}}" | xargs docker stop
docker ps -a --filter "name=3d-inventory-ui" --format "{{.ID}}" | xargs docker rm

if [[ -z "$GHCR_PAT" ]]; then
  echo "Error: GHCR_PAT environment variable is not set."
  exit 1
fi

if [[ -z "$GH_USERNAME" ]]; then
  echo "Error: GH_USERNAME environment variable is not set."
  exit 1
fi

echo $GHCR_PAT | docker login ghcr.io -u $GH_USERNAME --password-stdin

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VERSION=$(node -p "require('path').join(process.env.SCRIPT_DIR || '$SCRIPT_DIR', 'package.json'); require(require('path').join(process.env.SCRIPT_DIR || '$SCRIPT_DIR', 'package.json')).version")

docker rm -f 3d-inventory-ui 2>/dev/null

docker build --target cloudrun-t 3d-inventory-ui .

# docker tag 3d-inventory-ui ghcr.io/$GH_USERNAME/3d-inventory-ui:${VERSION}
docker tag 3d-inventory-ui ghcr.io/$GH_USERNAME/3d-inventory-ui:latest
# docker push ghcr.io/$GH_USERNAME/3d-inventory-ui:${VERSION}
docker push ghcr.io/$GH_USERNAME/3d-inventory-ui:latest

docker tag 3d-inventory-ui gcr.io/d-inventory-406007/3d-inventory-ui:latest
docker push gcr.io/d-inventory-406007/3d-inventory-ui:latest

EXPOSED_PORT=${EXPOSED_PORT:-8080}

if ! docker network ls --format '{{.Name}}' | grep -q '^3d-inventory-network$'; then
  docker network create --subnet=172.20.0.0/16 3d-inventory-network
fi

# Check if the IP is already in use
if docker ps -q --filter "network=3d-inventory-network" | xargs docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' | grep -q '^172.20.0.2$'; then
  echo "Error: IP address 172.20.0.2 is already in use on 3d-inventory-network."
  exit 1
fi

docker run --rm -d --network 3d-inventory-network --ip 172.20.0.2 -p ${EXPOSED_PORT}:${EXPOSED_PORT}/tcp 3d-inventory-ui:latest

gcloud run deploy d-inventory-ui \
  --image gcr.io/d-inventory-406007/3d-inventory-ui:latest \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port ${EXPOSED_PORT} \
  --memory 512Mi \
  --cpu 1

echo "Deployment completed successfully!"
echo "Service URL: $(gcloud run services describe d-inventory-ui --region europe-west1 --format 'value(status.url)')"
