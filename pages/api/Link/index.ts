import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

type Link = {
  id: string;
  title: string;
  url: string;
  active: boolean;
  order: number;
  userid: string;
  createdat: string;
};

type Data = { message: string } | Link[] | Link;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await requireAuth(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const userId = session.user.id;

  if (req.method === "GET") {
    const links = await prisma.link.findMany({
      where: { userid: userId },
      orderBy: { order: "asc" },
    });

    const safeLinks: Link[] = links.map((l) => ({
      id: l.id,
      title: l.title,
      url: l.url,
      active: l.active ?? false,
      order: l.order ?? 0,
      userid: l.userid,
      createdat: l.createdat?.toISOString() || new Date().toISOString(),
    }));

    return res.status(200).json(safeLinks);
  }

  if (req.method === "POST") {
    const { title, url } = req.body;
    if (!title || !url) return res.status(400).json({ message: "Missing fields" });

    const link = await prisma.link.create({
      data: { title, url, userid: userId, order: (await prisma.link.count({ where: { userid: userId } })) },
    });

    return res.status(201).json({
      id: link.id,
      title: link.title,
      url: link.url,
      active: link.active ?? false,
      order: link.order ?? 0,
      userid: link.userid,
      createdat: link.createdat?.toISOString() || new Date().toISOString(),
    });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
