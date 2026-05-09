import { Router } from "express";
import { prisma } from "../../config/database";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
    res.json(tags);
  } catch (err) {
    next(err);
  }
});

export default router;
