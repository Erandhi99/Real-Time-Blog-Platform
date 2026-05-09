import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  console.log("Seeding...");

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "technology" },
      update: {},
      create: { name: "Technology", slug: "technology" },
    }),
    prisma.category.upsert({
      where: { slug: "lifestyle" },
      update: {},
      create: { name: "Lifestyle", slug: "lifestyle" },
    }),
    prisma.category.upsert({
      where: { slug: "science" },
      update: {},
      create: { name: "Science", slug: "science" },
    }),
  ]);

  // Tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: "javascript" },
      update: {},
      create: { name: "JavaScript", slug: "javascript" },
    }),
    prisma.tag.upsert({
      where: { slug: "react" },
      update: {},
      create: { name: "React", slug: "react" },
    }),
    prisma.tag.upsert({
      where: { slug: "nodejs" },
      update: {},
      create: { name: "Node.js", slug: "nodejs" },
    }),
    prisma.tag.upsert({
      where: { slug: "productivity" },
      update: {},
      create: { name: "Productivity", slug: "productivity" },
    }),
    prisma.tag.upsert({
      where: { slug: "ai" },
      update: {},
      create: { name: "AI", slug: "ai" },
    }),
  ]);

  // Users
  const password = await bcrypt.hash("password123", 12);
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@example.com" },
      update: {},
      create: { email: "alice@example.com", username: "alice", password },
    }),
    prisma.user.upsert({
      where: { email: "bob@example.com" },
      update: {},
      create: { email: "bob@example.com", username: "bob", password },
    }),
    prisma.user.upsert({
      where: { email: "carol@example.com" },
      update: {},
      create: { email: "carol@example.com", username: "carol", password },
    }),
  ]);

  // Posts
  const post1 = await prisma.post.create({
    data: {
      title: "Getting Started with React and TypeScript",
      body: "TypeScript makes React apps more maintainable. In this post we explore setting up a new project with Vite, configuring strict mode, and writing your first typed components.",
      authorId: users[0].id,
      categoryId: categories[0].id,
      tags: {
        create: [
          { tag: { connect: { id: tags[0].id } } },
          { tag: { connect: { id: tags[1].id } } },
        ],
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Building REST APIs with Node.js and Express",
      body: "Express remains the most popular Node.js framework for good reason. This guide covers project structure, middleware, error handling, and testing your API endpoints.",
      authorId: users[1].id,
      categoryId: categories[0].id,
      tags: {
        create: [
          { tag: { connect: { id: tags[0].id } } },
          { tag: { connect: { id: tags[2].id } } },
        ],
      },
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: "How AI is Changing Software Development",
      body: "From code completion to automated testing, AI tools are becoming an essential part of the modern developer workflow. We look at what is genuinely useful today.",
      authorId: users[2].id,
      categoryId: categories[2].id,
      tags: { create: [{ tag: { connect: { id: tags[4].id } } }] },
    },
  });

  // Comments with nesting
  const c1 = await prisma.comment.create({
    data: {
      body: "Great article! TypeScript really does make a huge difference.",
      authorId: users[1].id,
      postId: post1.id,
    },
  });
  const c2 = await prisma.comment.create({
    data: {
      body: "Agreed, especially once you get used to the compiler errors.",
      authorId: users[2].id,
      postId: post1.id,
      parentId: c1.id,
    },
  });
  await prisma.comment.create({
    data: {
      body: "The strict mode config tripped me up at first but so worth it.",
      authorId: users[0].id,
      postId: post1.id,
      parentId: c2.id,
    },
  });
  await prisma.comment.create({
    data: {
      body: "Could you cover React Query in a follow-up post?",
      authorId: users[2].id,
      postId: post1.id,
    },
  });

  const c3 = await prisma.comment.create({
    data: {
      body: "Express error handling middleware is something I always get wrong. This helped!",
      authorId: users[0].id,
      postId: post2.id,
    },
  });
  await prisma.comment.create({
    data: {
      body: "The key is making sure it is the last middleware registered.",
      authorId: users[1].id,
      postId: post2.id,
      parentId: c3.id,
    },
  });
  await prisma.comment.create({
    data: {
      body: "Interesting perspective on AI tooling. I use Copilot daily now.",
      authorId: users[0].id,
      postId: post3.id,
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
