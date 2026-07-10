# NextGen Affiliates

🚀 Smart Link Tracking & Geo Redirect Platform

## Features

- 🌍 Geo-based smart redirects
- 📊 Advanced analytics with charts
- 🔗 Custom domain support
- 🤖 Bot detection
- 📈 Public dashboards
- 🎨 Modern responsive design
- 🌓 Dark/Light mode
- 📱 Mobile friendly
- 🔒 Enterprise security

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Auth:** JWT
- **Deployment:** Vercel / Docker

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Seekerintegrity444/nextgen-affiliates.git
cd nextgen-affiliates

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# Set up database
npx prisma generate
npx prisma db push
npm run db:seed

# Run development server
npm run dev