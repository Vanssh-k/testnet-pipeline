#!/usr/bin/env just --justfile

# Docker image name
DOCKER_IMAGE := 'prod/lighthouse-backend'

# ECR repository details
ECR_REPO := '050633092828.dkr.ecr.us-east-2.amazonaws.com'
ECR_REPO_NAME := ECR_REPO +"/"+ DOCKER_IMAGE

# Show all available recipes
_default:
  @just --list --unsorted

# Build the Docker image
build:
  docker build --platform=linux/amd64 -t {{DOCKER_IMAGE}} .

# Tag the Docker image
tag:
  docker tag {{DOCKER_IMAGE}}:latest {{ECR_REPO_NAME}}:latest

# Push the Docker image to ECR
push:
  docker push {{ECR_REPO_NAME}}:latest

# Build, tag, and push the Docker image
build-tag-push: 
  just build && just tag && just push
