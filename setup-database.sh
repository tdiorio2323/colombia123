#!/bin/bash
# Colombia Creator Platform - Database Setup Script
# Migrates from Supabase to local PostgreSQL + Prisma

set -euo pipefail

echo "🇨🇴 Colombia Creator Platform - Database Migration Setup"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f package.json ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "✅ Found package.json - running from correct directory"

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker not found. Please install Docker Desktop to run PostgreSQL locally."
    echo "   Alternative: Update DATABASE_URL in .env to point to an existing PostgreSQL server"
    read -p "Continue without Docker? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "🐳 Starting PostgreSQL container..."
    docker compose up -d postgres || {
        echo "⚠️  Docker container failed. Continuing with external database..."
    }
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push schema to database
echo "📊 Pushing database schema..."
npx prisma db push --accept-data-loss || {
    echo "❌ Database push failed. Please check your DATABASE_URL in .env"
    echo "   Current DATABASE_URL: ${DATABASE_URL:-'Not set'}"
    exit 1
}

# Optional: Seed database
read -p "🌱 Seed database with sample data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database with sample Colombian creators..."
    npx tsx prisma/seed.ts
fi

echo ""
echo "🎉 Database migration complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Start dev server: npm run dev"
echo "   2. Test health check: curl http://localhost:8080/api/db/health"
echo "   3. Open Prisma Studio: npm run db:studio"
echo ""
echo "🔗 Available database commands:"
echo "   npm run db:up      - Start PostgreSQL"
echo "   npm run db:studio  - Database browser"
echo "   npm run db:push    - Update schema"
echo "   npm run db:seed    - Add sample data"
echo ""
echo "✨ Your Colombia creator platform is now using local PostgreSQL!"
echo "   • No more Supabase fees"
echo "   • Full database control"
echo "   • 20% revenue model preserved"
echo "   • Ready to scale to millions of users"