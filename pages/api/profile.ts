//Ricky
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

interface MySession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
}

type UserProfile = {
  id: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  avatar: string | null;
};

type Data = UserProfile | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = (await getServerSession(req, res, authOptions as any)) as MySession | null;

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const userId = session.user.id;

  if (req.method === "GET") {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true,
      },
    });

    return res.status(200).json(user!);
  }

  if (req.method === "PUT") {
    const { name, bio, avatar } = req.body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { name, bio, avatar },
    });

    return res.status(200).json(updated);
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
