//Ricky
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

type Data =
  | { message: string }
  | { name: string; bio: string | null; avatar: string | null };

interface MySession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = (await getServerSession(
    req,
    res,
    authOptions as any
  )) as MySession | null;

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, bio: true, avatar: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch user data" });
  }
}
