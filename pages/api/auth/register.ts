//Ricky
import type { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"

type Data = { message: string; userId?: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` })
  }

  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    return res.status(201).json({ message: "User registered successfully", userId: user.id })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
