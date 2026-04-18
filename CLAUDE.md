# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
bun run dev              # Start all services (PostgreSQL, Redis, backend :8080, frontend :3000)
bun run dev:docker       # Start only Docker services (PostgreSQL, Redis, MinIO)
turbo dev --filter=backend  # Backend only in watch mode
turbo dev --filter=web      # Frontend only in watch mode
```

### Build & Lint
```bash
bun run build            # Build all apps and packages
bun run lint             # Run Biome linter
bunx biome check --write .  # Auto-fix linting issues
bun run check-types      # TypeScript type check across monorepo
```

### Database
```bash
cd apps/backend && bun run db:generate  # Generate Prisma client
cd apps/backend && bun run db:push      # Push schema to database (no migration files)
bunx prisma studio                      # Open Prisma Studio GUI (run in apps/backend)
```

### Testing
```bash
cd apps/backend && bun run test         # Run all backend tests
cd apps/backend && bun run test:watch   # Watch mode
cd apps/backend && bun run test:cov     # With coverage
```

### Makefile shortcuts
```bash
make help    # List all shortcuts
make up      # Start Docker services
make down    # Stop Docker services
make nuke    # Full reset (Docker, builds, node_modules)
```

## Architecture

### Monorepo Structure
Turborepo monorepo with Bun as package manager and runtime. Three layers:
- **`apps/backend`** — NestJS API on port 8080
- **`apps/web`** — React 19 + Vite frontend on port 3000
- **`packages/`** — Shared packages: `@repo/schemas` (Zod), `@repo/constants`, `@repo/ui` (shadcn/ui-based)

### Backend (NestJS)
Standard NestJS module structure under `apps/backend/src/`. Key patterns:
- **DTOs use Zod** via `nestjs-zod` — schemas defined in `@repo/schemas` (shared with frontend)
- **BullMQ queues** for async jobs: message AI generation and file processing run in background workers, not in HTTP handlers
- **SSE streaming** at `GET /tutor-chat/:id/messages/:messageId/stream` — AI response chunks emitted via NestJS EventEmitter, consumed by controller, forwarded as SSE
- **Swagger** auto-generated at `/api/swagger` from NestJS decorators
- **Auth**: Passport.js with session-based auth (express-session + Redis store), plus Google/GitHub OAuth2

### Frontend (React 19 + Vite)
- **TanStack Router** with file-based routing — route groups: `(auth)`, `(platform)`, `(marketing)`
- **TanStack Query** for all server state — mutations automatically invalidate relevant queries
- **Zustand** for client-only UI state (modals, etc.)
- **`ky`** as HTTP client with automatic cookie forwarding

### AI & File Processing Pipeline
1. User uploads file → validated → stored in MinIO (S3-compatible)
2. BullMQ job enqueued → worker extracts text → chunks text → generates embeddings via Gemini Embedding 001 → stores in Postgres with `pgvector` (vector(768))
3. At chat time, relevant chunks retrieved via cosine similarity for RAG context
4. AI responses generated via `@ai-sdk/google` (Gemini Flash 2.0 default) and streamed back via SSE

### Infrastructure Services
- **PostgreSQL 16 + pgvector** — main DB with vector similarity support
- **Redis** — session store + BullMQ broker + response caching
- **MinIO** — local S3-compatible object storage (AWS SDK v3 client)
- All services defined in `docker-compose.yml`

### Shared Validation
`@repo/schemas` contains Zod schemas used in both the backend (NestJS pipes) and frontend (form validation). When changing an API contract, update the schema in the shared package and rebuild with `bun run build:schemas`.

## Key Environment Variables

Backend (`apps/backend/.env`):
```
DATABASE_URL, REDIS_URL, SESSION_SECRET
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
AWS_S3_ENDPOINT, AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME
GOOGLE_GENERATIVE_AI_API_KEY
MAIL_HOST, MAIL_USER, MAIL_PASSWORD
```

Frontend (`apps/web/.env`):
```
VITE_API_URL=http://localhost:8080
VITE_APP_URL=http://localhost:3000
```
