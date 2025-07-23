# Lighthouse Backend Deployment Guide

This guide explains how to set up automated deployment for the Lighthouse Backend application using GitHub Actions and an Ubuntu server.

## Overview

The deployment setup includes:
- GitHub Actions workflow for CI/CD
- Ubuntu server with Docker and Docker Compose
- Automated deployment on push to `development` branch
- Health checks and rollback capabilities
- SSL support with Let's Encrypt
- Monitoring and logging

## Prerequisites

1. **Ubuntu Server (20.04 LTS or later)**
   - Minimum 2GB RAM
   - 20GB storage
   - Public IP address

2. **GitHub Repository**
   - Repository with your code
   - Access to GitHub Secrets

3. **Domain Name (Optional)**
   - For SSL certificate setup

## Server Setup

### 1. Initial Server Preparation

SSH into your Ubuntu server and run the setup script:

```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/your-username/lighthouse-backend/main/scripts/setup-server.sh | bash
```

Or manually:

```bash
# Clone the repository
git clone https://github.com/your-username/lighthouse-backend.git
cd lighthouse-backend

# Make scripts executable
chmod +x scripts/setup-server.sh
chmod +x scripts/deploy.sh

# Run setup
./scripts/setup-server.sh
```

### 2. SSH Key Setup

Generate an SSH key pair for deployment:

```bash
# Generate SSH key
ssh-keygen -t rsa -b 4096 -C "deployment@your-domain.com"

# Copy public key to server
ssh-copy-id ubuntu@your-server-ip
```

### 3. Server Configuration

The setup script will:
- Install Docker and Docker Compose
- Configure Nginx as reverse proxy
- Set up firewall rules
- Create application directories
- Configure log rotation
- Set up basic monitoring

## GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

### Required Secrets

| Secret Name | Description |
|-------------|-------------|
| `SSH_HOST` | Your Ubuntu server IP address |
| `SSH_USER` | SSH username (usually `ubuntu`) |
| `SSH_PRIVATE_KEY` | Your private SSH key content |
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `AWS_REGION` | AWS region |

### Application Environment Variables

| Secret Name | Description |
|-------------|-------------|
| `PORT` | Application port (default: 13001) |
| `ENVIRONMENT` | Environment name (development/production) |
| `JWT_SECRET` | JWT secret key |
| `JWT_REFRESH_SECRET` | JWT refresh secret |
| `REDIS_PASSWORD` | Redis password |
| `REDIS_URL` | Redis connection URL |
| `STRIPE_KEY` | Stripe API key |
| `STRIPE_WEBHOOK` | Stripe webhook secret |
| `SMTP_EMAIL_HOST` | SMTP server host |
| `SMTP_EMAIL_PASSWORD` | SMTP password |
| `SMTP_EMAIL_ID` | SMTP email address |

### Wallet and Blockchain Configuration

| Secret Name | Description |
|-------------|-------------|
| `TEST_WALLET1_PRIVATE_KEY` | Test wallet 1 private key |
| `TEST_WALLET2_PRIVATE_KEY` | Test wallet 2 private key |
| `TEST_WALLET3_PRIVATE_KEY` | Test wallet 3 private key |
| `TEST_WALLET4_PRIVATE_KEY` | Test wallet 4 private key |
| `TEST_WALLET5_PRIVATE_KEY` | Test wallet 5 private key |
| `TEST_WALLET6_PRIVATE_KEY` | Test wallet 6 private key |
| `TEST_WALLET6_API_KEY` | Test wallet 6 API key |
| `TEST_WALLET7_API_KEY` | Test wallet 7 API key |
| `TEST_WALLET7_API_KEY_DEVELOPMENT` | Test wallet 7 development API key |

### Lighthouse Configuration

| Secret Name | Description |
|-------------|-------------|
| `LIGHTHOUSE_IPNS_NODE` | Lighthouse IPNS node URL |
| `LIGHTHOUSE_PUBLIC_NODE_TOKEN` | Lighthouse public node token |
| `LIGHTHOUSE_BILLING_ADDRESS` | Lighthouse billing address |
| `LIGHTHOUSE_ENC_MESSAGE_TOKENS` | Lighthouse encrypted message tokens |
| `LIGHTHOUSE_COREUM_ADDRESS` | Lighthouse Coreum address |
| `LIGHTHOUSE_RADIX_ADDRESS` | Lighthouse Radix address |

### Network Configuration

| Secret Name | Description |
|-------------|-------------|
| `POLYGON_RPC` | Polygon RPC endpoint |
| `FILECOIN_RPC` | Filecoin RPC endpoint |
| `ROUTE_ACCESS_TOKEN` | Route access token |
| `TRANSACTION_ROUTE_TOKEN` | Transaction route token |
| `RADIX_DAPP_DEFINATION` | Radix dApp definition |
| `RADIX_NETWORK_ID` | Radix network ID |
| `RADIX_EXPECTED_ORIGIN` | Radix expected origin |

## Deployment Process

### 1. Automatic Deployment

When you push code to the `development` branch, the GitHub Actions workflow will:

1. Run tests and linting
2. Build the Docker image
3. Deploy to the Ubuntu server
4. Perform health checks
5. Rollback on failure

### 2. Manual Deployment

To deploy manually:

```bash
# SSH into the server
ssh ubuntu@your-server-ip

# Navigate to application directory
cd /opt/lighthouse-backend

# Run deployment script
./scripts/deploy.sh
```

### 3. Deployment Status

Check deployment status:

```bash
# Check container status
docker-compose ps

# Check logs
docker-compose logs -f lighthouse-backend

# Check application health
curl http://localhost:13001/health
```

## Monitoring and Maintenance

### 1. Logs

Application logs are available at:
- Docker logs: `docker-compose logs lighthouse-backend`
- Application logs: `/opt/lighthouse-backend/logs/`
- System logs: `/var/log/lighthouse-monitor.log`

### 2. Monitoring

The setup includes:
- Health check monitoring every 5 minutes
- Automatic container restart on failure
- Log rotation (7 days retention)

### 3. Backup and Rollback

- Automatic backups before each deployment
- Manual rollback: `./scripts/deploy.sh --rollback`
- Backup location: `/opt/backups/`

### 4. SSL Certificate

For SSL setup:
1. Run setup script with domain: `./scripts/setup-server.sh`
2. Enter your domain when prompted
3. Certbot will automatically obtain and renew certificates

## Troubleshooting

### Common Issues

1. **Deployment fails**
   - Check GitHub Actions logs
   - Verify all secrets are configured
   - Check server connectivity

2. **Application not starting**
   - Check Docker logs: `docker-compose logs`
   - Verify environment variables
   - Check port availability

3. **Health check fails**
   - Verify application is running
   - Check firewall rules
   - Verify Nginx configuration

### Useful Commands

```bash
# Check system status
systemctl status docker nginx

# View application logs
tail -f /opt/lighthouse-backend/logs/app.log

# Restart services
docker-compose restart

# Check disk space
df -h

# Check memory usage
free -h

# Monitor system resources
htop
```

## Security Considerations

1. **Firewall**: Only necessary ports are open (22, 80, 443, 13001)
2. **SSL**: Use Let's Encrypt for HTTPS
3. **Updates**: Regular system updates via setup script
4. **Backups**: Automatic backups before deployments
5. **Monitoring**: Health checks and automatic restart

## Scaling Considerations

For production scaling:
1. Use load balancer for multiple instances
2. Implement database clustering
3. Use managed Redis service
4. Set up proper monitoring (Prometheus/Grafana)
5. Implement proper backup strategy

## Support

For issues or questions:
1. Check the logs and error messages
2. Review the deployment script output
3. Verify all configuration is correct
4. Test connectivity and permissions

## File Structure

```
lighthouse-backend/
├── .github/
│   └── workflows/
│       └── deploy-development.yml
├── scripts/
│   ├── deploy.sh
│   └── setup-server.sh
├── docker-compose.yaml
├── dockerfile
├── package.json
└── DEPLOYMENT.md
```

This deployment setup provides a robust, automated CI/CD pipeline with proper monitoring, backup, and rollback capabilities. 