#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Configuration
APP_NAME="lighthouse-backend"
APP_DIR="/opt/lighthouse-backend"
BACKUP_DIR="/opt/backups"
DOCKER_COMPOSE_FILE="$APP_DIR/docker-compose.yaml"

# Create necessary directories
mkdir -p $BACKUP_DIR

# Function to backup current deployment
backup_current() {
    log "Creating backup of current deployment..."
    
    if [ -d "$APP_DIR" ]; then
        BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
        cp -r $APP_DIR $BACKUP_DIR/$BACKUP_NAME
        log "Backup created: $BACKUP_DIR/$BACKUP_NAME"
    fi
}

# Function to stop services
stop_services() {
    log "Stopping existing services..."
    
    if [ -f "$DOCKER_COMPOSE_FILE" ]; then
        cd $APP_DIR
        docker-compose down --remove-orphans || true
        log "Services stopped"
    else
        warn "No docker-compose.yaml found, skipping service stop"
    fi
}

# Function to clean up old images
cleanup_images() {
    log "Cleaning up old Docker images..."
    
    # Remove old lighthouse-backend images
    docker images | grep lighthouse-backend | awk '{print $3}' | xargs -r docker rmi -f || true
    
    # Remove dangling images
    docker image prune -f || true
    
    log "Cleanup completed"
}

# Function to pull latest code
pull_latest_code() {
    log "Pulling latest code from repository..."
    
    cd $APP_DIR
    
    # Stash any local changes
    git stash || true
    
    # Pull latest changes
    git pull origin development || {
        error "Failed to pull latest code"
        exit 1
    }
    
    log "Latest code pulled successfully"
}

# Function to build and start services
deploy_services() {
    log "Building and starting services..."
    
    cd $APP_DIR
    
    # Build the application
    docker-compose build --no-cache || {
        error "Failed to build Docker images"
        exit 1
    }
    
    # Start services
    docker-compose up -d || {
        error "Failed to start services"
        exit 1
    }
    
    log "Services started successfully"
}

# Function to wait for services to be healthy
wait_for_health() {
    log "Waiting for services to be healthy..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:13001/health > /dev/null 2>&1; then
            log "Application is healthy!"
            return 0
        fi
        
        log "Health check attempt $attempt/$max_attempts failed, retrying in 10 seconds..."
        sleep 10
        attempt=$((attempt + 1))
    done
    
    error "Application failed to become healthy after $max_attempts attempts"
    return 1
}

# Function to rollback on failure
rollback() {
    error "Deployment failed, attempting rollback..."
    
    # Stop current services
    cd $APP_DIR
    docker-compose down --remove-orphans || true
    
    # Find latest backup
    LATEST_BACKUP=$(ls -t $BACKUP_DIR | grep backup- | head -1)
    
    if [ -n "$LATEST_BACKUP" ]; then
        log "Rolling back to backup: $LATEST_BACKUP"
        
        # Remove current deployment
        rm -rf $APP_DIR
        
        # Restore from backup
        cp -r $BACKUP_DIR/$LATEST_BACKUP $APP_DIR
        
        # Start services
        cd $APP_DIR
        docker-compose up -d || {
            error "Rollback failed"
            exit 1
        }
        
        log "Rollback completed successfully"
    else
        error "No backup found for rollback"
        exit 1
    fi
}

# Main deployment function
main() {
    log "Starting deployment of $APP_NAME..."
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        error "Please do not run this script as root"
        exit 1
    fi
    
    # Check if app directory exists
    if [ ! -d "$APP_DIR" ]; then
        error "Application directory $APP_DIR does not exist"
        exit 1
    fi
    
    # Check if docker is running
    if ! docker info > /dev/null 2>&1; then
        error "Docker is not running"
        exit 1
    fi
    
    # Check if docker-compose is available
    if ! command -v docker-compose > /dev/null 2>&1; then
        error "docker-compose is not installed"
        exit 1
    fi
    
    # Execute deployment steps
    backup_current
    stop_services
    cleanup_images
    pull_latest_code
    
    # Deploy with error handling
    if deploy_services; then
        if wait_for_health; then
            log "Deployment completed successfully!"
            
            # Clean up old backups (keep last 5)
            cd $BACKUP_DIR
            ls -t | grep backup- | tail -n +6 | xargs -r rm -rf
            
            exit 0
        else
            rollback
        fi
    else
        rollback
    fi
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo "Options:"
        echo "  --help, -h    Show this help message"
        echo "  --rollback     Rollback to previous deployment"
        echo "  --status       Show deployment status"
        ;;
    --rollback)
        rollback
        ;;
    --status)
        cd $APP_DIR
        docker-compose ps
        ;;
    *)
        main
        ;;
esac 