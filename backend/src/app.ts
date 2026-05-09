import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./modules/auth/auth.routes";
import postRoutes from "./modules/posts/posts.routes";
import categoryRoutes from "./modules/posts/categories.routes";
import tagRoutes from "./modules/posts/tags.routes";
import {
  postCommentsRouter,
  commentsRouter,
} from "./modules/comments/comments.routes";

const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts/:postId/comments", postCommentsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Global error handler — must be last
app.use(errorHandler);

export default app;
