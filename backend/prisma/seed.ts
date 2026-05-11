import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  console.log("Seeding...");

  // ─── Categories ───────────────────────────────────────────────────────────
  const [catTech, catLifestyle, catScience, catCareer, catHealth] =
    await Promise.all([
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
      prisma.category.upsert({
        where: { slug: "career" },
        update: {},
        create: { name: "Career", slug: "career" },
      }),
      prisma.category.upsert({
        where: { slug: "health" },
        update: {},
        create: { name: "Health", slug: "health" },
      }),
    ]);

  // ─── Tags ─────────────────────────────────────────────────────────────────
  const [
    tagJS,
    tagReact,
    tagNode,
    tagProductivity,
    tagAI,
    tagTypeScript,
    tagDocker,
    tagCareer,
    tagMindset,
    tagDatabase,
  ] = await Promise.all([
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
    prisma.tag.upsert({
      where: { slug: "typescript" },
      update: {},
      create: { name: "TypeScript", slug: "typescript" },
    }),
    prisma.tag.upsert({
      where: { slug: "docker" },
      update: {},
      create: { name: "Docker", slug: "docker" },
    }),
    prisma.tag.upsert({
      where: { slug: "career" },
      update: {},
      create: { name: "Career", slug: "career" },
    }),
    prisma.tag.upsert({
      where: { slug: "mindset" },
      update: {},
      create: { name: "Mindset", slug: "mindset" },
    }),
    prisma.tag.upsert({
      where: { slug: "database" },
      update: {},
      create: { name: "Database", slug: "database" },
    }),
  ]);

  // ─── Users ────────────────────────────────────────────────────────────────
  const password = await bcrypt.hash("password123", 12);
  const [alice, bob, carol, dave, eve] = await Promise.all([
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
    prisma.user.upsert({
      where: { email: "dave@example.com" },
      update: {},
      create: { email: "dave@example.com", username: "dave", password },
    }),
    prisma.user.upsert({
      where: { email: "eve@example.com" },
      update: {},
      create: { email: "eve@example.com", username: "eve", password },
    }),
  ]);

  const users = [alice, bob, carol, dave, eve];

  // ─── Posts ────────────────────────────────────────────────────────────────
  // Post 1 — will have 25 top-level comments to demonstrate comment pagination
  const post1 = await prisma.post.create({
    data: {
      title: "Getting Started with React and TypeScript",
      body: `TypeScript makes React apps more maintainable and easier to scale. In this post we explore setting up a new project with Vite, configuring strict mode, and writing your first typed components.

We will cover the key differences between using JavaScript and TypeScript in a React project, how to type props and state correctly, and common pitfalls to avoid when you first get started.

By the end of this guide you will have a solid foundation for building production-grade React applications with full type safety throughout.`,
      authorId: alice.id,
      categoryId: catTech.id,
      tags: {
        create: [
          { tag: { connect: { id: tagJS.id } } },
          { tag: { connect: { id: tagReact.id } } },
          { tag: { connect: { id: tagTypeScript.id } } },
        ],
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Building REST APIs with Node.js and Express",
      body: `Express remains the most popular Node.js framework for good reason. This guide covers project structure, middleware, error handling, and testing your API endpoints.

We look at how to structure a real-world Express application using a modular approach, how to write reusable middleware for validation and authentication, and how to handle errors gracefully so your API always returns meaningful responses.`,
      authorId: bob.id,
      categoryId: catTech.id,
      tags: {
        create: [
          { tag: { connect: { id: tagJS.id } } },
          { tag: { connect: { id: tagNode.id } } },
        ],
      },
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: "How AI is Changing Software Development",
      body: `From code completion to automated testing, AI tools are becoming an essential part of the modern developer workflow. We look at what is genuinely useful today and what is still hype.

Tools like GitHub Copilot, Cursor, and Claude are changing how developers write and review code. But the fundamentals still matter — understanding what the code does, debugging when things go wrong, and making good architectural decisions remain human skills.`,
      authorId: carol.id,
      categoryId: catScience.id,
      tags: {
        create: [
          { tag: { connect: { id: tagAI.id } } },
          { tag: { connect: { id: tagProductivity.id } } },
        ],
      },
    },
  });

  const post4 = await prisma.post.create({
    data: {
      title: "Docker for Developers: A Practical Introduction",
      body: `Containers have transformed how we build and ship software. This post covers the essentials of Docker — images, containers, volumes, and networking — from a developer's perspective.

We walk through containerising a Node.js application, writing a clean Dockerfile, using Docker Compose to manage multiple services locally, and common gotchas that trip up developers new to containers.`,
      authorId: dave.id,
      categoryId: catTech.id,
      tags: {
        create: [
          { tag: { connect: { id: tagDocker.id } } },
          { tag: { connect: { id: tagNode.id } } },
        ],
      },
    },
  });

  const post5 = await prisma.post.create({
    data: {
      title: "PostgreSQL Performance Tips Every Developer Should Know",
      body: `PostgreSQL is incredibly powerful, but getting the most out of it requires understanding a few key concepts. This post covers indexing strategies, query planning, and common performance anti-patterns.

We look at how to use EXPLAIN ANALYZE to understand what your queries are doing, when to add indexes and when they hurt more than they help, and how connection pooling affects application performance at scale.`,
      authorId: eve.id,
      categoryId: catTech.id,
      tags: {
        create: [
          { tag: { connect: { id: tagDatabase.id } } },
          { tag: { connect: { id: tagNode.id } } },
        ],
      },
    },
  });

  const post6 = await prisma.post.create({
    data: {
      title: "The Deep Work Habit: Reclaiming Focus in a Distracted World",
      body: `Cal Newport's concept of deep work has changed how many developers approach their day. But actually implementing it is harder than it sounds.

This post shares practical strategies for carving out uninterrupted focus time, managing notifications, and structuring your workday so that your most important work gets done first — before the meetings and messages take over.`,
      authorId: alice.id,
      categoryId: catLifestyle.id,
      tags: {
        create: [
          { tag: { connect: { id: tagProductivity.id } } },
          { tag: { connect: { id: tagMindset.id } } },
        ],
      },
    },
  });

  const post7 = await prisma.post.create({
    data: {
      title: "From Junior to Senior: What Actually Changes",
      body: `The difference between a junior and senior developer is not just years of experience or knowing more frameworks. It is a fundamental shift in how you think about problems.

Senior developers ask different questions. They care about maintainability, team impact, and long-term consequences of decisions. This post explores the specific mindset shifts that mark the transition — and how to accelerate them.`,
      authorId: bob.id,
      categoryId: catCareer.id,
      tags: {
        create: [
          { tag: { connect: { id: tagCareer.id } } },
          { tag: { connect: { id: tagMindset.id } } },
        ],
      },
    },
  });

  const post8 = await prisma.post.create({
    data: {
      title: "WebSockets Explained: Real-Time Communication on the Web",
      body: `HTTP was designed for request-response communication, but modern applications need something more. WebSockets provide a persistent, full-duplex connection between client and server.

This post explains how WebSockets work under the hood, when to use them versus polling or server-sent events, and how to implement a basic real-time feature using Socket.io in a Node.js application.`,
      authorId: carol.id,
      categoryId: catTech.id,
      tags: {
        create: [
          { tag: { connect: { id: tagNode.id } } },
          { tag: { connect: { id: tagJS.id } } },
        ],
      },
    },
  });

  const post9 = await prisma.post.create({
    data: {
      title: "Sleep, Exercise, and Code Quality: The Connection",
      body: `There is growing evidence that physical health has a direct impact on cognitive performance — including the quality of code you write.

This post explores the research on sleep deprivation and decision-making, how regular exercise affects concentration and creativity, and practical habits that senior engineers use to stay sharp over a long career.`,
      authorId: dave.id,
      categoryId: catHealth.id,
      tags: {
        create: [
          { tag: { connect: { id: tagMindset.id } } },
          { tag: { connect: { id: tagProductivity.id } } },
        ],
      },
    },
  });

  const post10 = await prisma.post.create({
    data: {
      title: "Understanding the JavaScript Event Loop",
      body: `JavaScript is single-threaded but can handle asynchronous operations efficiently. The key is understanding the event loop, call stack, microtask queue, and task queue.

This post breaks down exactly what happens when you call setTimeout, await a promise, or fire an event listener. Understanding this model is essential for writing non-blocking code and debugging async bugs.`,
      authorId: eve.id,
      categoryId: catTech.id,
      tags: {
        create: [
          { tag: { connect: { id: tagJS.id } } },
          { tag: { connect: { id: tagTypeScript.id } } },
        ],
      },
    },
  });

  const post11 = await prisma.post.create({
    data: {
      title: "How to Give and Receive Code Review Feedback Effectively",
      body: `Code review is one of the highest-leverage activities on a software team, yet it is often done poorly. Reviews become nitpicky, personal, or so high-level they add no value.

This post covers specific techniques for giving feedback that is actionable and constructive, how to receive criticism without getting defensive, and how great teams use code review as a learning tool rather than a gatekeeping process.`,
      authorId: alice.id,
      categoryId: catCareer.id,
      tags: {
        create: [
          { tag: { connect: { id: tagCareer.id } } },
          { tag: { connect: { id: tagMindset.id } } },
        ],
      },
    },
  });

  const post12 = await prisma.post.create({
    data: {
      title: "Prisma ORM: Why Developers Love It",
      body: `Prisma has quickly become the most popular ORM in the Node.js ecosystem. Its type-safe query builder, excellent migrations workflow, and Prisma Studio make database work genuinely enjoyable.

This post covers the core concepts — schema definition, migrations, the generated client, and relations — and explains why Prisma is often a better choice than raw SQL or older ORMs like Sequelize for modern TypeScript projects.`,
      authorId: bob.id,
      categoryId: catTech.id,
      tags: {
        create: [
          { tag: { connect: { id: tagDatabase.id } } },
          { tag: { connect: { id: tagTypeScript.id } } },
          { tag: { connect: { id: tagNode.id } } },
        ],
      },
    },
  });

  console.log("✓ 12 posts created");

  // ─── Comments for Post 1 ──────────────────────────────────────────────────
  // 25 top-level comments to trigger comment pagination (default page size 20)
  // Several have nested replies to demonstrate the tree structure

  const topLevelComments = [
    {
      body: "Great article! TypeScript really does make a huge difference in large codebases.",
      authorId: bob.id,
    },
    {
      body: "I switched from plain JS to TS six months ago and I will never go back. The autocomplete alone is worth it.",
      authorId: carol.id,
    },
    {
      body: "Could you cover React Query in a follow-up post? I feel like it pairs perfectly with TypeScript.",
      authorId: dave.id,
    },
    {
      body: "The section on strict mode was really helpful. I always turned it off because of the noise but now I understand why it matters.",
      authorId: eve.id,
    },
    {
      body: "One thing I would add: using Zod for runtime validation alongside TypeScript is a game changer for API responses.",
      authorId: bob.id,
    },
    {
      body: "Just set this up for my team yesterday following this guide. Took about 30 minutes. Highly recommended.",
      authorId: carol.id,
    },
    {
      body: "Does this approach work well with Next.js as well or is it specifically for Vite projects?",
      authorId: dave.id,
    },
    {
      body: "I have been a sceptic of TypeScript for years but this post is making me reconsider. The migration path from JS looks manageable.",
      authorId: eve.id,
    },
    {
      body: "The strict mode config tripped me up at first but the payoff in caught bugs is absolutely worth it.",
      authorId: alice.id,
    },
    {
      body: "Great explanation of generics. That is usually where beginners get lost and you made it very approachable.",
      authorId: bob.id,
    },
    {
      body: "Would love to see benchmarks on build times. My concern with TS is always the slower feedback loop during development.",
      authorId: carol.id,
    },
    {
      body: "Using path aliases with TypeScript in Vite is something I wish I had known earlier. Saves so much time.",
      authorId: dave.id,
    },
    {
      body: "This is the best intro to TS + React I have found. Most tutorials skip the Vite setup entirely.",
      authorId: eve.id,
    },
    {
      body: "One gotcha with strict mode: enabling it on an existing codebase all at once is painful. Better to migrate file by file.",
      authorId: alice.id,
    },
    {
      body: "Has anyone tried this with TanStack Router instead of React Router? Curious if the TypeScript integration is better.",
      authorId: bob.id,
    },
    {
      body: "The typed event handlers section is gold. I spent two hours debugging a synthetic event issue that this would have caught immediately.",
      authorId: carol.id,
    },
    {
      body: "I appreciate that you covered the tsconfig options in detail. Most posts just paste a config without explaining what each flag does.",
      authorId: dave.id,
    },
    {
      body: "Just shared this with my junior devs. We are onboarding them onto TypeScript this quarter and this is exactly the right starting point.",
      authorId: eve.id,
    },
    {
      body: "What is your take on using JSDoc comments as an alternative to full TypeScript? Is it ever the right choice?",
      authorId: alice.id,
    },
    {
      body: "The component props section is what I needed. I always struggled with typing children and event handlers correctly.",
      authorId: bob.id,
    },
    {
      body: "Excellent writeup. I do wish you had covered discriminated unions — they are one of the most useful TS features for React state.",
      authorId: carol.id,
    },
    {
      body: "Using satisfies instead of type assertions is something more people should know about. Great that you included it.",
      authorId: dave.id,
    },
    {
      body: "I have tried three different setups for React + TS and the Vite approach is by far the least painful. Great recommendation.",
      authorId: eve.id,
    },
    {
      body: "The error messages from TypeScript can be intimidating at first. It would be great to see a post on how to read them effectively.",
      authorId: alice.id,
    },
    {
      body: "Bookmarked. This is going into our team wiki. Thanks for putting this together so clearly.",
      authorId: bob.id,
    },
  ];

  const createdTopLevel: any[] = [];
  for (const comment of topLevelComments) {
    const c = await prisma.comment.create({
      data: { ...comment, postId: post1.id },
    });
    createdTopLevel.push(c);
  }

  console.log("✓ 25 top-level comments created on post 1");

  // Nested replies on first several top-level comments
  // Comment 1 — 2 levels deep
  const r1 = await prisma.comment.create({
    data: {
      body: "Agreed, especially once you get used to the compiler errors. They look scary but they are usually pointing at real bugs.",
      authorId: carol.id,
      postId: post1.id,
      parentId: createdTopLevel[0].id,
    },
  });
  await prisma.comment.create({
    data: {
      body: "Exactly. Once I stopped fighting the compiler and started listening to it, my bug count dropped noticeably.",
      authorId: dave.id,
      postId: post1.id,
      parentId: r1.id,
    },
  });

  // Comment 3 (React Query question) — reply with answer
  const r2 = await prisma.comment.create({
    data: {
      body: "Yes! A follow-up covering TanStack Query with TypeScript is on my list. The typed query hooks are really elegant.",
      authorId: alice.id,
      postId: post1.id,
      parentId: createdTopLevel[2].id,
    },
  });
  await prisma.comment.create({
    data: {
      body: "Looking forward to that. The useQuery return type inference alone saves so much boilerplate.",
      authorId: dave.id,
      postId: post1.id,
      parentId: r2.id,
    },
  });

  // Comment 5 (Zod tip) — discussion thread
  const r3 = await prisma.comment.create({
    data: {
      body: "Completely agree on Zod. We use it to parse every API response and the combination with TypeScript inference means we never write duplicate type definitions.",
      authorId: carol.id,
      postId: post1.id,
      parentId: createdTopLevel[4].id,
    },
  });
  await prisma.comment.create({
    data: {
      body: "tRPC takes this even further if you control both ends. End-to-end type safety with zero code generation.",
      authorId: eve.id,
      postId: post1.id,
      parentId: r3.id,
    },
  });

  // Comment 7 (Next.js question) — answered
  await prisma.comment.create({
    data: {
      body: "Works great with Next.js too. The main difference is you use next/image and next/link instead of the plain HTML equivalents, but the TypeScript setup is identical.",
      authorId: alice.id,
      postId: post1.id,
      parentId: createdTopLevel[6].id,
    },
  });

  // Comment 11 (build times) — replied
  await prisma.comment.create({
    data: {
      body: "SWC-based transpilation in Vite means type checking happens separately from bundling. You get fast HMR during dev and run tsc --noEmit in CI. Best of both worlds.",
      authorId: dave.id,
      postId: post1.id,
      parentId: createdTopLevel[10].id,
    },
  });

  console.log("✓ Nested replies created on post 1");

  // ─── Comments on other posts ──────────────────────────────────────────────
  const c2a = await prisma.comment.create({
    data: {
      body: "Express error handling middleware is something I always get wrong. This helped a lot.",
      authorId: alice.id,
      postId: post2.id,
    },
  });
  await prisma.comment.create({
    data: {
      body: "The key is making sure it is the last middleware registered. Easy to miss but breaks everything if you get it wrong.",
      authorId: bob.id,
      postId: post2.id,
      parentId: c2a.id,
    },
  });
  await prisma.comment.create({
    data: {
      body: "Also worth noting that async errors need to be explicitly passed to next() or Express will not catch them in v4.",
      authorId: carol.id,
      postId: post2.id,
    },
  });

  await prisma.comment.create({
    data: {
      body: "Interesting perspective on AI tooling. I use Copilot daily now and it genuinely speeds up the repetitive parts.",
      authorId: alice.id,
      postId: post3.id,
    },
  });
  await prisma.comment.create({
    data: {
      body: "I think the danger is over-relying on it for things you do not fully understand yet. Great tool, but it can make you lazy about fundamentals.",
      authorId: dave.id,
      postId: post3.id,
    },
  });

  await prisma.comment.create({
    data: {
      body: "The Docker Compose section is what I needed. I always set up containers manually and it was a mess.",
      authorId: bob.id,
      postId: post4.id,
    },
  });

  await prisma.comment.create({
    data: {
      body: "EXPLAIN ANALYZE changed how I write queries. I had no idea how many sequential scans I was doing.",
      authorId: carol.id,
      postId: post5.id,
    },
  });
  await prisma.comment.create({
    data: {
      body: "Adding an index on a 10 million row table without a concurrent build is a trap I fell into in production. Learned the hard way.",
      authorId: dave.id,
      postId: post5.id,
    },
  });

  await prisma.comment.create({
    data: {
      body: "The deep work concept completely changed how I structure my mornings. No email or Slack until 11am and my output doubled.",
      authorId: eve.id,
      postId: post6.id,
    },
  });

  await prisma.comment.create({
    data: {
      body: "The mindset shift point resonated with me. Juniors ask how, seniors ask why.",
      authorId: alice.id,
      postId: post7.id,
    },
  });

  await prisma.comment.create({
    data: {
      body: "The explanation of the microtask queue vs task queue is the clearest I have seen. I finally understand why Promise callbacks run before setTimeout callbacks.",
      authorId: bob.id,
      postId: post10.id,
    },
  });

  await prisma.comment.create({
    data: {
      body: "Prisma Studio alone makes it worth using. Being able to browse and edit data without writing SQL during development is a huge time saver.",
      authorId: carol.id,
      postId: post12.id,
    },
  });

  console.log("✓ Comments on other posts created");
  console.log("\nSeed complete.");
  console.log("\nTest credentials:");
  console.log("  alice@example.com  / password123");
  console.log("  bob@example.com    / password123");
  console.log("  carol@example.com  / password123");
  console.log("  dave@example.com   / password123");
  console.log("  eve@example.com    / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
