.PHONY: help dev build prod up down logs clean

help:
	@echo "📦 Modern React App - Docker Commands"
	@echo ""
	@echo "Development:"
	@echo "  make dev        - Start development server with hot reload"
	@echo "  make logs       - View development logs"
	@echo "  make shell      - Access container shell"
	@echo ""
	@echo "Production:"
	@echo "  make build      - Build production Docker image"
	@echo "  make prod       - Start production server"
	@echo "  make prod-logs  - View production logs"
	@echo ""
	@echo "General:"
	@echo "  make down       - Stop all containers"
	@echo "  make clean      - Remove all containers, images and volumes"
	@echo "  make restart    - Restart containers"

dev:
	docker-compose up -d
	@echo "✅ Dev server running at http://localhost:5173"

build:
	docker-compose -f docker-compose.prod.yml build

prod:
	docker-compose -f docker-compose.prod.yml up -d
	@echo "✅ Production server running at http://localhost"

up:
	docker-compose up -d

down:
	docker-compose down
	docker-compose -f docker-compose.prod.yml down

logs:
	docker-compose logs -f

prod-logs:
	docker-compose -f docker-compose.prod.yml logs -f

shell:
	docker-compose exec modern-react-app sh

restart:
	docker-compose restart

clean:
	docker-compose down -v --rmi all
	docker-compose -f docker-compose.prod.yml down -v --rmi all
	@echo "🧹 Cleaned up all Docker resources"
