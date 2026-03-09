---
name: Ecommerce Learning App Plan
overview: A comprehensive feature plan and step-by-step implementation guide for building an ecommerce Turborepo monorepo (Next.js + NestJS as standalone apps) with security best practices, RBAC, queues/workers, and alignment with the Backend PDF curriculum.
todos: []
isProject: false
---

# Ecommerce Learning App - Feature Plan & Implementation Guide

## Architecture Overview

Turborepo monorepo with NestJS and Next.js as standalone applications. Each app is independent and can be developed/deployed separately; Turborepo handles build orchestration, task caching, and dependency graphs.

```mermaid
flowchart TB
    subgraph monorepo [Turborepo Monorepo - Bun]
        subgraph apps [Apps - Standalone]
            API[NestJS API]
            WebApp[Next.js Web]
        end
        subgraph packages [Shared Package]
            Shared[@ecommerce/shared]
            UI[ui - React components]
            Library[library - types hooks schemas]
            Assets[assets - images SVGs]
            Shared --> UI
            Shared --> Library
            Shared --> Assets
        end
    end

    subgraph infrastructure [Infrastructure]
        Postgres[(PostgreSQL)]
        Redis[(Redis)]
        RabbitMQ[RabbitMQ]
    end

    WebApp -->|HTTP/API| API
    WebApp --> UI
    WebApp --> Library
    WebApp --> Assets
    API --> Library
    API --> Postgres
    API --> Redis
    API --> RabbitMQ
```

---

## Turborepo Monorepo Architecture

- **Build system**: Turborepo (task orchestration, incremental builds, remote caching)
- **Package manager**: Bun workspaces
- **Standalone apps**: Each app is a self-contained project; no shared runtime coupling
- **Shared package**: `@ecommerce/shared` with sub-exports `ui`, `library`, `assets` (careapps-style structure)

### Shared Package Structure (ui, library, assets)

One package `@ecommerce/shared` with three sub-exports, usable by both web and api:

| Export | Path | Contents | Used by |
|--------|------|----------|---------|
| `@ecommerce/shared/ui` | `src/ui/` | React components (Button, Card, Form, etc.), shadcn-based | Web only |
| `@ecommerce/shared/library` | `src/library/` | Types, enums, schemas, hooks, constants, validation (Zod) | Web + API |
| `@ecommerce/shared/assets` | `src/assets/` | Images, SVGs, fonts; copied to dist on build | Web only |

**Web** imports: `@ecommerce/shared/ui`, `@ecommerce/shared/library`, `@ecommerce/shared/assets`  
**API** imports: `@ecommerce/shared/library` (types, enums, validation schemas for DTOs)

Package exports (in `packages/shared/package.json`):
```json
"exports": {
  "./ui": { "types": "./src/ui/index.ts", "default": "./dist/ui/index.js" },
  "./library": { "types": "./src/library/index.ts", "default": "./dist/library/index.js" },
  "./assets": { "types": "./src/assets/index.ts", "default": "./dist/assets/index.js" },
  ".": { "types": "./src/index.ts", "default": "./dist/index.js" }
}
```

Build script: `tsc && node scripts/copy-assets-files.js` (assets need copying to dist).

---

### Why Turborepo

- Incremental builds with caching (only rebuild what changed)
- Parallel task execution (build api + web concurrently)
- Consistent `dev`, `build`, `test` commands across apps
- Remote caching support for CI/CD (optional)
- Filters: `turbo run build --filter=@ecommerce/api` to run per-app

---

## Phase 1: Project Initialization

Two approaches: **create-turbo** (recommended) or **manual**. Use one, not both.

---

### 1.1 Option A: Start with create-turbo (Recommended)

`create-turbo` scaffolds the monorepo, `turbo.json`, workspaces, and default apps. You get Next.js (`web`) and usually `docs` — no need to run `create-next-app` again.

**Step 1: Bootstrap the monorepo**

```bash
cd ecommerce   # or your project folder
bunx create-turbo@latest
# Choose: project name, package manager (bun)
```

**What you get:**
- `apps/web` — Next.js app (keep this; it is your frontend)
- `apps/docs` — extra app (remove or ignore)
- `packages/*` — shared packages (e.g. `ui`, `eslint-config`)
- `turbo.json` — task pipeline (already configured)
- Root `package.json` — workspaces and scripts

**Step 2: Add NestJS API**

create-turbo does not include NestJS. Add it:

```bash
bunx nest new api --directory apps/api --package-manager bun
```

This creates `apps/api` as a standalone NestJS app inside the monorepo.

**Step 3: Add shared package (ui, library, assets)**

create-turbo may give you `packages/ui`. Replace or add `packages/shared` with the careapps-style structure:

```bash
mkdir -p packages/shared/src/{ui,library,assets/images}
```

Add `packages/shared/package.json` with:
- `name: "@ecommerce/shared"`
- Exports for `./ui`, `./library`, `./assets`, `.`
- Build script: `tsc && node scripts/copy-assets-files.js`
- Add `scripts/copy-assets-files.js` to copy assets to `dist/assets`

Wire dependencies:
- **Web**: `"@ecommerce/shared": "workspace:*"` — use ui, library, assets
- **API**: `"@ecommerce/shared": "workspace:*"` — use library only (types, enums, schemas)

**Step 4: Clean up (optional)**

- Remove `apps/docs` if you do not need it
- Rename `apps/web` package to `@ecommerce/web`, `apps/api` to `@ecommerce/api`

**Step 5: Root scripts (careapps-style)**

In root `package.json`:
- `dev` — start all apps (like careapps): `turbo run dev` or `turbo dev --concurrency=4`
- Optional filtered runs: `dev:api`, `dev:web` for single-app development

```json
"dev": "turbo run dev",
"dev:api": "turbo run dev --filter=@ecommerce/api",
"dev:web": "turbo run dev --filter=@ecommerce/web",
"docker:up": "docker compose up",
"docker:down": "docker compose down"
```

---

### 1.2 Option B: Manual (from scratch)

Use only if you prefer not to use create-turbo.

1. Create root: `bun init -y`, add `"workspaces": ["apps/*", "packages/*"]`, add `turbo` as devDependency
2. Create `turbo.json` (copy from Turborepo docs or an existing project)
3. Create NestJS: `bunx nest new api --directory apps/api --package-manager bun`
4. Create Next.js: `bunx create-next-app@latest web --dir apps/web --ts --tailwind --app --src-dir`
5. Create `packages/shared` with ui, library, assets structure (see File Structure Reference)
6. Add `@ecommerce/shared` to both apps; API uses library, Web uses ui + library + assets

---

### 1.3 What Each Approach Produces

| Item | Option A (create-turbo) | Option B (manual) |
|------|-------------------------|-------------------|
| turbo.json | Created by create-turbo | You create it |
| apps/web (Next.js) | From create-turbo | From create-next-app |
| apps/api (NestJS) | You add with nest new | You add with nest new |
| packages/shared | You add | You add |
| Root scripts | From create-turbo, extend | You define all |

---

### 1.4 Turborepo Tasks (turbo.json)

| Task | Behavior |
|------|----------|
| `build` | Depends on `^build`; outputs `dist/**`, `.next/**` |
| `dev` | Persistent, no cache |
| `test` | Depends on `^build` |
| `typecheck` | Depends on `^build` |

---

### 1.5 Docker Setup (Full Stack)

Dockerize both ends so `docker compose up` runs the entire stack locally.

**Services in docker-compose.yml:**
- **postgres** — PostgreSQL 16
- **redis** — Redis 7 (cache + BullMQ)
- **rabbitmq** — RabbitMQ 3.x (queues, pub/sub)
- **api** — NestJS app (Dockerfile in apps/api)
- **web** — Next.js app (Dockerfile in apps/web)

**Flow:**
- `docker compose up` — builds and runs api + web + postgres + redis + rabbitmq
- API connects to postgres, redis, rabbitmq via service names
- Web connects to API via `http://api:3000` (or internal network)
- Add `.env.example` and document required vars for local + Docker

**Dockerfiles:**
- `apps/api/Dockerfile` — multi-stage: build NestJS, run with node/bun
- `apps/web/Dockerfile` — multi-stage: build Next.js, run with node
- Root or per-app `.dockerignore` to exclude node_modules, .next, etc.

---

## Phase 2: Core Domain & Database (TypeORM + PostgreSQL)

### 2.1 Database Schema (Backend PDF: Table structure, Keys, JOINs, Transactions)


| Entity       | Key Fields                               | Relations              |
| ------------ | ---------------------------------------- | ---------------------- |
| User         | id, email, passwordHash, role            | Orders, Addresses      |
| Role         | id, name                                 | Permissions (M:N)      |
| Permission   | id, resource, action                     | Roles                  |
| Address      | id, userId, street, city, country        | User                   |
| Product      | id, name, slug, price, stock, categoryId | Category, ProductImage |
| Category     | id, name, slug, parentId                 | Products (self-ref)    |
| ProductImage | id, productId, url, order                | Product                |
| Order        | id, userId, status, total                | OrderItem, Address     |
| OrderItem    | id, orderId, productId, qty, price       | Order, Product         |
| Cart         | id, userId                               | CartItem               |
| CartItem     | id, cartId, productId, qty               | Cart, Product          |


Use: Primary/Foreign/Unique/Composite keys, proper indexes for query optimization (Backend PDF: INDEX, EXPLAIN).

### 2.2 TypeORM Setup in NestJS

- Configure TypeORM module with migrations
- Use repositories (Repository pattern)
- Database transactions for checkout, inventory updates
- Stored procedures: optional for complex reporting (can defer)

---

## Phase 3: Auth & Security (JWT, Cookies, CSRF, RBAC)

### 3.1 Auth Flow

- **JWT**: Access token (short-lived, e.g. 15min) + Refresh token (longer, e.g. 7d)
- **Cookies**: HttpOnly, Secure, SameSite=Strict for refresh token
- **CSRF**: Use `csrf` package; double-submit cookie pattern; SameSite cookies reduce risk; add CSRF token for state-changing requests (POST/PUT/DELETE)
- **CORS**: Whitelist web app origin
- **Password**: bcrypt with salt rounds 10-12
- **SQL Injection**: Use parameterized queries (TypeORM does this by default)
- **XSS**: Sanitize inputs; Content-Security-Policy headers
- **Rate limiting**: `@nestjs/throttler` on login/signup

### 3.2 RBAC (Backend PDF: ACL - Role, Permission)

- Roles: `guest`, `customer`, `admin`, `seller`
- Permissions: `product:create`, `product:update`, `order:read`, `order:update`, etc.
- Guard: `RolesGuard` + `PermissionsGuard` using `@nestjs/passport` + custom decorators
- NestJS `@UseGuards(RolesGuard)` on controllers

---

## Phase 4: RESTful API (Backend PDF: Versioning, Swagger, Status Codes)

### 4.1 API Structure

- Versioned routes: `/api/v1/products`, `/api/v1/orders`
- Swagger/OpenAPI: `@nestjs/swagger` with DTOs, responses, auth
- Status codes: 200, 201, 400, 401, 403, 404, 409, 500
- Request/Response DTOs with `class-validator` and `class-transformer`
- Global exception filter for consistent error format

### 4.2 Core Endpoints (MVP)


| Resource   | Endpoints                                  | Auth           |
| ---------- | ------------------------------------------ | -------------- |
| Auth       | POST /login, /register, /refresh           | Public/Refresh |
| Users      | GET/PATCH /users/me                        | Customer+      |
| Products   | GET /products, GET /products/:id           | Public         |
| Categories | GET /categories                            | Public         |
| Cart       | GET/POST/PATCH/DELETE /cart                | Customer       |
| Orders     | POST /orders, GET /orders, GET /orders/:id | Customer       |
| Admin      | CRUD products, categories, orders          | Admin          |


---

## Phase 5: Queue, Worker, Background Jobs (Backend PDF: Queue/Worker, Pub/Sub, RabbitMQ)

### 5.1 RabbitMQ Setup

- Exchange: `ecommerce.direct` or `ecommerce.topic`
- Queues: `email`, `order.process`, `inventory.sync`, `analytics`
- Use `@golevelup/nestjs-rabbitmq` or `amqplib`

### 5.2 Background Jobs


| Job                           | Trigger             | Purpose                                 |
| ----------------------------- | ------------------- | --------------------------------------- |
| Send order confirmation email | Order created       | Async email                             |
| Inventory reservation expiry  | Scheduled/cron      | Release expired reservations            |
| Low stock alert               | Order placed        | Notify admin                            |
| Order status notifications    | Order status change | Pub/Sub to email/notification consumers |


### 5.3 Pub/Sub Pattern

- Publisher: API publishes to exchange on domain events (order.created, product.updated)
- Consumers: Worker services consume from queues
- Start with one worker process; later split into microservices if desired

---

## Phase 6: Frontend (Next.js, shadcn, Server Actions)

### 6.1 UI Stack

- Next.js 14+ App Router
- shadcn/ui (Button, Card, Input, Form, Table, Dialog, Toast, etc.)
- Tailwind CSS
- Server Actions for mutations and data fetching (no client-side fetch for initial data where possible)
- Standard ecommerce pages: Home, Product listing, Product detail, Cart, Checkout, Orders, Account, Admin dashboard

### 6.2 Page Structure

- `/` — Home, featured products
- `/products` — Listing, filters, pagination
- `/products/[slug]` — Product detail, add to cart
- `/cart` — Cart, update qty, remove
- `/checkout` — Address, payment placeholder, place order
- `/orders` — Order list
- `/orders/[id]` — Order detail
- `/auth/login`, `/auth/register`
- `/admin/*` — Products, categories, orders (RBAC protected)

### 6.3 Server Actions

- `createOrder`, `addToCart`, `updateCart`, `login`, `register`
- Server Actions call API internally (or directly DB in a BFF pattern — for learning, calling NestJS API from Server Actions is clearer)
- CSRF token sent with mutations; validate on API
- Store JWT in httpOnly cookie; Server Actions forward cookie to API

---

## Phase 7: Testing (Backend PDF: Unit, Integration, E2E)

### 7.1 API (Jest — NestJS default)

- Unit: Services, guards, pipes
- Integration: Controllers + DB (test DB or SQLite in-memory)
- E2E: `supertest` against full app
- Use `@nestjs/testing` for DI mocking

### 7.2 Web (Vitest)

- Unit: Components, utils, hooks
- Integration: Server Actions with mocked API
- E2E: Playwright (optional, later phase)

### 7.3 Coverage Targets

- Aim for >70% on critical paths (auth, checkout, orders)

---

## Phase 8: Additional Backend PDF Topics (NestJS-Compatible)


| Topic                | NestJS Application                                      |
| -------------------- | ------------------------------------------------------- |
| Dependency Injection | Core NestJS pattern                                     |
| Middleware           | NestJS middleware / interceptors / guards               |
| MVC                  | Controllers (V), Services (M), DTOs (C-ish)             |
| Design Patterns      | Singleton (default), Factory, Strategy in services      |
| SOLID                | Service layer, single responsibility, DI                |
| Query optimization   | TypeORM indexes, raw queries with EXPLAIN for slow ones |
| Views                | PostgreSQL views + TypeORM raw queries or DB views      |
| Stored procedures    | TypeORM `query()` or migrations                         |
| ElasticSearch        | `@nestjs/elasticsearch` for product search (Phase 9)    |
| ELK/ETL              | Optional: add Logstash, Kibana later                    |
| Kafka                | Phase 9+: Add for event streaming if needed             |


---

## Phase 9: Later Enhancements

- ElasticSearch for product search
- Kafka for event sourcing / analytics pipeline
- Stripe/payment integration
- Image upload (S3 or local)
- Reviews/ratings
- Wishlist

---

## Step-by-Step Execution Order

1. **Week 1**: Monorepo + Docker + API + Web skeletons, DB schema, TypeORM, migrations
2. **Week 2**: Auth (register, login, JWT, refresh, cookies), RBAC, guards
3. **Week 3**: Products, categories, cart API + basic UI
4. **Week 4**: Orders, checkout, transactions
5. **Week 5**: RabbitMQ, email queue, background workers
6. **Week 6**: Admin UI, product/category CRUD
7. **Week 7**: Testing (API + Web), CSRF hardening
8. **Week 8**: Polish, Swagger, Docker full stack, README

---

## Security Checklist

- JWT in httpOnly cookies for refresh; short-lived access token
- CSRF token on state-changing requests
- Helmet for security headers
- Input validation (class-validator) on all DTOs
- Rate limiting on auth and sensitive endpoints
- RBAC on every protected route
- No secrets in repo; use env vars
- HTTPS in production

---

## File Structure Reference

```
ecommerce/
├── apps/
│   ├── api/                    # NestJS standalone app
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── cart/
│   │   │   ├── common/         # guards, filters, decorators
│   │   │   ├── queue/
│   │   │   └── main.ts
│   │   ├── test/
│   │   └── package.json        # name: @ecommerce/api
│   └── web/                    # Next.js standalone app
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── lib/
│       │   └── actions/
│       ├── package.json        # name: @ecommerce/web
│       └── vitest.config.ts
├── packages/
│   └── shared/                 # @ecommerce/shared - ui, library, assets
│       ├── src/
│       │   ├── ui/             # React components (shadcn, Button, Card, etc.)
│       │   │   └── index.ts
│       │   ├── library/        # types, enums, schemas, hooks, constants
│       │   │   ├── types.ts
│       │   │   ├── enums.ts
│       │   │   ├── schemas/    # Zod validation
│       │   │   └── index.ts
│       │   ├── assets/         # images, SVGs, static files
│       │   │   └── images/
│       │   └── index.ts
│       ├── scripts/
│       │   └── copy-assets-files.js
│       ├── package.json        # exports: ./ui, ./library, ./assets
│       └── tsconfig.json
├── turbo.json                  # Turborepo task pipeline
├── package.json                # Root: workspaces, turbo scripts
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Initialization Commands Summary (Quick Reference)

**Recommended path — create-turbo first:**

```bash
# 1. Create monorepo (includes web, turbo.json, workspaces)
bunx create-turbo@latest

# 2. Add NestJS API (create-turbo does not include it)
bunx nest new api --directory apps/api --package-manager bun

# 3. Add shared package (ui, library, assets)
mkdir -p packages/shared/src/{ui,library,assets/images}
mkdir -p packages/shared/scripts
# Add packages/shared/package.json with exports for ./ui, ./library, ./assets
# Add scripts/copy-assets-files.js
# Add tsconfig.json, index files
# Wire @ecommerce/shared in apps/api and apps/web

# 4. Add Docker (full stack)
# docker-compose.yml: postgres, redis, rabbitmq, api, web
# Dockerfiles in apps/api and apps/web
# docker compose up — runs entire stack
```

You do **not** run `create-next-app` — `create-turbo` already provides `apps/web` (Next.js).

---

## Standalone Apps Explained

- **NestJS (apps/api)**: Full NestJS app with its own `main.ts`, modules, and config. Imports `@ecommerce/shared/library` for types, enums, validation schemas. Runs independently; deployable to any Node/Bun runtime.
- **Next.js (apps/web)**: Full Next.js app with App Router, pages, and config. Imports `@ecommerce/shared/ui`, `@ecommerce/shared/library`, `@ecommerce/shared/assets`. Runs independently; deployable to Vercel, Docker, etc.
- **No runtime coupling**: Apps communicate only via HTTP (Web calls API). No shared process or bundling.
- **Shared package**: `@ecommerce/shared` is built first; Turbo respects `^build` dependency order. Web uses ui + library + assets; API uses library only.

---

Start with Phase 1: initialize Turborepo, add standalone NestJS and Next.js apps, then proceed to Phase 2.