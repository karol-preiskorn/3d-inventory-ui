# Install gcloud CLI

curl https://sdk.cloud.google.com | bash
exec -l $SHELL

## Login and set project

```bash
gcloud auth login
gcloud config set project $GCP_PROJECT_ID

gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

## Cloud Run Deployment (Recommended)

Method 1: Direct from Docker Hub

## Tag and push to Google Container Registry

```bash
docker tag 3d-inventory-ui gcr.io/$GH_USERNAME/3d-inventory-ui:latest
docker push gcr.io/$GH_USERNAME/3d-inventory-ui:latest
```

## Deploy to Cloud Run

### GCR

```
gcloud config set run/region europe-west1
gcloud config set compute/region europe-west1
```

```bash
docker tag 3d-inventory-ui gcr.io/d-inventory-406007/3d-inventory-ui:latest
docker push gcr.io/d-inventory-406007/3d-inventory-ui:latest
```

```bash
gcloud run deploy d-inventory-ui \
  --image gcr.io/d-inventory-406007/3d-inventory-ui:latest \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 433 \
  --memory 512Mi \
  --cpu 1
```

### GHR

```bash
gcloud run deploy d-inventory-ui \
  --image ghcr.io/karol-preiskorn/3d-inventory-ui:latest \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 433 \
  --memory 512Mi \
  --cpu 1
```
