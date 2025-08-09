#!/bin/bash

# Build Docker image
echo "Building Docker image..."
docker build -t smash-vision-web .

# Tag for different environments
docker tag smash-vision-web:latest smash-vision-web:$(date +%Y%m%d-%H%M%S)

echo "Docker image built successfully!"
echo "To run locally: docker run -p 3000:80 smash-vision-web"
echo "To run with docker-compose: docker-compose up"