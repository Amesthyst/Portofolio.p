import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

type Data =
  | { message: string }
  | {
    id: string;
    title: string;
    url: string;
    active: boolean | null;
    order: number | null;
    userid: string;
    createdat: Date | null;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getServerSession(req, res, authOptions as any);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid link id" });
  }

  if (req.method === "PUT") {
    const { title, url, active, order } = req.body;

    try {
      const updated = await prisma.link.update({
        where: { id },
        data: { title, url, active, order },
      });

      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update link" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.link.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete link" });
    }
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
