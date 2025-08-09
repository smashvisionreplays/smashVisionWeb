# SmashVision Web Application

A React + Vite application for managing Smash Vision replays with Clerk authentication.

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Cloudflare account (for tunnel deployment)

## Environment Setup

2. Update `.env` with your actual values:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_clerk_key
PORT=5000
DB_HOST=your_database_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
CLOUDFLARE_API_KEY=your_cloudflare_api_key
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
```

## Local Development

### Option 1: Using Node.js directly
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:5173
```

### Option 2: Using Docker
```bash
# Build and run with Docker Compose
docker-compose up -d --build

# Access at http://localhost:3000
```

## Production Deployment with Cloudflare Tunnel

### Step 1: Create Cloudflare Tunnel

1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Zero Trust** > **Networks** > **Tunnels**
3. Create a new tunnel named `webapp`
4. Copy the tunnel token

### Step 2: Configure Public Hostname

In your tunnel configuration, add:
- **Subdomain**: `web`
- **Domain**: `your-domain.com`
- **Service Type**: `HTTP`
- **URL**: `web:3000`

### Step 3: Deploy Application

#### Manual Steps:

1. **Create Docker network:**
```cmd
docker network create webapp
```

2. **Build the application:**
```cmd
docker build -t smash-vision-web .
```

3. **Run Cloudflare tunnel:**
```cmd
docker run --detach --network webapp cloudflare/cloudflared:latest tunnel --no-autoupdate run --token YOUR_TUNNEL_TOKEN
```

4. **Run web application:**
```cmd
docker run -d --network webapp --name web smash-vision-web
```

#### Using Docker Compose (Recommended):

1. **Start the application:**
```cmd
docker-compose up -d --build
```

2. **Run Cloudflare tunnel separately:**
```cmd
docker run --detach --network webapp cloudflare/cloudflared:latest tunnel --no-autoupdate run --token YOUR_TUNNEL_TOKEN
```

### Step 4: Verify Deployment

1. Check containers are running:
```cmd
docker ps
```

2. Verify network connectivity:
```cmd
debug-tunnel.bat
```

3. Access your application at: `https://web.your-domain.com`

## Troubleshooting

### Common Issues:

**502 Bad Gateway Error:**
- Ensure web container is running: `docker ps | findstr web`
- Check if containers are on same network: `docker network inspect webapp`

**Clerk Authentication Error:**
- Verify `VITE_CLERK_PUBLISHABLE_KEY` in `.env` file
- Rebuild Docker image after changing environment variables

**Container Not Starting:**
- Check Docker logs: `docker logs web`
- Ensure `.env` file exists and is not in `.dockerignore`

### Debug Commands:

```cmd
# Check running containers
docker ps

# Inspect webapp network
docker network inspect webapp

# View container logs
docker logs web

# Test container connectivity
docker exec web curl -I http://localhost:3000
```

## File Structure

```
├── components/          # React components
├── src/                # Source code
│   ├── pages/          # Page components
│   ├── controllers/    # API controllers
│   └── scripts/        # Utility scripts
├── public/             # Static assets
├── stylesheet/         # CSS files
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
├── nginx.conf          # Nginx configuration
└── .env               # Environment variables
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `docker-compose up -d --build` - Build and run with Docker
- `debug-tunnel.bat` - Debug tunnel connectivity (Windows)
- `start-web.bat` - Start web container (Windows)

## Deployment Options

1. **Cloudflare Tunnel** (Current setup) - Free, secure tunneling
2. **AWS S3 + CloudFront** - Static hosting ($1-12/month)
3. **AWS Amplify** - Automatic deployments ($0-5/month)
4. **AWS ECS Fargate** - Container hosting ($33-48/month)

## Support

For issues related to:
- **Clerk Authentication**: [Clerk Documentation](https://clerk.com/docs)
- **Cloudflare Tunnels**: [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- **Docker**: [Docker Documentation](https://docs.docker.com/)