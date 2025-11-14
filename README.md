# 🕉️ Dharma Calendar

A modern, spiritual calendar application for tracking Sanatana Dharma events, festivals, lunar phases, and special days.

## 📋 Overview

Dharma Calendar helps you stay connected with important dates in the Hindu lunar calendar, including:

- 🌕 Purnima (Full Moon) and 🌑 Amavasya (New Moon)
- 🎉 Major festivals (Diwali, Holi, Navaratri, etc.)
- 🙏 Special days related to Ganesha, Durga, Shiva, and other deities
- 📅 Tithi and Nakshatra information
- 🔔 Ekadashi and other Vratam days

## 🚀 Tech Stack

- **Framework**: Next.js 15.5 (React 19)
- **Language**: TypeScript 5.7 (ES2022 target)
- **Styling**: Tailwind CSS v4.1
- **Database**: PostgreSQL 18 (native arrays support)
- **ORM**: Prisma 6.16 (Rust-free)
- **UI Components**: shadcn/ui + react-big-calendar + Radix UI
- **Icons**: Lucide React
- **Date Handling**: date-fns 4.1
- **Validation**: Zod 4.1
- **Runtime**: Node.js 24

## 📁 Project Structure

```
sanatana-kalender/
├── DOCS/              # Project documentation
├── PROGRESS/          # Development tracking
├── src/
│   ├── app/          # Next.js App Router
│   │   ├── api/      # API routes
│   │   │   ├── events/   # Event API (✓ implemented)
│   │   │   └── themes/   # Theme API (✓ implemented)
│   │   ├── calendar/ # Calendar page (✓ implemented)
│   │   ├── settings/ # Settings page (✓ implemented)
│   │   └── *.tsx     # Page components
│   ├── components/   # React components
│   │   ├── layout/   # Layout components
│   │   │   └── Header.tsx  # Navigation (✓ implemented)
│   │   ├── theme/    # Theme components
│   │   │   └── ThemeSwitcher.tsx  # Theme switcher (✓ implemented)
│   │   ├── events/   # Event components
│   │   │   └── EventDetailModal.tsx  # Event details (✓ implemented)
│   │   ├── ui/       # shadcn/ui components (placeholder)
│   │   └── */        # Feature components (planned)
│   ├── lib/          # Utility libraries
│   │   ├── db.ts              # Prisma client
│   │   ├── date-utils.ts      # Date helpers
│   │   ├── event-utils.ts     # Event helpers
│   │   ├── theme-manager.ts   # Theme system
│   │   ├── validations.ts     # Zod schemas
│   │   └── utils.ts           # General utilities
│   ├── types/        # TypeScript type definitions
│   │   ├── event.ts   # Event types
│   │   ├── theme.ts   # Theme types
│   │   ├── lunar.ts   # Lunar types
│   │   └── api.ts     # API types
│   └── config/       # Configuration files
│       ├── categories.ts  # Event categories
│       └── constants.ts   # App constants
├── prisma/           # Database schema & migrations
│   ├── schema.prisma # Database schema
│   ├── seed.ts       # Seed script
│   └── dev.db        # SQLite database
├── public/           # Static assets
│   └── themes/       # Theme JSON files
└── scripts/          # Utility scripts (planned)
```

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js 24** or higher (required for latest features)
- **PostgreSQL 18** (local installation or Docker)
- npm or pnpm

### Installation

1. Navigate to project directory:

```bash
cd C:\projects\sanatana-kalender
```

2. Install dependencies:

```bash
npm install
```

3. Setup PostgreSQL database:

```bash
# Create database (adjust credentials as needed)
psql -U postgres -c "CREATE DATABASE dharma_calendar;"
```

4. Setup environment:

```bash
cp .env.example .env
# Edit .env and update DATABASE_URL with your PostgreSQL credentials
```

5. Setup database schema:

```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Create database schema
npm run db:seed        # Seed with example data
```

6. Run development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Development Tools

- **Prisma Studio**: `npm run db:studio` - Visual database editor at http://localhost:5555

## 🎨 Implementation Status

### ✅ Phase 0: Foundation (Complete)

- ✅ Project structure and configuration
- ✅ Database schema designed (6 tables)
- ✅ TypeScript types defined
- ✅ Utility functions implemented
- ✅ Theme system foundation (3 themes)
- ✅ Event categories configured (8 categories)
- ✅ Seed data with examples
- ✅ Root layout with Header component
- ✅ Dark mode toggle functionality

### ✅ Phase 1: View & Navigate (Complete)

**Goal:** User can view events in calendar

- ✅ Theme system (fully functional)
- ✅ Settings page with theme management
- ✅ API route: GET /api/themes
- ✅ API route: GET /api/events
- ✅ Calendar page with react-big-calendar
- ✅ Display events on calendar with category colors
- ✅ Date navigation (prev/next/today buttons)
- ✅ View switcher (Day/Week/Month)
- ✅ Event click → show details modal
- ✅ Event detail modal with all information

### ✅ Phase 2: Create & Manage (Complete - 100%)

**Goal:** User can add, edit, and delete events

- ✅ Form validation schemas (Zod with centralized enums)
- ✅ API routes: POST/PUT/DELETE /api/events
- ✅ GET /api/categories endpoint
- ✅ EventForm component (reusable for create/edit)
- ✅ New event page (/events/new) with "New Event" button on calendar
- ✅ Edit event page (/events/[id])
- ✅ Delete confirmation dialog with safety prompts
- ✅ Edit/Delete buttons in event detail modal
- ✅ Calendar auto-refresh after CRUD operations
- ✅ Toast notifications (success/error feedback)
- ✅ Request deduplication (AbortController)
- ✅ Better server error messages (api-errors.ts)
- ✅ Lunar field dropdowns (Tithi with Paksha groups, 27 Nakshatras, 12 Hindu months)
- ✅ Font consistency across all form elements
- ✅ Complete CRUD workflow with excellent UX

### 🔍 Phase 3: Filter & Search (In Progress - 60%)

**Goal:** Find specific events in large dataset

- ✅ Filter sidebar with 7 filter types (search, categories, types, recurrence, lunar)
- ✅ Real-time search across name/description/tags with debounce
- ✅ Moon phase display in calendar (🌑🌒🌓🌔🌕🌖🌗🌘)
- ✅ Lunar day styling with gradients (Purnima, Amavasya, Ekadashi)
- ✅ URL parameter sync for shareable filtered views
- ✅ LocalStorage persistence for UI preferences
- 🔜 Date range picker for custom filtering
- 🔜 Settings expansion (calendar/location preferences)
- 🔜 Responsive design polish

### ✨ Phase 4: Enhance & Persist (Planned)

**Goal:** Professional feel and persistent data

- 🔜 Database persistence for user preferences
- 🔜 Performance optimization
- 🔜 Error boundaries and loading states
- 🔜 Toast notifications
- 🔜 Form auto-save drafts

### 🚀 Phase 5: Advanced Features (Planned)

**Goal:** Extended functionality

- 🔜 Panchang API integration with caching
- 🔜 CSV/ICS import/export
- 🔜 Event templates and bulk operations
- 🔜 Browser notifications/reminders

### 🌐 Phase 6: Production Deployment (Planned)

**Goal:** Live and accessible

- 🔜 PostgreSQL migration
- 🔜 Docker containerization
- 🔜 VPS deployment with SSL
- 🔜 Backup automation and monitoring

## 📖 Documentation

- [Architecture](./DOCS/ARCHITECTURE.md) - Technical architecture and design decisions
- [TODO](./PROGRESS/TODO.md) - Current tasks and roadmap
- [Changelog](./PROGRESS/CHANGELOG.md) - Development history

## 🗄️ Database Schema

### Tables

- **EventCategory** - Event categories (Ganesha, Durga, Shiva, etc.)
- **Event** - Main events table with recurrence support
- **EventOccurrence** - Specific date instances of events
- **LunarEvent** - Purnima, Amavasya, Ekadashi dates
- **UserPreference** - User settings and preferences
- **ApiCache** - External API response caching

See `prisma/schema.prisma` for detailed schema.

## 🎨 Theme System

Three pre-configured themes available:

- **spiritual-minimal** (default) - Clean, modern design with subtle spiritual touches
- **traditional-rich** - Vibrant colors inspired by traditional temple art
- **cosmic-purple** - Mystical purple-blue tones inspired by the universe

Themes use JSON configuration with CSS variables (Tailwind v4 data-attribute convention) for runtime switching without rebuild. Dark mode works independently with any theme.

## 📝 Development Workflow

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint

npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes to database
npm run db:seed      # Seed database with example data
npm run db:studio    # Open Prisma Studio
```

## 🙏 Purpose

This application is built for personal use to maintain connection with spiritual practices and important dates in the Sanatana Dharma tradition. The project serves as both a practical tool and a learning journey in modern web development.

## 🤝 Contributing

This is a personal project, but suggestions and ideas are welcome via issues.

---

**Version**: 0.2.0 (Phase 3 Development)  
**Last Updated**: October 9, 2025  
**Status**: Phase 3 (Filter & Search) - 60% Complete 🎉  
**Recent**: Complete filter system, Search functionality, Moon phase visualization, Lunar day gradients
