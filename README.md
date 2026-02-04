# AI Study Buddy

An AI-powered study assistant that helps students learn more effectively through personalized tutor chats, structured study sessions, and a comprehensive learning materials library.

## Overview

AI Study Buddy is a unified learning platform that combines AI-driven tutoring with structured course generation and intelligent practice systems. The platform organizes learning into three core modules:

- **Tutor Chats** - Free-form AI conversations with context-aware material generation
- **Study Sessions** - AI-generated structured mini-courses with lessons and exercises
- **Library** - Centralized storage for all learning materials (files, notes, quizzes, flashcards, code labs)

## What's inside?

This is a Turborepo monorepo containing the following packages and apps:

### Apps

- **`backend`** - NestJS REST API with Prisma ORM and PostgreSQL
- **`web`** - React SPA with TanStack Router and TanStack Query

### Packages

- **`@repo/ui`** - Shared React component library built with shadcn/ui and Tailwind CSS
- **`@repo/schemas`** - Shared Zod validation schemas for type-safe API contracts
- **`@repo/typescript-config`** - Shared TypeScript configurations
- **`@repo/biome-config`** - Shared Biome linting and formatting configurations

## Tech Stack

### Frontend
- **Framework:** React 19 with Vite
- **Routing:** TanStack Router v1
- **State Management:** Zustand
- **Server State:** TanStack Query v5
- **Forms:** TanStack Form
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS v4
- **Animations:** Motion (Framer Motion)
- **HTTP Client:** Ky
- **Date Utilities:** date-fns

### Backend
- **Framework:** NestJS v11
- **Database:** PostgreSQL with Prisma ORM v7
- **Caching:** Redis (ioredis + connect-redis)
- **Authentication:** Passport (Local, Google OAuth, GitHub OAuth)
- **Session Management:** express-session with Redis store
- **Security:** Helmet, ncsrf, xss, argon2 (password hashing)
- **Email:** Nodemailer with Handlebars templates
- **Logging:** Winston with nest-winston
- **Monitoring:** Sentry
- **Rate Limiting:** @nestjs/throttler
- **API Documentation:** Swagger (OpenAPI)
- **Validation:** Zod with nestjs-zod

### Development Tools
- **Monorepo:** Turborepo v2
- **Package Manager:** Bun v1.3
- **Language:** TypeScript v5
- **Linting/Formatting:** Biome
- **Containerization:** Docker Compose

## Prerequisites

- [Bun](https://bun.sh/) v1.3.0 or higher
- [Node.js](https://nodejs.org/) v18 or higher
- [Docker](https://www.docker.com/) and Docker Compose (for running PostgreSQL and Redis)

## Getting Started

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd turbo-study-buddy
bun install
```

### Environment Setup

Create `.env` files for both apps:

**Backend** (`apps/backend/.env`):
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/study_buddy"

# Redis
REDIS_URL="redis://localhost:6379"

# Session
SESSION_SECRET="your-secret-key-here"

# OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:4000/api/auth/google/callback"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GITHUB_CALLBACK_URL="http://localhost:4000/api/auth/github/callback"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Sentry
SENTRY_DSN="your-sentry-dsn"
```

**Frontend** (`apps/web/.env`):
```env
VITE_API_URL="http://localhost:4000"
```

### Running the Application

#### Development Mode

Start all services (PostgreSQL, Redis, Backend, Frontend):

```bash
bun run dev
```

This command will:
1. Start Docker containers (PostgreSQL & Redis)
2. Run the backend API on `http://localhost:4000`
3. Run the frontend dev server on `http://localhost:3000`

#### Run Individual Apps

```bash
# Backend only
turbo dev --filter=backend

# Frontend only
turbo dev --filter=web

# Docker services only
bun run dev:docker
```

### Database Setup

Generate Prisma client and push schema to database:

```bash
cd apps/backend
bun run db:generate
bun run db:push
```

### Build

Build all apps and packages:

```bash
bun run build
```

Build specific package:

```bash
turbo build --filter=backend
turbo build --filter=web
```

### Linting & Type Checking

```bash
# Run linting
bun run lint

# Run type checking
bun run check-types
```

## Project Structure

```
turbo-study-buddy/
├── apps/
│   ├── backend/              # NestJS API
│   │   ├── src/
│   │   │   ├── auth/         # Authentication module
│   │   │   ├── tutor-chats/  # Tutor chats module
│   │   │   ├── users/        # Users module
│   │   │   └── shared/       # Shared utilities
│   │   ├── libs/             # Backend libraries
│   │   │   ├── hashing/      # Password hashing
│   │   │   ├── logger/       # Winston logger
│   │   │   ├── mailer/       # Email service
│   │   │   ├── prisma/       # Prisma service
│   │   │   └── redis/        # Redis service
│   │   └── prisma/           # Database schema
│   └── web/                  # React frontend
│       └── src/
│           ├── routes/       # TanStack Router routes
│           ├── features/     # Feature modules
│           └── lib/          # Utilities
└── packages/
    ├── ui/                   # Shared UI components
    ├── schemas/              # Shared Zod schemas
    ├── typescript-config/    # TS configs
    └── biome-config/         # Biome configs
```

## Core Features

### 🎓 Tutor Chats
- AI-powered conversational learning
- File upload for context
- Generate quizzes, flashcards, and code labs within chats
- Persistent chat history

### 📚 Study Sessions
- AI-generated structured learning paths
- Lesson sequencing with progress tracking
- Embedded practice materials
- Adaptive difficulty

### 📖 Library
- Centralized material storage (Files, Notes, Quizzes, Flashcards, Code Labs)
- Search and filtering
- Tags and metadata
- Export capabilities (CSV, Anki, plain text)

### 🔐 Authentication
- Email/Password authentication
- Google OAuth 2.0
- GitHub OAuth
- Email verification
- Password reset

### 💳 Subscription System
**Free Tier:**
- 3 uploads/week
- 500MB storage
- Unlimited chats and explanations
- Basic quizzes and flashcards

**Pro Tier:**
- Unlimited uploads
- 5GB storage
- Advanced analytics
- Exam simulator
- Study plans and groups
- Export features

## API Documentation

When running in development, Swagger documentation is available at:
```
http://localhost:4000/api
```

## Contributing

This is a learning project. Contributions are welcome!

## License

[Your License Here]
