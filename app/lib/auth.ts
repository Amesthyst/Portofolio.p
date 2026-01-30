//Ricky
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "pages/api/auth/[...nextauth]"

export type MySession = {
  user: { id: string; name?: string; email?: string }
  expires: string
}

export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<MySession | null> {
  const session = await getServerSession(req, res, authOptions)
  return session as MySession | null
}
