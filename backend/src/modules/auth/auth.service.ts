import { prisma } from "../../config/database";
import { hashPassword, comparePassword } from "../../utils/password";
import { signToken } from "../../utils/jwt";
import { AppError } from "../../middleware/errorHandler";

export const registerUser = async (
  email: string,
  username: string,
  password: string,
) => {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) {
    throw new AppError("Email or username already taken", 409);
  }
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, username, password: hashed },
    select: { id: true, email: true, username: true, createdAt: true },
  });
  const token = signToken({
    id: user.id,
    email: user.email,
    username: user.username,
  });
  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("Invalid credentials", 401);

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new AppError("Invalid credentials", 401);

  const token = signToken({
    id: user.id,
    email: user.email,
    username: user.username,
  });
  return {
    user: { id: user.id, email: user.email, username: user.username },
    token,
  };
};
