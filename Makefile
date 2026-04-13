# =============================================================================
# Study Buddy - Makefile
# =============================================================================

.DEFAULT_GOAL := help
.PHONY: help install up down dev dev-web dev-api docker-up docker-down docker-logs \
        build build-web build-api build-schemas build-constants \
        db-generate db-push db-studio \
        lint format check-types test \
        clean clean-deps nuke

# -----------------------------------------------------------------------------
# Colors
# -----------------------------------------------------------------------------
CYAN  := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RESET := \033[0m

# -----------------------------------------------------------------------------
# Help
# -----------------------------------------------------------------------------
help: ## Show this help message
	@echo ""
	@echo "  $(CYAN)Study Buddy$(RESET) — available commands:"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ { printf "  $(GREEN)%-22s$(RESET) %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@echo ""

# -----------------------------------------------------------------------------
# Install
# -----------------------------------------------------------------------------
install: ## Install all dependencies
	bun install

# -----------------------------------------------------------------------------
# Development
# -----------------------------------------------------------------------------
up:
	docker compose up

down:
	docker compose down

dev-web: ## Start frontend only
	bun run turbo dev --filter=web

dev-api: ## Start backend only
	bun run turbo dev --filter=backend

# -----------------------------------------------------------------------------
# Access specific services
# -----------------------------------------------------------------------------
db: ## Access Postgres database shell
	docker compose exec postgres psql -U study_buddy_user -d study_buddy_db

redis: ## Access Redis CLI
	docker compose exec redis redis-cli

api: ## Access backend container shell
	docker compose exec api sh


# -----------------------------------------------------------------------------
# Docker
# -----------------------------------------------------------------------------
docker-up: ## Start Docker services (Postgres, Redis, MinIO)
	docker compose up -d
	@echo "$(GREEN)✓ Docker services started$(RESET)"

docker-down: ## Stop Docker services
	docker compose down
	@echo "$(YELLOW)✓ Docker services stopped$(RESET)"

docker-down-v: ## Stop Docker services and remove volumes
	docker compose down -v
	@echo "$(YELLOW)✓ Docker services stopped and volumes removed$(RESET)"

docker-logs: ## Tail Docker service logs
	docker compose logs -f

docker-logs-db: ## Tail Postgres logs only
	docker compose logs -f postgres

docker-restart: docker-down docker-up ## Restart Docker services

# -----------------------------------------------------------------------------
# Build
# -----------------------------------------------------------------------------
build: build-constants build-schemas ## Build all apps and packages
	bun run turbo build

build-web: build-constants build-schemas ## Build frontend
	bun run turbo build --filter=web

build-api: build-constants build-schemas ## Build backend
	bun run turbo build --filter=backend

build-schemas: ## Build @repo/schemas package
	bun run build:schemas

build-constants: ## Build @repo/constants package
	bun run build:constants

# -----------------------------------------------------------------------------
# Database
# -----------------------------------------------------------------------------
db-generate: ## Generate Prisma client
	cd apps/backend && bun run db:generate

db-push: ## Push Prisma schema to database
	cd apps/backend && bun run db:push

db-studio: ## Open Prisma Studio
	cd apps/backend && bunx prisma studio

db-reset: ## Reset database (drops and recreates schema)
	cd apps/backend && bunx prisma db push --force-reset
	@echo "$(YELLOW)✓ Database reset$(RESET)"

db-migrate: ## Run Prisma migrations (if using migrate instead of push)
	cd apps/backend && bunx prisma migrate dev

# -----------------------------------------------------------------------------
# Code Quality
# -----------------------------------------------------------------------------
lint: ## Run Biome linter across the monorepo
	bunx biome check .

lint-fix: ## Run Biome linter and auto-fix issues
	bunx biome check --write .

format: ## Format code with Biome
	bunx biome format --write .

check-types: ## Run TypeScript type checking
	bun run turbo check-types

# -----------------------------------------------------------------------------
# Testing
# -----------------------------------------------------------------------------
test: ## Run all tests
	bun run turbo test

test-api: ## Run backend tests only
	bun run turbo test --filter=backend

test-watch: ## Run backend tests in watch mode
	cd apps/backend && bun run test:watch

test-cov: ## Run backend tests with coverage
	cd apps/backend && bun run test:cov

# -----------------------------------------------------------------------------
# Utilities
# -----------------------------------------------------------------------------
clean: ## Remove all build artifacts (dist, .next, build, .turbo)
	bun run turbo clean 2>/dev/null || true
	find . -type d -name "dist" -not -path "*/node_modules/*" | xargs rm -rf
	find . -type d -name ".turbo" -not -path "*/node_modules/*" | xargs rm -rf
	@echo "$(GREEN)✓ Build artifacts removed$(RESET)"

clean-deps: ## Remove all node_modules
	find . -type d -name "node_modules" | xargs rm -rf
	@echo "$(GREEN)✓ node_modules removed$(RESET)"

nuke: docker-down clean clean-deps ## Full reset: stop Docker, remove builds and node_modules
	@echo "$(GREEN)✓ Full reset complete — run 'make install' to start fresh$(RESET)"

# -----------------------------------------------------------------------------
# Shortcuts
# -----------------------------------------------------------------------------
u: up			 ## Alias: up
d: down		     ## Alias: down
i: install       ## Alias: install
b: build         ## Alias: build
l: lint-fix      ## Alias: lint-fix
t: test          ## Alias: test
f: format 		 ## Alias: format
