#!/bin/bash
set -e

EXPOSED_PORT=${EXPOSED_PORT:-8080}

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
