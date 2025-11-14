#!/bin/bash
# Script to start PostgreSQL, apply dark colors migration, and seed database

echo "🔄 Starting PostgreSQL..."
sudo service postgresql start

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to accept connections..."
for i in {1..10}; do
  if pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready"
    break
  fi
  sleep 1
  if [ $i -eq 10 ]; then
    echo "❌ PostgreSQL did not start in time"
    exit 1
  fi
done

echo ""
echo "🔄 Adding darkColors column to Theme table..."
PGPASSWORD=gerald psql -h localhost -U postgres -d dharma_calendar -f scripts/add-dark-colors-column.sql

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migration successful!"
  echo ""
  echo "🌱 Seeding database with themes (including dark mode)..."
  npm run db:seed
else
  echo "❌ Migration failed"
  exit 1
fi
