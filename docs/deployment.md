# Deployment Guide

This document provides guidelines for deploying the NestJS microservice template to various environments.

## Table of Contents
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Environment Variables](#environment-variables)
- [CI/CD Pipeline](#cicd-pipeline)

## Docker Deployment

### Building the Production Docker Image

The template includes a production Dockerfile in the `docker` directory.

```bash
# Build the production Docker image
docker build -t microservice-name -f docker/Dockerfile.prod .

# Run the production Docker image
docker run -p 3000:3000 --env-file .env.prod microservice-name
```

### Docker Compose for Production

For a complete stack deployment with databases:

```bash
# Create a production-specific docker-compose file
docker-compose -f docker-compose.prod.yml up -d
```

Example `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: ./docker/Dockerfile.prod
    ports:
      - "3000:3000"
    env_file:
      - .env.prod
    depends_on:
      - postgres
      - redis
    restart: always

  postgres:
    image: postgres:14
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data
    restart: always

volumes:
  postgres_data:
  redis_data:
```

## Kubernetes Deployment

For deploying to Kubernetes, you can use the following manifests as a starting point.

### Namespace

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: microservice-ns
```

### ConfigMap and Secrets

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: microservice-config
  namespace: microservice-ns
data:
  NODE_ENV: "production"
  PORT: "3000"
  POSTGRES_HOST: "postgres-service"
  POSTGRES_PORT: "5432"
  POSTGRES_DB: "database"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
```

```yaml
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: microservice-secrets
  namespace: microservice-ns
type: Opaque
data:
  POSTGRES_USER: <base64-encoded-user>
  POSTGRES_PASSWORD: <base64-encoded-password>
```

### Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: microservice
  namespace: microservice-ns
spec:
  replicas: 3
  selector:
    matchLabels:
      app: microservice
  template:
    metadata:
      labels:
        app: microservice
    spec:
      containers:
      - name: microservice
        image: microservice-name:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: microservice-config
        - secretRef:
            name: microservice-secrets
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "200m"
            memory: "256Mi"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Service

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: microservice-service
  namespace: microservice-ns
spec:
  selector:
    app: microservice
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
```

### Ingress

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: microservice-ingress
  namespace: microservice-ns
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - api.yourdomain.com
    secretName: microservice-tls
  rules:
  - host: api.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: microservice-service
            port:
              number: 80
```

### Applying Kubernetes Manifests

```bash
# Apply all manifests
kubectl apply -f k8s/
```

## Environment Variables

The microservice template uses environment variables for configuration. Here is a list of the required environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment (development, production) | development |
| PORT | HTTP port | 3000 |
| POSTGRES_HOST | PostgreSQL host | postgres |
| POSTGRES_PORT | PostgreSQL port | 5432 |
| POSTGRES_USER | PostgreSQL user | postgres |
| POSTGRES_PASSWORD | PostgreSQL password | postgres |
| POSTGRES_DB | PostgreSQL database name | database |
| MONGODB_URI | MongoDB connection URI | mongodb://mongodb:27017/database |
| REDIS_HOST | Redis host | redis |
| REDIS_PORT | Redis port | 6379 |

## CI/CD Pipeline

Here's an example GitHub Actions workflow to automate the CI/CD process:

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - name: Install dependencies
      run: npm ci
    - name: Run tests
      run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    - name: Login to DockerHub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    - name: Build and push
      uses: docker/build-push-action@v3
      with:
        context: .
        file: ./docker/Dockerfile.prod
        push: true
        tags: yourusername/microservice-name:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    - name: Set up kubectl
      uses: azure/setup-kubectl@v3
    - name: Set Kubernetes context
      uses: azure/k8s-set-context@v3
      with:
        kubeconfig: ${{ secrets.KUBE_CONFIG }}
    - name: Deploy to Kubernetes
      run: kubectl apply -f k8s/
``` 