# 🕉️ Dharma Calendar v0.3

A modern Hindu calendar application for tracking Sanatana Dharma events, festivals, and lunar phases with professional DevOps architecture.

## ✨ Features

- **Event Management**: Create, edit, and delete events with rich categorization
- **Calendar Views**: Interactive month view with event filtering
- **Lunar Calculations**: Tithi, paksha, and nakshatra calculations
- **Categories**: Organize events by custom categories (Festivals, Pujas, Vrats, etc.)
- **Themes**: Customizable color themes with dark mode support
- **Settings**: Save locations for accurate astronomical calculations
- **Search & Filter**: Advanced filtering by type, category, date range, and search query

## 🚀 Tech Stack

### Core
- **Framework**: Next.js 15.1.3 (App Router + React Server Components)
- **Language**: TypeScript 5.7 (Strictest mode)
- **Runtime**: Node.js 24 LTS or 25 Latest

### Database & ORM
- **Database**: PostgreSQL 18 (native arrays, JSON support)
- **ORM**: Prisma 6.17 (Type-safe database access)
- **Migrations**: Prisma Migrate (version-controlled schema changes)

### Frontend
- **Styling**: Tailwind CSS v4.1 (CSS-first configuration)
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Date Handling**: date-fns 4.1
- **Validation**: Zod 3.24+

### Development
- **Code Quality**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged
- **Type Checking**: TypeScript strict mode with extra checks

## 🏗️ Architecture

### Design Patterns

- **Service Layer Pattern**: Business logic separated from API routes
- **Repository Pattern**: Data access abstraction with `BaseRepository`
- **Feature-Based Structure**: Organized by domain, not layer
- **Type-Safe Environment**: Zod validation for environment variables
- **Centralized Error Handling**: Custom `AppError` class with error codes

### Folder Structure

```
src/
├── core/                    # Core infrastructure
│   ├── config/             # env.ts, constants.ts, categories.ts
│   ├── database/           # prisma.ts, base.repository.ts
│   ├── errors/             # AppError.ts, error-codes.ts, error-handler.ts
│   └── lib/                # api-response.ts, logger.ts
├── shared/                  # Shared across features
│   ├── components/
│   │   ├── ui/             # Button, Input, Select, Modal, Toast, etc.
│   │   └── layout/         # Header, Container, ErrorBoundary
│   ├── hooks/              # useDebounce, useLocalStorage, useFetch, etc.
│   ├── contexts/           # ToastContext
│   ├── types/              # api.types.ts, common.types.ts
│   └── utils/              # cn.ts, date.utils.ts, format.utils.ts
├── features/                # Feature modules
│   ├── events/
│   │   ├── components/     # EventForm, EventDetailModal
│   │   ├── hooks/          # useEvents, useEventMutations
│   │   ├── repositories/   # event.repository.ts
│   │   ├── services/       # event.service.ts
│   │   ├── types/          # event.types.ts
│   │   └── validations/    # event.schema.ts
│   ├── categories/         # Same structure
│   ├── lunar/              # Moon calculations
│   ├── calendar/           # Calendar views and filters
│   ├── themes/             # Theme management
│   └── settings/           # User preferences
└── app/                     # Next.js App Router
    ├── api/                # API routes
    │   ├── events/
    │   ├── categories/
    │   ├── daily-astronomy/
    │   ├── preferences/
    │   ├── saved-locations/
    │   └── themes/
    ├── calendar/
    ├── events/
    ├── settings/
    ├── layout.tsx
    ├── page.tsx
    └── globals.css
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 24+ or 25+
- PostgreSQL 18
- npm 10+

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/gpherai/sanatana-app.git
   cd sanatana-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up PostgreSQL** (in WSL if on Windows):
   ```bash
   # Install PostgreSQL (if not already installed)
   sudo apt update
   sudo apt install postgresql-18

   # Create database
   sudo -u postgres psql
   CREATE DATABASE dharma_calendar;
   \q
   ```

4. **Configure environment**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your PostgreSQL credentials:
   ```
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/dharma_calendar?schema=public"
   ```

5. **Set up database schema**:
   ```bash
   npm run db:migrate
   ```

6. **Install Husky hooks**:
   ```bash
   npm run prepare
   ```

7. **Start development server**:
   ```bash
   npm run dev
   ```

8. **Open browser**:
   - From Windows: [http://localhost:3000](http://localhost:3000)
   - From WSL: Same URL works!

## 📜 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run db:migrate       # Run Prisma migrations (development)
npm run db:migrate:deploy # Deploy migrations (production)
npm run prepare          # Install Husky git hooks
```

## 🗄️ Database Schema

### Models

- **Category**: Event categories with icons and colors
- **Event**: Calendar events with full metadata
- **UserPreferences**: User settings (view, notifications, etc.)
- **SavedLocation**: Saved locations for astronomy calculations
- **Theme**: Custom color themes

### Key Features

- Native PostgreSQL arrays for tags
- JSON columns for flexible data (lunar dates, theme colors)
- Proper indexing for performance
- Foreign key constraints with cascade options
- Timestamps (createdAt, updatedAt) on all models

## 🌐 API Routes

### Events
- `GET /api/events` - List with filters (type, category, date range, search)
- `GET /api/events?upcoming=true&limit=10` - Get upcoming events
- `POST /api/events` - Create event
- `GET /api/events/[id]` - Get by ID
- `PUT /api/events/[id]` - Update
- `DELETE /api/events/[id]` - Delete

### Categories
- `GET /api/categories` - List all with event counts
- `POST /api/categories` - Create
- `GET/PUT/DELETE /api/categories/[id]` - CRUD operations

### Astronomy
- `GET /api/daily-astronomy?date=YYYY-MM-DD&latitude=X&longitude=Y` - Lunar data

### Preferences & Settings
- `GET/PUT /api/preferences` - User preferences
- `PUT /api/preferences/temp-location` - Set temporary location
- `GET/POST /api/saved-locations` - Saved locations
- `GET/PUT/DELETE /api/saved-locations/[id]` - Location operations

### Themes
- `GET /api/themes` - List all themes
- `POST /api/themes` - Create theme

All routes return standardized JSON responses with proper error handling.

## 🎨 Development Workflow

### Code Quality

Pre-commit hooks automatically run:
- **ESLint**: Fix code issues
- **Prettier**: Format code

### TypeScript Configuration

Strict mode enabled with extra checks:
- `noUncheckedIndexedAccess`
- `exactOptionalPropertyTypes`
- `noImplicitOverride`
- `noImplicitReturns`
- `noUnusedLocals`
- `noUnusedParameters`

### Path Aliases

```typescript
import { env } from '@/core/config/env'
import { Button } from '@/shared/components/ui/Button'
import { eventService } from '@/features/events/services/event.service'
```

## 📦 Deployment

### Environment Variables (Production)

```bash
DATABASE_URL="postgresql://..."
NODE_ENV="production"
NEXT_PUBLIC_APP_NAME="Dharma Calendar"
NEXT_PUBLIC_APP_VERSION="0.3.0"
```

### Build & Deploy

```bash
npm run build
npm run db:migrate:deploy
npm run start
```

## 🔄 Version History

- **v0.3.0** (Current): Complete rewrite with modern architecture
- **v0.2.0**: Filter & Search features
- **v0.1.0**: Initial calendar implementation

## 📝 License

Private project - not licensed for public use.

## 👨‍💻 Author

**Gerald Pherai**
- GitHub: [@gpherai](https://github.com/gpherai)

---

**Built with modern DevOps best practices** 🚀
