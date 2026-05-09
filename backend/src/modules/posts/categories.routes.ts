import { Router } from "express";
import { prisma } from "../../config/database";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

export default router;
