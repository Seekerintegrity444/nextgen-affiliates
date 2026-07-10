import Link from 'next/link'
import {
  Globe2,
  BarChart3,
  Link2,
  Bot,
  TrendingUp,
  Shield,
  Rocket,
  Zap,
  CheckCircle,
  Gauge,
  ChevronRight,
  Send,
} from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

export default function HomePage() {
  const features = [
    {
      icon: Globe2,
      title: 'Geo Targeting',
      description: 'Redirect visitors based on their country with custom offers for each region.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track clicks, unique visitors, and geo statistics in real-time with beautiful charts.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Link2,
      title: 'Custom Domains',
      description: 'Use your own domains for white-label tracking links that build trust.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Bot,
      title: 'Bot Detection',
      description: 'Advanced bot detection automatically blocks bots and redirects them away.',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: TrendingUp,
      title: 'Public Dashboards',
      description: 'Share analytics with anyone using secure, public dashboard links.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption, SSL support, and advanced protection for your data.',
      color: 'from-gray-700 to-gray-900'
    },
  ]

  const stats = [
    { value: '1M+', label: 'Clicks Processed', icon: Zap },
    { value: '10K+', label: 'Active Links', icon: Link2 },
    { value: '99.9%', label: 'Uptime', icon: Gauge },
    { value: '50+', label: 'Countries', icon: Globe2 },
  ]

  return (
    <div className="min-h-screen gradient-bg-hero">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container-responsive relative">
        <nav className="flex flex-wrap items-center justify-between gap-4 py-4 sm:py-6 animate-fadeInDown">
          <Logo variant="full" size="lg" showAnimation={true} />
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className="px-4 sm:px-6 py-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition text-sm sm:text-base"
            >
              Login
            </Link>
            <a
              href="https://t.me/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 sm:px-6 py-2 btn-gradient rounded-xl text-sm sm:text-base flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Contact Us
            </a>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto py-12 sm:py-20 animate-fadeInUp">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-100 dark:bg-indigo-950/50 rounded-full mb-6 animate-pulseGlow">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs sm:text-sm font-medium text-indigo-700 dark:text-indigo-300">System Status: Operational</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
            Smart Link Tracking & <span className="gradient-text">Geo Redirect</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Create tracking links, manage geo-targeted offers, and redirect visitors based on their location with advanced analytics and bot protection.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="px-6 sm:px-8 py-3 sm:py-4 btn-gradient rounded-xl text-base sm:text-lg shadow-lg shadow-indigo-500/25 flex items-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Get Started Free
            </Link>
            <a
              href="#features"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition text-base sm:text-lg shadow-lg flex items-center gap-2"
            >
              Learn More
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 py-8 sm:py-12 animate-fadeInUp delay-200">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 sm:p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 card-hover"
            >
              <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-indigo-600 dark:text-indigo-400" />
              <p className="text-2xl sm:text-3xl font-bold gradient-text mt-2">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div id="features" className="py-12 sm:py-20">
          <div className="text-center mb-12 sm:mb-16 animate-fadeInUp delay-300">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">Everything You Need to Succeed</h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-3 sm:mt-4 max-w-2xl mx-auto">Powerful features designed for affiliate marketers and businesses</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 card-hover animate-fadeInUp"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="py-12 sm:py-20 animate-fadeInUp delay-500">
          <div className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl shadow-indigo-500/30">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Ready to Start Tracking?
            </h2>
            <p className="text-indigo-100 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of marketers who trust NextGen Affiliates for their link tracking and geo-redirect needs.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition text-base sm:text-lg font-semibold shadow-lg"
            >
              <Rocket className="w-5 h-5" />
              Get Started Now
            </Link>
          </div>
        </div>

        <footer className="py-6 sm:py-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Logo variant="compact" size="sm" />
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a href="#" className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Privacy</a>
              <a href="#" className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Terms</a>
              <a href="#" className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}