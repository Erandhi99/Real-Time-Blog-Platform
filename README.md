# 📝 LiveBlog — Real-Time Blogging Platform

A full-stack blogging platform with nested comments and live updates via WebSockets.

Built with **Node.js + Express + Socket.io** on the backend, **React + Vite** on the frontend, and **PostgreSQL + Prisma** for the data layer.

---

## 🏗️ Tech Stack

| Layer     | Technology                                                    |
| --------- | ------------------------------------------------------------- |
| Frontend  | React 18, Vite, TailwindCSS, TanStack Query, Socket.io-client |
| Backend   | Node.js, Express, Socket.io, JWT, Zod                         |
| Database  | PostgreSQL 16, Prisma ORM                                     |
| Dev Tools | Docker Compose, Vitest, ESLint, Prettier                      |

---

## 📁 Folder Structure

```
Real-Time-Blog-Platform/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema
│   │   ├── seed.ts                 # Seed script with sample data
│   │   └── migrations/             # Prisma migration files
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts              # Environment variable validation (Zod)
│   │   │   └── database.ts         # Prisma client singleton
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.schema.ts  # Zod request schemas
│   │   │   ├── posts/
│   │   │   │   ├── posts.routes.ts
│   │   │   │   ├── posts.controller.ts
│   │   │   │   ├── posts.service.ts
│   │   │   │   └── posts.schema.ts
│   │   │   └── comments/
│   │   │       ├── comments.routes.ts
│   │   │       ├── comments.controller.ts
│   │   │       ├── comments.service.ts
│   │   │       └── comments.schema.ts
│   │   ├── middleware/
│   │   │   ├── authenticate.ts     # JWT verification middleware
│   │   │   ├── errorHandler.ts     # Global error handler
│   │   │   └── validate.ts         # Zod request validation middleware
│   │   ├── sockets/
│   │   │   ├── index.ts            # Socket.io server setup
│   │   │   └── postRoom.ts         # Per-post room logic + reader count
│   │   ├── utils/
│   │   │   ├── jwt.ts              # Sign/verify helpers
│   │   │   ├── password.ts         # bcrypt helpers
│   │   │   └── buildCommentTree.ts # Flat → nested tree transformer
│   │   ├── types/
│   │   │   └── index.ts            # Shared TypeScript types
│   │   └── app.ts                  # Express app setup + route mounting
│   ├── tests/
│   │   ├── pagination.test.ts
│   │   └── commentTree.test.ts
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── server.ts                   # Entry point — HTTP + Socket.io server
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts           # Axios instance with auth headers
│   │   │   ├── posts.ts            # Post API calls
│   │   │   ├── comments.ts         # Comment API calls
│   │   │   └── auth.ts             # Login/register API calls
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── posts/
│   │   │   │   ├── PostCard.tsx
│   │   │   │   ├── PostList.tsx
│   │   │   │   ├── PostFilters.tsx
│   │   │   │   └── Pagination.tsx
│   │   │   ├── comments/
│   │   │   │   ├── CommentTree.tsx  # Recursive nested comment renderer
│   │   │   │   ├── CommentNode.tsx  # Single comment + reply form
│   │   │   │   └── CommentForm.tsx  # Top-level new comment form
│   │   │   └── ui/
│   │   │       ├── Button.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Badge.tsx
│   │   │       └── LiveIndicator.tsx # Pulsing dot + reader count
│   │   ├── hooks/
│   │   │   ├── useSocket.ts         # Socket.io connection + room join
│   │   │   ├── useLiveComments.ts   # Merge REST + live WS comments
│   │   │   └── useAuth.ts           # Auth state helpers
│   │   ├── pages/
│   │   │   ├── HomePage.tsx         # Post list + filters + pagination
│   │   │   ├── PostDetailPage.tsx   # Post + comments + live reader count
│   │   │   ├── CreatePostPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── store/
│   │   │   └── authStore.ts         # Zustand auth store (token + user)
│   │   ├── types/
│   │   │   └── index.ts             # Shared TypeScript types
│   │   ├── utils/
│   │   │   └── formatDate.ts
│   │   ├── App.tsx                  # Routes (React Router)
│   │   ├── main.tsx
│   │   └── index.css                # Tailwind directives
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── docker-compose.yml               # PostgreSQL + Redis services
├── .gitignore
└── README.md
```
