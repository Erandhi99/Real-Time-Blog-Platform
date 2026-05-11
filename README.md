# 📝 LiveBlog — Real-Time Blogging Platform

A full-stack blogging platform with nested comments and live updates via WebSockets.
Built with **Node.js + Express + Socket.io** on the backend, **React + Vite** on the frontend,
and **PostgreSQL + Prisma** for the data layer.

---

## 🏗️ Tech Stack

| Layer     | Technology                                                                |
| --------- | ------------------------------------------------------------------------- |
| Frontend  | React 18, Vite, TailwindCSS v4, TanStack Query, Socket.io-client, Zustand |
| Backend   | Node.js, Express, Socket.io, JWT, Zod, bcryptjs                           |
| Database  | PostgreSQL 16, Prisma ORM                                                 |
| Dev Tools | Docker Compose, Vitest, TypeScript, nodemon                               |

---

## 📁 Folder Structure

```
real-time-blog-platform/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma               # Database schema
│   │   ├── seed.ts                     # Seed script with sample data
│   │   └── migrations/                 # Prisma migration files
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts                  # Environment variable validation (Zod)
│   │   │   └── database.ts             # Prisma client singleton
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.schema.ts
│   │   │   ├── posts/
│   │   │   │   ├── posts.routes.ts
│   │   │   │   ├── posts.controller.ts
│   │   │   │   ├── posts.service.ts
│   │   │   │   ├── posts.schema.ts
│   │   │   │   ├── categories.routes.ts
│   │   │   │   └── tags.routes.ts
│   │   │   └── comments/
│   │   │       ├── comments.routes.ts
│   │   │       ├── comments.controller.ts
│   │   │       ├── comments.service.ts
│   │   │       └── comments.schema.ts
│   │   ├── middleware/
│   │   │   ├── authenticate.ts         # JWT verification middleware
│   │   │   ├── errorHandler.ts         # Global error handler
│   │   │   └── validate.ts             # Zod request validation middleware
│   │   ├── sockets/
│   │   │   ├── index.ts                # Socket.io server setup
│   │   │   └── postRoom.ts             # Per-post room logic + reader count
│   │   ├── utils/
│   │   │   ├── jwt.ts                  # Sign/verify helpers
│   │   │   ├── password.ts             # bcrypt helpers
│   │   │   └── buildCommentTree.ts     # Flat → nested tree transformer
│   │   ├── types/
│   │   │   └── index.ts                # Shared TypeScript types
│   │   └── app.ts                      # Express app + route mounting
│   ├── tests/
│   │   ├── pagination.test.ts
│   │   └── commentTree.test.ts
│   ├── .env.example
│   ├── nodemon.json
│   ├── package.json
│   ├── tsconfig.json
│   └── server.ts                       # Entry point — HTTP + Socket.io server
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts               # Axios instance with auth headers
│   │   │   ├── posts.ts                # Post API calls
│   │   │   ├── comments.ts             # Comment API calls
│   │   │   └── auth.ts                 # Login/register API calls
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx          # Nav with dark mode toggle
│   │   │   │   └── Layout.tsx
│   │   │   ├── posts/
│   │   │   │   ├── PostCard.tsx
│   │   │   │   ├── PostFilters.tsx     # Search + category + tag filters
│   │   │   │   └── Pagination.tsx
│   │   │   ├── comments/
│   │   │   │   ├── CommentTree.tsx     # Recursive nested comment renderer
│   │   │   │   ├── CommentNode.tsx     # Single comment + reply + delete
│   │   │   │   └── CommentForm.tsx     # Comment/reply input form
│   │   │   └── ui/
│   │   │       ├── Button.tsx
│   │   │       ├── Badge.tsx
│   │   │       └── LiveIndicator.tsx   # Pulsing dot + reader count
│   │   ├── hooks/
│   │   │   ├── useSocket.ts            # Socket.io connection + room join
│   │   │   └── useLiveComments.ts      # Merge REST + live WS comments
│   │   ├── pages/
│   │   │   ├── HomePage.tsx            # Post list + filters + pagination
│   │   │   ├── PostDetailPage.tsx      # Post + comments + live reader count
│   │   │   ├── CreatePostPage.tsx      # Create new post
│   │   │   ├── EditPostPage.tsx        # Edit existing post (author only)
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── store/
│   │   │   ├── authStore.ts            # Zustand auth store (token + user)
│   │   │   └── themeStore.ts           # Zustand dark mode store
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── formatDate.ts           # Relative timestamps
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css                   # CSS variables + Tailwind import
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── docker-compose.yml                  # PostgreSQL service
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) & Docker Compose (or a local PostgreSQL install)
- [pnpm](https://pnpm.io/) — install with `npm install -g pnpm`

---

### 1. Clone the repository

```bash
git clone https://github.com/Erandhi99/real-time-blog-platform.git
cd real-time-blog-platform
```

---

### 2. Start the database

```bash
docker compose up -d
```

This starts a PostgreSQL 16 instance on port `5432`.

> **No Docker?** Install PostgreSQL directly and create a database called `liveblog`.
> The connection string stays the same.

---

### 3. Set up the backend

```bash
cd backend
cp .env.example .env
pnpm install
pnpm approve-builds
```

Edit `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/liveblog"
JWT_SECRET="change_this_to_a_long_random_string"
PORT=4000
CLIENT_URL="http://localhost:5173"
```

Run migrations and seed the database:

```bash
pnpm exec prisma migrate dev --name init
pnpm exec prisma generate
pnpm exec prisma db seed
```

Start the backend:

```bash
pnpm dev
```

Backend runs on **http://localhost:4000**

---

### 4. Set up the frontend

```bash
cd ../frontend
cp .env.example .env
pnpm install
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:4000/api
VITE_WS_URL=http://localhost:4000
```

Start the frontend:

```bash
pnpm dev
```

Frontend runs on **http://localhost:5173**

---

## 🌱 Seed Data

The seed script (`backend/prisma/seed.ts`) creates:

- **3 users** with hashed passwords
- **3 categories** — Technology, Lifestyle, Science
- **5 tags** — JavaScript, React, Node.js, Productivity, AI
- **3 posts** with tags and categories assigned
- **7+ comments** including nested replies up to 3 levels deep

Test credentials:

| Email             | Password    |
| ----------------- | ----------- |
| alice@example.com | password123 |
| bob@example.com   | password123 |
| carol@example.com | password123 |

Re-run the seed at any time:

```bash
cd backend
pnpm exec prisma db seed
```

---

## 🔌 API Reference

### Auth

| Method | Endpoint             | Auth | Description       |
| ------ | -------------------- | ---- | ----------------- |
| POST   | `/api/auth/register` | ✗    | Register new user |
| POST   | `/api/auth/login`    | ✗    | Login, get JWT    |

### Posts

| Method | Endpoint         | Auth | Description                         |
| ------ | ---------------- | ---- | ----------------------------------- |
| GET    | `/api/posts`     | ✗    | List posts — paginated + filterable |
| GET    | `/api/posts/:id` | ✗    | Get single post                     |
| POST   | `/api/posts`     | ✓    | Create post                         |
| PUT    | `/api/posts/:id` | ✓    | Update post (author only)           |
| DELETE | `/api/posts/:id` | ✓    | Delete post (author only)           |

**Query params for `GET /api/posts`:**

| Param      | Type   | Description                           |
| ---------- | ------ | ------------------------------------- |
| `page`     | number | Page number (default: 1)              |
| `size`     | number | Items per page (default: 10, max: 50) |
| `category` | string | Filter by category slug               |
| `tag`      | string | Filter by tag slug                    |
| `search`   | string | Keyword search on title and body      |

### Comments

| Method | Endpoint                                | Auth | Description                       |
| ------ | --------------------------------------- | ---- | --------------------------------- |
| GET    | `/api/posts/:id/comments`               | ✗    | Get comment tree (paginated)      |
| POST   | `/api/posts/:id/comments`               | ✓    | Create top-level comment          |
| POST   | `/api/posts/:postId/comments/:id/reply` | ✓    | Reply to a comment                |
| DELETE | `/api/comments/:id`                     | ✓    | Soft-delete comment (author only) |

**Query params for comments:** `page`, `size` — paginates top-level comments only; all replies are returned nested beneath them.

### Categories & Tags

| Method | Endpoint          | Auth | Description         |
| ------ | ----------------- | ---- | ------------------- |
| GET    | `/api/categories` | ✗    | List all categories |
| GET    | `/api/tags`       | ✗    | List all tags       |

---

## 🔴 WebSocket Events

Connect to the Socket.io server at `VITE_WS_URL`.

### Client → Server

| Event        | Payload              | Description              |
| ------------ | -------------------- | ------------------------ |
| `join:post`  | `{ postId: string }` | Join a post's live room  |
| `leave:post` | `{ postId: string }` | Leave a post's live room |

### Server → Client

| Event            | Payload                             | Description                   |
| ---------------- | ----------------------------------- | ----------------------------- |
| `comment:new`    | `CommentNode`                       | New comment broadcast to room |
| `readers:update` | `{ postId: string, count: number }` | Live reader count update      |

---

## ✅ Feature Checklist

### Authentication

- [x] Register with email, username, and password
- [x] Login and receive JWT
- [x] Token persisted in sessionStorage
- [x] Auto-attach token to all API requests
- [x] Global 401 handler redirects to login

### Posts

- [x] Create post (authenticated)
- [x] Read post list with pagination
- [x] Read single post
- [x] Update post — author only (frontend + backend)
- [x] Delete post — author only (frontend + backend)
- [x] Filter by category
- [x] Filter by tag
- [x] Search by keyword

### Comments

- [x] Add top-level comment (authenticated)
- [x] Reply to any comment — nested at least 2 levels deep
- [x] Render comments as a recursive nested tree
- [x] Delete own comment — soft delete preserves thread structure
- [x] Paginate top-level comments

### Live Features (WebSockets)

- [x] Join a per-post Socket.io room on page open
- [x] Leave room on page close or navigation
- [x] Live reader count — updates on join, leave, and disconnect
- [x] New comments appear instantly without page refresh
- [x] Disconnect handled correctly — count decrements

### Frontend Pages

- [x] Home — post list with pagination, search, category and tag filters
- [x] Post detail — full post, nested comments, live reader count
- [x] Create post — title, body, category, tag selector
- [x] Edit post — pre-filled form, author only
- [x] Login
- [x] Register
- [x] Dark mode toggle — persists via localStorage
- [x] Relative timestamps (e.g. "2h ago")
- [x] Skeleton loading states
- [x] Responsive layout

---

## 🧪 Running Tests

```bash
cd backend
pnpm test
```

Covers:

- **Pagination** — correct slicing, edge cases (empty list, out-of-range page, page 0)
- **Comment tree builder** — flat to nested, 3-level nesting, orphan comment handling

---

## ⚠️ Known Limitations

- **No refresh token** — JWT expires and the user must log in again. A refresh token flow with httpOnly cookies was omitted for scope.
- **In-memory reader count** — counts are stored in a `Map` in the server process. They reset on restart and would not be accurate across multiple Node.js instances without a Redis adapter.
- **WebSocket auth is soft** — unauthenticated users can join post rooms and receive live updates (read-only), which matches the spec's public read access requirement.
- **Plain text posts** — no rich text or markdown rendering. Post body is stored and displayed as plain text.
- **Soft delete only** — deleted comments show `[deleted]` to preserve thread structure. There is no hard delete option.
- **No rate limiting** — the API has no rate limiting on auth or comment endpoints.

---

## 🚀 Potential Improvements

- **Redis adapter** for Socket.io to support horizontal scaling across multiple server instances
- **Refresh token rotation** with httpOnly cookies for improved auth security
- **Rich text editor** (e.g. Tiptap) for post authoring with markdown support
- **Full-text search** using PostgreSQL `tsvector` and `to_tsquery`
- **Email notifications** to post author when a new comment is posted
- **Rate limiting** using `express-rate-limit` on auth and write endpoints
- **Optimistic UI updates** for comment submission
- **CI/CD pipeline** via GitHub Actions — lint, test, and build on every push
