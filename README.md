# Study Space Booking System

A full-stack web application for managing study space reservations built with FastAPI (Python) and Next.js (TypeScript).

## Architecture

### Tech Stack

- **Backend**: FastAPI (Python 3.12+) with PostgreSQL
- **Frontend**: Next.js 16 with React 19 and TypeScript
- **Database**: PostgreSQL 17
- **Reverse Proxy**: Nginx
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

### Project Structure

```
co3103/
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── main.py        # Application entry point
│   │   ├── core/          # Core configuration
│   │   ├── models/        # Database models
│   │   ├── routes/        # API endpoints
│   │   └── schemas/       # Pydantic schemas
│   ├── alembic/           # Database migrations
│   ├── tests/             # Backend tests
│   ├── Dockerfile
│   └── pyproject.toml
│
├── frontend/              # Next.js frontend
│   ├── src/
│   │   ├── app/          # Next.js app router
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and API client
│   ├── Dockerfile
│   └── package.json
│
├── nginx/                 # Nginx configuration
│   └── nginx.conf
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml     # CI/CD pipeline
│
├── docker-compose.yml     # Production setup
├── docker-compose.dev.yml # Development setup
├── Makefile              # Common commands
├── DOCKER.md             # Docker documentation
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd co3103
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the application**
   ```bash
   # Using Makefile (recommended)
   make init

   # Or using docker compose directly
   docker compose up -d --build
   ```

4. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost/api
   - Direct Backend: http://localhost:8000
   - Direct Frontend: http://localhost:3000

### Development Mode

For development with hot reload:

```bash
# Using Makefile
make dev

# Or using docker compose directly
docker compose -f docker compose.dev.yml up --build
```

## Common Commands

The project includes a Makefile for convenience:

```bash
# Setup and initialization
make init              # First-time setup (creates .env, builds, starts, migrates)
make setup             # Create .env from .env.example
make validate          # Validate Docker setup

# Running services
make up                # Start all services (production)
make dev               # Start with hot reload (development)
make down              # Stop all services
make restart           # Restart all services

# Monitoring
make logs              # View logs from all services
make status            # Show service status
make health            # Check service health

# Database
make migrate           # Run database migrations
make migrate-create    # Create a new migration
make migrate-rollback  # Rollback last migration
make db-shell          # Open PostgreSQL shell
make db-backup         # Backup database
make db-restore        # Restore database from backup

# Shell access
make backend-shell     # Access backend container
make frontend-shell    # Access frontend container

# Testing
make test              # Run all tests
make test-backend      # Run backend tests
make test-frontend     # Run frontend tests

# Cleanup
make clean             # Stop services and remove volumes
```

## API Documentation

When the backend is running, visit:
- **Interactive API Docs**: http://localhost:8000/docs (Swagger UI)
- **Alternative API Docs**: http://localhost:8000/redoc (ReDoc)

## Backend Configuration

### Environment Variables

Configure in `.env`:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=study_space
POSTGRES_PORT=5432

# JWT Authentication
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=11520  # 8 days
```

### Running Backend Locally (without Docker)

```bash
cd backend

# Install dependencies (using uv)
pip install uv
uv pip install -r pyproject.toml

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Frontend Configuration

### Environment Variables

Configure in `frontend/.env.local`:

```env
# API Configuration (Nginx routing)
NEXT_PUBLIC_API_URL=/api

# Application Configuration
NEXT_PUBLIC_APP_NAME=Study Space
NEXT_PUBLIC_APP_URL=http://localhost
```

### Running Frontend Locally (without Docker)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Nginx Reverse Proxy

Nginx handles routing:
- `/` → Frontend (Next.js on port 3000)
- `/api/` → Backend (FastAPI on port 8000, strips `/api` prefix)

The backend receives clean URLs without the `/api` prefix, while frontend code uses `/api` for all API calls.

## Database

### Migrations

Create a new migration:
```bash
make migrate-create
# Or directly:
docker compose exec backend alembic revision --autogenerate -m "description"
```

Apply migrations:
```bash
make migrate
# Or directly:
docker compose exec backend alembic upgrade head
```

Rollback:
```bash
make migrate-rollback
# Or directly:
docker compose exec backend alembic downgrade -1
```

### Backup and Restore

Backup:
```bash
make db-backup
# Creates backup_YYYYMMDD_HHMMSS.sql
```

Restore:
```bash
make db-restore
# Enter backup file path when prompted
```

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

### Pipeline Stages

1. **Backend Tests**
   - Sets up Python 3.12
   - Runs pytest with PostgreSQL service
   - Validates API functionality

2. **Frontend Tests**
   - Runs ESLint
   - Builds production bundle
   - Validates TypeScript compilation

3. **Build & Push Docker Images**
   - Builds optimized Docker images
   - Pushes to GitHub Container Registry
   - Tags with branch, SHA, and latest

4. **Integration Tests**
   - Spins up full stack
   - Tests service health
   - Validates Nginx routing

### Triggering the Pipeline

The pipeline runs automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

## Deployment

### Production Checklist

- [ ] Update `.env` with production values
- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Set secure database passwords
- [ ] Configure CORS origins in `backend/app/main.py`
- [ ] Set up SSL/HTTPS in Nginx
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Configure automated backups

### Environment-Specific Deployment

```bash
# Using specific environment file
docker compose --env-file .env.production up -d

# Or copy to .env
cp .env.production .env
docker compose up -d
```

## Troubleshooting

### Port Conflicts

If ports are already in use:
1. Stop conflicting services
2. Or modify ports in `.env` and `docker compose.yml`

### Database Connection Issues

```bash
# Check database status
docker compose ps db

# View database logs
docker compose logs db

# Verify connection from backend
docker compose exec backend env | grep POSTGRES
```

### Clear Everything

```bash
# Stop and remove everything
make clean

# Or manually
docker compose down -v
docker system prune -a --volumes
```

### Frontend Cannot Connect to Backend

In Docker environment:
- Frontend uses `http://backend:8000` internally
- External clients use `/api` via Nginx

Check Nginx logs:
```bash
docker compose logs nginx
```

## Testing

### Backend Tests

```bash
cd backend
pytest tests/ -v

# With coverage
pytest tests/ --cov=app --cov-report=html
```

### Frontend Tests

```bash
cd frontend
npm run lint
npm run build  # Validates TypeScript
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure tests pass
4. Submit a pull request

## License

[Your License Here]

## Support

For issues and questions:
- Check the logs: `make logs`
- Review documentation: `DOCKER.md`
- Open an issue on GitHub
