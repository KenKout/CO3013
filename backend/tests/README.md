# Testing Guide

## Prerequisites

- Docker and Docker Compose installed
- Python 3.12+ with `uv` package manager
- PostgreSQL running via Docker Compose

## Setup

### 1. Start the Database

```bash
cd /root/assignment/co3103/backend
docker-compose up -d
```

### 2. Set Up Test Database

Run the setup script to create the test database (`study_space_test`) and all required tables:

```bash
uv run python scripts/setup_test_db.py
```

This script will:
- Drop the test database if it exists (clean slate)
- Create a fresh `study_space_test` database
- Enable required PostgreSQL extensions (e.g., `citext`)
- Create all tables

### 3. Run Tests

Run all tests:

```bash
uv run pytest tests/ -v
```

Run specific test file:

```bash
uv run pytest tests/test_auth.py -v
```

Run specific test class:

```bash
uv run pytest tests/test_auth.py::TestRegister -v
```

Run specific test:

```bash
uv run pytest tests/test_auth.py::TestRegister::test_register_success -v
```

## Test Structure

```
tests/
├── conftest.py       # Shared fixtures (db_session, client, test_user, etc.)
├── test_admin.py     # Admin endpoint tests
├── test_auth.py      # Authentication tests
├── test_bookings.py  # Booking endpoint tests
└── test_spaces.py    # Spaces and utilities tests
```

## Test Database Isolation

- Tests use a separate database (`study_space_test`) to avoid affecting production data
- Each test runs in a transaction that is rolled back after the test completes
- This ensures tests are isolated and don't interfere with each other

## Resetting Test Database

If you need to reset the test database (e.g., schema changes), run the setup script again:

```bash
uv run python scripts/setup_test_db.py
```

## Troubleshooting

### Database connection errors

Ensure Docker container is running:

```bash
docker-compose ps
docker-compose up -d
```

### Table/schema errors

Re-run the setup script to recreate tables:

```bash
uv run python scripts/setup_test_db.py
```

### Extension errors (e.g., citext)

The setup script automatically enables required extensions. If issues persist, connect to the test database and run:

```sql
CREATE EXTENSION IF NOT EXISTS citext;
```
