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
REPO_URL="https://github.com/your-username/lighthouse-backend.git"
DEPLOY_USER="ubuntu"

# Function to update system packages
update_system() {
    log "Updating system packages..."
    
    sudo apt update
    sudo apt upgrade -y
    
    log "System packages updated"
}

# Function to install required packages
install_packages() {
    log "Installing required packages..."
    
    # Install essential packages
    sudo apt install -y \
        curl \
        wget \
        git \
        unzip \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release \
        htop \
        nginx \
        ufw
    
    log "Required packages installed"
}

# Function to install Docker
install_docker() {
    log "Installing Docker..."
    
    # Remove old versions
    sudo apt remove -y docker docker-engine docker.io containerd runc || true
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Add Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Update package index
    sudo apt update
    
    # Install Docker
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Add user to docker group
    sudo usermod -aG docker $DEPLOY_USER
    
    # Start and enable Docker
    sudo systemctl start docker
    sudo systemctl enable docker
    
    log "Docker installed successfully"
}

# Function to install Docker Compose
install_docker_compose() {
    log "Installing Docker Compose..."
    
    # Install Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    # Create symlink
    sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    
    log "Docker Compose installed successfully"
}

# Function to setup firewall
setup_firewall() {
    log "Setting up firewall..."
    
    # Reset firewall
    sudo ufw --force reset
    
    # Set default policies
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    
    # Allow SSH
    sudo ufw allow ssh
    
    # Allow HTTP and HTTPS
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    
    # Allow application port
    sudo ufw allow 13001/tcp
    
    # Allow Redis port (if needed externally)
    sudo ufw allow 6379/tcp
    
    # Enable firewall
    sudo ufw --force enable
    
    log "Firewall configured successfully"
}

# Function to setup Nginx
setup_nginx() {
    log "Setting up Nginx..."
    
    # Create Nginx configuration
    sudo tee /etc/nginx/sites-available/lighthouse-backend << 'EOF'
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:13001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
    
    # Enable site
    sudo ln -sf /etc/nginx/sites-available/lighthouse-backend /etc/nginx/sites-enabled/
    
    # Remove default site
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test configuration
    sudo nginx -t
    
    # Restart Nginx
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    log "Nginx configured successfully"
}

# Function to create application directory
create_app_directory() {
    log "Creating application directory..."
    
    # Create directory
    sudo mkdir -p $APP_DIR
    sudo chown $DEPLOY_USER:$DEPLOY_USER $APP_DIR
    
    # Create backup directory
    sudo mkdir -p /opt/backups
    sudo chown $DEPLOY_USER:$DEPLOY_USER /opt/backups
    
    log "Application directory created"
}

# Function to clone repository
clone_repository() {
    log "Cloning repository..."
    
    cd $APP_DIR
    
    # Clone repository
    git clone $REPO_URL . || {
        error "Failed to clone repository"
        exit 1
    }
    
    # Checkout development branch
    git checkout development || {
        warn "Development branch not found, staying on default branch"
    }
    
    log "Repository cloned successfully"
}

# Function to setup log rotation
setup_log_rotation() {
    log "Setting up log rotation..."
    
    # Create logrotate configuration
    sudo tee /etc/logrotate.d/lighthouse-backend << 'EOF'
/opt/lighthouse-backend/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
    postrotate
        docker-compose -f /opt/lighthouse-backend/docker-compose.yaml restart lighthouse-backend
    endscript
}
EOF
    
    log "Log rotation configured"
}

# Function to setup monitoring
setup_monitoring() {
    log "Setting up basic monitoring..."
    
    # Create monitoring script
    sudo tee /opt/monitor.sh << 'EOF'
#!/bin/bash

# Check if containers are running
if ! docker-compose -f /opt/lighthouse-backend/docker-compose.yaml ps | grep -q "Up"; then
    echo "$(date): Containers are down, restarting..." >> /var/log/lighthouse-monitor.log
    cd /opt/lighthouse-backend
    docker-compose up -d
fi

# Check application health
if ! curl -f http://localhost:13001/health > /dev/null 2>&1; then
    echo "$(date): Application health check failed" >> /var/log/lighthouse-monitor.log
fi
EOF
    
    # Make script executable
    sudo chmod +x /opt/monitor.sh
    
    # Add to crontab
    (crontab -l 2>/dev/null; echo "*/5 * * * * /opt/monitor.sh") | crontab -
    
    log "Monitoring setup completed"
}

# Function to setup SSL (optional)
setup_ssl() {
    log "Setting up SSL with Let's Encrypt..."
    
    # Install Certbot
    sudo apt install -y certbot python3-certbot-nginx
    
    # Get domain from user
    read -p "Enter your domain name (or press Enter to skip SSL setup): " DOMAIN
    
    if [ -n "$DOMAIN" ]; then
        # Update Nginx configuration with domain
        sudo sed -i "s/server_name _;/server_name $DOMAIN;/" /etc/nginx/sites-available/lighthouse-backend
        
        # Restart Nginx
        sudo systemctl restart nginx
        
        # Obtain SSL certificate
        sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN || {
            warn "SSL certificate setup failed, continuing without SSL"
        }
        
        log "SSL setup completed for domain: $DOMAIN"
    else
        log "Skipping SSL setup"
    fi
}

# Function to create deployment user
create_deployment_user() {
    log "Setting up deployment user..."
    
    # Create deployment user if it doesn't exist
    if ! id "$DEPLOY_USER" &>/dev/null; then
        sudo useradd -m -s /bin/bash $DEPLOY_USER
        sudo usermod -aG sudo $DEPLOY_USER
        log "Created deployment user: $DEPLOY_USER"
    fi
    
    # Setup SSH key for deployment user
    sudo mkdir -p /home/$DEPLOY_USER/.ssh
    sudo chmod 700 /home/$DEPLOY_USER/.ssh
    
    log "Deployment user setup completed"
}

# Main setup function
main() {
    log "Starting server setup for $APP_NAME..."
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        error "Please do not run this script as root"
        exit 1
    fi
    
    # Execute setup steps
    update_system
    install_packages
    install_docker
    install_docker_compose
    setup_firewall
    setup_nginx
    create_app_directory
    clone_repository
    setup_log_rotation
    setup_monitoring
    create_deployment_user
    
    # Optional SSL setup
    setup_ssl
    
    log "Server setup completed successfully!"
    log "Next steps:"
    log "1. Add your SSH public key to /home/$DEPLOY_USER/.ssh/authorized_keys"
    log "2. Configure GitHub secrets for deployment"
    log "3. Run the first deployment manually or push to development branch"
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo "Options:"
        echo "  --help, -h    Show this help message"
        echo "  --no-ssl      Skip SSL setup"
        ;;
    --no-ssl)
        # Override setup_ssl function to do nothing
        setup_ssl() {
            log "Skipping SSL setup as requested"
        }
        main
        ;;
    *)
        main
        ;;
esac 