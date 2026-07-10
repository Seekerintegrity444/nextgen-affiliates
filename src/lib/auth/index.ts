import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'

function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || process.env.USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || process.env.PASSWORD || 'admin123',
    email: process.env.ADMIN_EMAIL || process.env.EMAIL || 'admin@nextgen.local',
  }
}

async function ensureAdminUser(username: string, password: string, email: string) {
  const existingUser = await prisma.user.findUnique({
    where: { username },
  })

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(password, 10)
    return prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    })
  }

  const isCurrentPassword = await bcrypt.compare(password, existingUser.password)
  if (!isCurrentPassword) {
    const hashedPassword = await bcrypt.hash(password, 10)
    return prisma.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    })
  }

  return existingUser
}

export async function verifyCredentials(username: string, password: string) {
  const envAdmin = getAdminCredentials()

  if (username === envAdmin.username && password === envAdmin.password) {
    const user = await ensureAdminUser(envAdmin.username, envAdmin.password, envAdmin.email)

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    return user
  }

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