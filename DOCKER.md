# Docker Setup Guide

This guide explains how to run the Study Space application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

## Project Structure

```
.
├── backend/                 # FastAPI backend
│   ├── Dockerfile
│   ├── .dockerignore
│   └── app/
├── frontend/               # Next.js frontend
│   ├── Dockerfile
│   ├── .dockerignore
│   └── src/
├── nginx/                  # Nginx reverse proxy config
│   └── nginx.conf
├── docker-compose.yml      # Production setup
├── docker-compose.dev.yml  # Development setup
└── .env.example           # Environment variables template
```

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd co3103
```

### 2. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and set your values:

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=study_space
POSTGRES_PORT=5432

# Backend Configuration
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=11520

# Frontend Configuration
NEXT_PUBLIC_APP_NAME=Study Space
NEXT_PUBLIC_APP_URL=http://localhost
```

### 3. Run the Application

#### Production Mode (with Nginx)

```bash
docker-compose up -d --build
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 8000
- Frontend on port 3000
- Nginx reverse proxy on port 80

Access the application:
- **Application**: http://localhost
- **Backend API**: http://localhost/api
- **Direct Backend**: http://localhost:8000
- **Direct Frontend**: http://localhost:3000

#### Development Mode (with hot reload)

```bash
docker-compose -f docker-compose.dev.yml up --build
```

This starts the services with volume mounts for live code reloading:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000

## Services Overview

### Database (PostgreSQL)
- **Image**: postgres:17-alpine
- **Port**: 5432
- **Volume**: postgres_data (persisted)
- **Health check**: Automated with pg_isready

### Backend (FastAPI)
- **Build**: ./backend/Dockerfile
- **Port**: 8000
- **Command**: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- **Dependencies**: Waits for database to be healthy
- **Hot reload**: Enabled in dev mode

### Frontend (Next.js)
- **Build**: ./frontend/Dockerfile (multi-stage)
- **Port**: 3000
- **Build mode**: Standalone output
- **Environment**: Uses full backend URI in Docker

### Nginx (Reverse Proxy)
- **Image**: nginx:alpine
- **Port**: 80, 443
- **Purpose**: Routes /api to backend, / to frontend
- **Config**: ./nginx/nginx.conf

## Docker Commands

### Build and Start Services

```bash
# Production
docker-compose up -d --build

# Development
docker-compose -f docker-compose.dev.yml up --build
```

### Stop Services

```bash
# Production
docker-compose down

# Development
docker-compose -f docker-compose.dev.yml down
```

### Stop and Remove Volumes

```bash
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
docker-compose logs -f nginx
```

### Rebuild a Specific Service

```bash
docker-compose up -d --build backend
```

### Execute Commands in Containers

```bash
# Backend shell
docker-compose exec backend bash

# Run database migrations
docker-compose exec backend alembic upgrade head

# Frontend shell
docker-compose exec frontend sh

# Database shell
docker-compose exec db psql -U postgres -d study_space
```

### Check Service Health

```bash
docker-compose ps
```

## Database Management

### Run Migrations

```bash
docker-compose exec backend alembic upgrade head
```

### Create a New Migration

```bash
docker-compose exec backend alembic revision --autogenerate -m "description"
```

### Rollback Migration

```bash
docker-compose exec backend alembic downgrade -1
```

### Database Backup

```bash
docker-compose exec db pg_dump -U postgres study_space > backup.sql
```

### Database Restore

```bash
cat backup.sql | docker-compose exec -T db psql -U postgres study_space
```

## CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci-cd.yml`) that:

1. **Runs Tests**
   - Backend tests with pytest
   - Frontend linting and build checks

2. **Builds Docker Images**
   - Builds and pushes to GitHub Container Registry
   - Tags images with branch name, SHA, and latest

3. **Integration Tests**
   - Spins up entire stack with docker-compose
   - Verifies health endpoints
   - Tests nginx routing

### GitHub Actions Secrets

Configure these secrets in your GitHub repository:

- `GITHUB_TOKEN` - Automatically provided by GitHub
- Any additional deployment secrets

## Troubleshooting

### Port Conflicts

If ports are already in use, modify them in `.env`:

```env
POSTGRES_PORT=5433  # Change from default 5432
```

Or directly in docker-compose.yml for frontend/backend.

### Database Connection Issues

1. Check if database is healthy:
```bash
docker-compose ps db
```

2. View database logs:
```bash
docker-compose logs db
```

3. Ensure backend has correct database host:
```bash
docker-compose exec backend env | grep POSTGRES
```

### Frontend Cannot Connect to Backend

In Docker environment, frontend uses `http://backend:8000` (service name).
The nginx proxy handles external routing via `/api` path.

### Clear Everything and Start Fresh

```bash
docker-compose down -v
docker system prune -a --volumes
docker-compose up -d --build
```

## Production Deployment

### Security Checklist

- [ ] Change default passwords in `.env`
- [ ] Generate strong SECRET_KEY for JWT
- [ ] Configure CORS properly in backend
- [ ] Use HTTPS (configure SSL in nginx)
- [ ] Set secure database passwords
- [ ] Disable debug mode
- [ ] Review nginx security headers

### SSL/HTTPS Setup

1. Add SSL certificates to `./nginx/ssl/`
2. Update nginx.conf to include SSL configuration
3. Expose port 443 in docker-compose.yml

### Environment-specific Configurations

Use separate `.env` files:
- `.env.development`
- `.env.staging`
- `.env.production`

Load with:
```bash
docker-compose --env-file .env.production up -d
```

## Performance Optimization

### Docker Image Size

- Multi-stage builds are used for frontend
- Alpine-based images for smaller footprint
- .dockerignore files exclude unnecessary files

### Caching

- Docker layer caching enabled in CI/CD
- npm/pip dependencies cached separately
- Build cache mounted in GitHub Actions

## Support

For issues and questions:
- Check logs: `docker-compose logs -f`
- Review health checks: `docker-compose ps`
- Verify environment variables: `docker-compose config`
