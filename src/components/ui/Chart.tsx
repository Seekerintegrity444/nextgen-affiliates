'use client'

import { useEffect, useRef, useState } from 'react'

interface ChartProps {
  data: Array<{ label: string; value: number; color?: string }>
  type?: 'bar' | 'line'
  height?: number
  showValues?: boolean
  title?: string
  subtitle?: string
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (w < 2 * r) r = w / 2
  if (h < 2 * r) r = h / 2
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export function Chart({
  data,
  type = 'bar',
  height = 250,
  showValues = true,
  title,
  subtitle,
}: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.parentElement?.getBoundingClientRect()
    const width = rect ? rect.width : 800

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    ctx.scale(dpr, dpr)

    const maxValue = Math.max(...data.map(d => d.value)) || 1
    const padding = { top: 30, bottom: 30, left: 10, right: 10 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom
    const barWidth = Math.min(chartWidth / data.length * 0.6, 40)
    const gap = chartWidth / data.length

    ctx.clearRect(0, 0, width, height)

    // Grid lines
    ctx.strokeStyle = 'rgba(128, 128, 128, 0.08)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()
    }

    // Draw chart
    data.forEach((item, index) => {
      const x = padding.left + gap * index + (gap - barWidth) / 2
      const barHeight = (item.value / maxValue) * chartHeight
      const y = padding.top + chartHeight - barHeight
      const color = item.color || '#6366F1'
      const isDark = document.documentElement.classList.contains('dark')

      if (type === 'bar') {
        const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartHeight)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, isDark ? color + '20' : color + '15')

        ctx.shadowColor = color
        ctx.shadowBlur = 8
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 2
        ctx.fillStyle = gradient
        ctx.beginPath()
        roundRect(ctx, x, y, barWidth, barHeight, 4)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.shadowOffsetY = 0

        if (showValues && item.value > 0) {
          ctx.fillStyle = isDark ? '#9CA3AF' : '#6B7280'
          ctx.font = '10px Inter, sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(item.value.toString(), x + barWidth / 2, y - 8)
        }

        ctx.fillStyle = color + '10'
        ctx.beginPath()
        roundRect(ctx, x - 4, y - 4, barWidth + 8, barHeight + 8, 6)
        ctx.fill()
      } else {
        const prevX = index > 0 ? padding.left + gap * (index - 1) + barWidth / 2 : x + barWidth / 2
        const prevY = index > 0 ? padding.top + chartHeight - (data[index - 1].value / maxValue) * chartHeight : y

        ctx.strokeStyle = color
        ctx.lineWidth = 2.5
        ctx.shadowColor = color
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(x + barWidth / 2, y)
        ctx.stroke()
        ctx.shadowBlur = 0

        const dotGradient = ctx.createRadialGradient(x + barWidth / 2, y, 0, x + barWidth / 2, y, 8)
        dotGradient.addColorStop(0, color)
        dotGradient.addColorStop(1, color + '40')
        ctx.fillStyle = dotGradient
        ctx.beginPath()
        ctx.arc(x + barWidth / 2, y, 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x + barWidth / 2, y, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      // Label
      ctx.fillStyle = '#9CA3AF'
      ctx.font = '10px Inter, sans-serif'
      ctx.textAlign = 'center'
      if (data.length <= 12) ctx.fillText(item.label, x + barWidth / 2, padding.top + chartHeight + 18)
    })

    // Title
    if (title) {
      ctx.fillStyle = '#6B7280'
      ctx.font = '11px Inter, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(title, width - 10, 18)
    }
    if (subtitle) {
      ctx.fillStyle = '#9CA3AF'
      ctx.font = '9px Inter, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(subtitle, width - 10, 32)
    }
  }, [data, type, height, showValues, title, subtitle, isClient])

  if (!isClient) {
    return (
      <div
        className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
        style={{ height }}
      />
    )
  }

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height }}
      />
    </div>
  )
}