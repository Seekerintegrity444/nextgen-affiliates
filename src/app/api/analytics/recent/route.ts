import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getUserFromToken, getTokenFromCookie } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const token = getTokenFromCookie(cookieHeader)

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const links = await prisma.linkAccount.findMany({
      where: { userId: user.id },
      select: { id: true },
    })

    const linkIds = links.map(link => link.id)

    if (linkIds.length === 0) {
      return NextResponse.json([])
    }

    const clicks = await prisma.click.findMany({
      where: {
        linkAccountId: { in: linkIds },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        country: true,
        browser: true,
        createdAt: true,
        isUnique: true,
        isBot: true,
      },
    })

    return NextResponse.json(clicks)
  } catch (error) {
    console.error('Error fetching recent clicks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent clicks' },
      { status: 500 }
    )
  }
}