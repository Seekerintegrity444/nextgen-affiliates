import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'

export async function verifyCredentials(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) return null

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return null

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  })

  return user
}

export function generateToken(userId: string) {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export async function getUserFromToken(token: string) {
  const decoded = verifyToken(token) as { userId: string }
  if (!decoded) return null

  return await prisma.user.findUnique({
    where: { id: decoded.userId },
  })
}

export function getTokenFromCookie(cookieHeader: string): string | null {
  if (!cookieHeader) return null

  const token = cookieHeader
    .split(';')
    .find(c => c.trim().startsWith('auth-token='))
    ?.split('=')[1]

  return token || null
}