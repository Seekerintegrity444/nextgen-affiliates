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
    })

    const totalClicks = links.reduce((sum, link) => sum + link.totalClicks, 0)
    const uniqueClicks = links.reduce((sum, link) => sum + link.uniqueClicks, 0)
    const botClicks = links.reduce((sum, link) => sum + link.botClicks, 0)

    return NextResponse.json({
      totalClicks,
      uniqueClicks,
      botClicks,
      totalLinks: links.length,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}