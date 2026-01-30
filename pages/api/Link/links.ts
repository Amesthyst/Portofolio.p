import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

type Link = { id: string; title: string; url: string; active: boolean; order: number };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireAuth(req, res);
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  const userId = session.user.id;

  if (req.method === 'GET') {
    try {
      const links = await prisma.link.findMany({
        where: { userid: userId },
        orderBy: { order: 'asc' },
      });
      return res.status(200).json(links);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to fetch links' });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
