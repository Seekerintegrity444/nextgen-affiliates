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

    const offers = await prisma.offerVault.findMany({
      where: { userId: user.id },
      orderBy: [
        { isGlobal: 'desc' },
        { createdAt: 'asc' },
      ],
    })

    return NextResponse.json(offers)
  } catch (error) {
    console.error('Error fetching offers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
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

    const body = await request.json()
    const { country, offerUrl, isGlobal } = body

    if (!country || !offerUrl) {
      return NextResponse.json(
        { error: 'Country and offer URL required' },
        { status: 400 }
      )
    }

    // If this is a global offer, unset any existing global offers
    if (isGlobal) {
      await prisma.offerVault.updateMany({
        where: {
          userId: user.id,
          isGlobal: true,
        },
        data: { isGlobal: false },
      })
    }

    const offer = await prisma.offerVault.create({
      data: {
        country: country.toUpperCase(),
        offerUrl,
        isGlobal: isGlobal || false,
        isActive: true,
        userId: user.id,
      },
    })

    return NextResponse.json(offer, { status: 201 })
  } catch (error) {
    console.error('Error creating offer:', error)
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    )
  }
}