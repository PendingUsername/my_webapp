# Makefile for your Django project with Docker

# Define variables
DOCKER_COMPOSE = docker-compose
MANAGE_PY = docker exec my_webapp-backend-1 python manage.py

# Docker commands
build:
	@echo "Building Docker containers..."
	$(DOCKER_COMPOSE) up --build -d

start:
	@echo "Starting Docker containers..."
	$(DOCKER_COMPOSE) up -d

stop:
	@echo "Stopping Docker containers..."
	$(DOCKER_COMPOSE) down

restart:
	@echo "Restarting Docker containers..."
	$(DOCKER_COMPOSE) down && $(DOCKER_COMPOSE) up -d

clean:
	@echo "Stopping and removing containers..."
	$(DOCKER_COMPOSE) down -v

# Django commands
migrate:
	@echo "Running migrations..."
	$(MANAGE_PY) migrate

# New user-friendly setup commands
init: build migrate
	@echo "Project initialized. Access the application to create a superuser from the login page."

setup:
	@echo "Setting up everything for the first time..."
	make init

# Helper commands
logs:
	@echo "Showing logs from all containers..."
	$(DOCKER_COMPOSE) logs -f

backend_logs:
	@echo "Showing backend logs..."
	$(DOCKER_COMPOSE) logs -f backend

frontend_logs:
	@echo "Showing frontend logs..."
	$(DOCKER_COMPOSE) logs -f frontend

db_logs:
	@echo "Showing database logs..."
	$(DOCKER_COMPOSE) logs -f db

# Cleanup images, volumes, etc.
prune:
	@echo "Removing all unused Docker objects..."
	docker system prune -af --volumes

# Default target
help:
	@echo "Makefile commands:"
	@echo "  build               Build Docker containers"
	@echo "  start               Start Docker containers"
	@echo "  stop                Stop Docker containers"
	@echo "  restart             Restart Docker containers"
	@echo "  clean               Stop and remove all containers"
	@echo "  migrate             Run Django migrations"
	@echo "  logs                Show logs from all containers"
	@echo "  backend_logs        Show logs from backend container"
	@echo "  frontend_logs       Show logs from frontend container"
	@echo "  db_logs             Show logs from database container"
	@echo "  prune               Prune unused Docker objects (WARNING: removes all dangling images/volumes)"
	@echo "  init                Initialize the project (build containers and run migrations)"
	@echo "  setup               Full setup of the project, including build and migrations"
