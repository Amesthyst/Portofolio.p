import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

type Data = { message: string } | { id: string; title: string; url: string; active: boolean; order: number; userid: string; createdat: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await requireAuth(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.query;
  if (typeof id !== "string") return res.status(400).json({ message: "Invalid link id" });

  if (req.method === "PUT") {
    const { title, url, active, order } = req.body;
    try {
      const updated = await prisma.link.update({
        where: { id },
        data: { title, url, active, order },
      });
      return res.status(200).json({
        id: updated.id,
        title: updated.title,
        url: updated.url,
        active: updated.active ?? false,
        order: updated.order ?? 0,
        userid: updated.userid,
        createdat: updated.createdat?.toISOString() || new Date().toISOString(),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to update link" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.link.delete({ where: { id } });
      return res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to delete link" });
    }
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
