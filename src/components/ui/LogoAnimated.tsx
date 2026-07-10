'use client'

import { useState, useEffect } from 'react'
import { Rocket, Shield, Sparkles, Zap, Stars } from 'lucide-react'
import { cn } from '@/lib/utils/helpers'

interface LogoAnimatedProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'light' | 'dark'
}

export function LogoAnimated({
  className,
  size = 'lg',
  variant = 'light',
}: LogoAnimatedProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sizeClasses = {
    sm: {
      container: 'p-6 gap-4',
      iconContainer: 'w-16 h-16',
      iconInner: 'w-8 h-8',
      text: 'text-2xl',
      subtext: 'text-sm',
    },
    md: {
      container: 'p-8 gap-6',
      iconContainer: 'w-20 h-20',
      iconInner: 'w-10 h-10',
      text: 'text-3xl',
      subtext: 'text-base',
    },
    lg: {
      container: 'p-10 gap-8',
      iconContainer: 'w-24 h-24',
      iconInner: 'w-12 h-12',
      text: 'text-4xl',
      subtext: 'text-lg',
    },
    xl: {
      container: 'p-14 gap-10',
      iconContainer: 'w-32 h-32',
      iconInner: 'w-16 h-16',
      text: 'text-5xl',
      subtext: 'text-xl',
    },
  }

  const sizes = sizeClasses[size]

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-3xl',
        variant === 'light'
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl'
          : 'bg-gradient-to-br from-indigo-600 to-purple-600',
        'shadow-2xl border border-gray-100 dark:border-gray-800',
        sizes.container,
        className
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-2xl animate-pulseGlow" />
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-3xl animate-pulseGlow delay-300" />
        
        <div
          className={cn(
            'relative rounded-full flex items-center justify-center',
            variant === 'light'
              ? 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30'
              : 'bg-white/10',
            sizes.iconContainer,
            'shadow-xl'
          )}
        >
          <div
            className={cn(
              'rounded-full flex items-center justify-center',
              variant === 'light'
                ? 'bg-gradient-to-br from-indigo-600 to-purple-600'
                : 'bg-white/20',
              sizes.iconInner
            )}
          >
            <Rocket
              className={cn(
                'text-white',
                sizes.iconInner,
                mounted && 'animate-float'
              )}
            />
          </div>

          <div
            className={cn(
              'absolute -bottom-1 -right-1 rounded-full p-1',
              variant === 'light'
                ? 'bg-indigo-600'
                : 'bg-white/20',
              'shadow-lg'
            )}
          >
            <Shield
              className={cn(
                'text-white',
                size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
              )}
            />
          </div>

          <Sparkles
            className={cn(
              'absolute -top-2 -right-2 text-yellow-400',
              mounted && 'animate-pulse',
              size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
            )}
          />
          
          <Zap
            className={cn(
              'absolute -bottom-2 -left-2 text-cyan-400',
              mounted && 'animate-pulse delay-300',
              size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
            )}
          />

          <Stars
            className={cn(
              'absolute -top-1 left-1/2 -translate-x-1/2 text-yellow-300',
              mounted && 'animate-pulse delay-500',
              size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
            )}
          />
        </div>
      </div>

      <div className="text-center">
        <h1
          className={cn(
            'font-bold tracking-tight',
            variant === 'light'
              ? 'gradient-text'
              : 'text-white',
            sizes.text
          )}
        >
          NextGen Affiliates
        </h1>
        <p
          className={cn(
            'font-medium tracking-wider uppercase',
            variant === 'light'
              ? 'text-gray-500 dark:text-gray-400'
              : 'text-indigo-200',
            sizes.subtext
          )}
        >
          Smart Tracking • Geo Redirect
        </p>
      </div>
    </div>
  )
}