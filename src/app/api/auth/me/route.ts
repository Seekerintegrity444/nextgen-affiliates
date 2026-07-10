import { NextResponse } from 'next/server'
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

    return NextResponse.json({
      id: user.id,
      username: user.username,
      role: user.role,
    })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}