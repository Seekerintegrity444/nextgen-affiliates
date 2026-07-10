import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { BotDetectionService } from '@/lib/auth/services/bot-detection'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const headers = request.headers
    const userAgent = headers.get('user-agent') || ''
    const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown'

    // Find link account
    const link = await prisma.linkAccount.findUnique({
      where: { slug },
      include: {
        customDomain: true,
      },
    })

    if (!link || !link.isActive) {
      return new NextResponse('Link not found', { status: 404 })
    }

    // Bot Detection
    const botService = new BotDetectionService()
    const botResult = await botService.detect(userAgent, ip)

    // If bot detected, redirect to Facebook
    if (botResult.isBot) {
      // Log bot click
      await prisma.click.create({
        data: {
          linkAccountId: link.id,
          ipAddress: ip,
          userAgent: userAgent,
          isBot: true,
          botScore: botResult.score,
          botReason: botResult.reasons.join(', '),
        },
      })

      // Update bot count
      await prisma.linkAccount.update({
        where: { id: link.id },
        data: { botClicks: { increment: 1 } },
      })

      return NextResponse.redirect('https://facebook.com', { status: 302 })
    }

    // Get country from IP (simplified - use IP2Location API in production)
    const country = 'US'

    // Find country-specific offer
    let offer = await prisma.offerVault.findFirst({
      where: {
        country: country,
        isActive: true,
        userId: link.userId,
      },
    })

    // If no country offer, use global smart link
    if (!offer) {
      offer = await prisma.offerVault.findFirst({
        where: {
          isGlobal: true,
          isActive: true,
          userId: link.userId,
        },
      })
    }

    if (!offer) {
      return new NextResponse('No offer found', { status: 404 })
    }

    // Build final URL
    const finalUrl = `${offer.offerUrl}${slug}`

    // Log click
    await prisma.click.create({
      data: {
        linkAccountId: link.id,
        ipAddress: ip,
        userAgent: userAgent,
        country: country,
        browser: 'Unknown',
        isUnique: true,
        isBot: false,
      },
    })

    // Update counts
    await prisma.linkAccount.update({
      where: { id: link.id },
      data: {
        totalClicks: { increment: 1 },
        uniqueClicks: { increment: 1 },
      },
    })

    return NextResponse.redirect(finalUrl, { status: 302 })
  } catch (error) {
    console.error('Redirect error:', error)
    return new NextResponse('Redirect failed', { status: 500 })
  }
}