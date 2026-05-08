import { Router } from "express";
import * as PostController from "./posts.controller";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { createPostSchema, updatePostSchema } from "./posts.schema";

const router = Router();

router.get("/", PostController.listPosts);
router.get("/:id", PostController.getPost);
router.post(
  "/",
  authenticate,
  validate(createPostSchema),
  PostController.createPost,
);
router.put(
  "/:id",
  authenticate,
  validate(updatePostSchema),
  PostController.updatePost,
);
router.delete("/:id", authenticate, PostController.deletePost);

export default router;
