# 🏗️ Architecture Documentation

## Overview

Dharma Calendar is built as a modern web application using the Next.js App Router with a focus on simplicity, maintainability, and future scalability. This document outlines the technical architecture, design decisions, and rationale behind the implementation choices.

## Tech Stack

### Frontend

- **Framework:** Next.js 15.5 (React 19)
- **Language:** TypeScript 5.7 (target: ES2022)
  - Modern features: optional chaining (?.), nullish coalescing (??), Array.at()
- **Styling:** Tailwind CSS v4.1 (data-attribute theming)
- **UI Components:**
  - shadcn/ui (base components)
  - react-big-calendar (calendar view)
  - Radix UI (primitives)
  - focus-trap-react (modal accessibility)
- **Icons:** Lucide React 0.468
- **Date Handling:** date-fns 4.1

### Backend

- **Runtime:** Node.js 24
- **API:** Next.js API Routes (App Router)
- **Database:** PostgreSQL 18 (native arrays support)
- **ORM:** Prisma 6.16 (Rust-free generator)
- **Validation:** Zod 4.1

### Development Tools

- **Package Manager:** npm
- **Type Checking:** TypeScript strict mode
- **Linting:** ESLint 9.17 with Next.js config
- **Database Tools:** Prisma Studio, tsx for seed scripts

## Architecture Patterns

### 1. Monolithic Start (Phase 0-2)

```
Single Next.js Application
├── Frontend (React components)
├── Backend (API routes)
└── Database (PostgreSQL)
```

**Rationale:**

- Faster initial development
- Simpler deployment and operations
- Single codebase to maintain
- Reduced complexity for single-user scenario
- Can split later if needed (microservices path defined)

### 2. Data Flow

```
User Interaction (Browser)
    ↓
Component State (React 19)
    ↓
API Route (/api/*)
    ↓
Validation Layer (Zod with centralized enums)
    ↓
Prisma ORM
    ↓
Database (PostgreSQL 18)
    ↓
API Response (JSON)
    ↓
Component Update (React)
    ↓
UI Re-render
```

### 3. Theme System Architecture

```
Theme JSON Files (/public/themes/*.json)
    ↓
Theme Manager (lib/theme-manager.ts)
    ↓
data-theme Attribute + .dark Class (HTML element)
    ↓
CSS Variable Definitions ([data-theme="X"] in globals.css)
    ↓
Tailwind Utility Classes (components)
    ↓
Runtime Styling
```

**Key Features:**

- **Tailwind v4 Convention:** Uses `[data-theme]` attribute selector for theme variants
- **Independent Dark Mode:** `.dark` class works with any theme via scoped CSS variables
- **Pure CSS Implementation:** No JavaScript manipulation of CSS properties
- Runtime theme switching without rebuild
- Easy experimentation with new themes (JSON + CSS only)
- No database dependency for themes

## Directory Structure

```
src/
├── app/              # Next.js App Router
│   ├── api/         # Backend API routes
│   │   ├── events/         # Event CRUD endpoints
│   │   │   ├── route.ts        # GET (list) + POST (create) (✓ implemented)
│   │   │   └── [id]/
│   │   │       └── route.ts    # GET/PUT/DELETE single event (✓ implemented)
│   │   ├── categories/
│   │   │   └── route.ts        # GET all categories (✓ implemented)
│   │   ├── lunar/          # Lunar events endpoint (📅 Phase 3)
│   │   ├── preferences/    # User preferences (📅 Phase 4)
│   │   └── themes/
│   │       └── route.ts        # GET available themes (✓ implemented)
│   ├── calendar/    # Calendar page
│   │   └── page.tsx        # Full calendar with CRUD integration (✓ implemented)
│   ├── events/      # Event management pages
│   │   ├── new/        # New event form
│   │   │   └── page.tsx    # Create event page (✓ implemented)
│   │   └── [id]/       # Event detail/edit
│   │       └── page.tsx    # Edit event page (✓ implemented)
│   ├── settings/    # Settings page
│   │   └── page.tsx        # Theme switcher (✓ implemented)
│   ├── layout.tsx   # Root layout with Header (✓ implemented)
│   ├── page.tsx     # Homepage (✓ implemented)
│   └── globals.css  # Global styles + CSS variables (✓ implemented)
│
├── components/      # React components
│   ├── ui/         # shadcn/ui base components
│   │   └── ToastContainer.tsx  # Toast notifications (✓ implemented)
│   ├── calendar/   # Calendar-specific components (📅 Phase 3)
│   ├── events/     # Event-related components
│   │   ├── EventDetailModal.tsx  # Event detail modal with edit/delete (✓ implemented)
│   │   └── EventForm.tsx         # Reusable create/edit form (✓ implemented)
│   ├── filters/    # Filter components (📅 Phase 3)
│   ├── theme/      # Theme components
│   │   └── ThemeSwitcher.tsx  # Full theme switcher (✓ implemented)
│   └── layout/     # Layout components
│       └── Header.tsx  # Navigation header (✓ implemented)
│
├── contexts/       # React contexts
│   └── ToastContext.tsx  # Toast notification system (✓ implemented)
│
├── lib/            # Utility functions
│   ├── db.ts              # Prisma client singleton
│   ├── date-utils.ts      # Date helpers (15+ functions)
│   ├── event-utils.ts     # Event helpers (6 functions - removed parseTags/stringifyTags)
│   ├── theme-manager.ts   # Theme system (8+ functions)
│   ├── validations.ts     # Zod schemas with centralized enums (✓ createZodEnum helper)
│   ├── api-errors.ts      # Centralized error handling (✓ implemented)
│   └── utils.ts           # General utilities (cn function)
│
├── types/          # TypeScript type definitions
│   ├── event.ts   # Event, EventOccurrence, EventCategory types
│   ├── theme.ts   # Theme, UserPreference types
│   ├── lunar.ts   # LunarEvent, LunarPhaseInfo types
│   ├── api.ts     # API request/response types
│   └── index.ts   # Central exports
│
└── config/         # Configuration files
    ├── categories.ts  # 8 event categories with colors/icons
    └── constants.ts   # App constants, enums, settings
```

## Key Design Decisions

### 1. Manual Entry First, API Later

**Decision:** Build manual event creation before integrating Panchang API

**Rationale:**

- Get functional UI faster
- Understand data needs better through usage
- API integration is complex (rate limits, caching, parsing)
- Can work offline during development
- API can be added as enhancement later

**Implementation Path:**

- Phase 2: Manual CRUD operations (✅ Complete)
- Phase 5: API integration with caching
- Maintains backward compatibility

### 2. JSON-Based Themes

**Decision:** Store themes as JSON files, not in database

**Rationale:**

- Easy to edit and experiment without database changes
- Version controllable with Git
- Fast loading (static files)
- No database queries for theme data
- Easy to share/import themes
- Can be edited by non-developers

**Theme Structure:**

```typescript
{
  id: string,
  name: string,
  colors: { primary, secondary, ... },
  typography: { fontFamily, fontSize },
  spacing: { scale, baseUnit },
  borders: { radius, width },
  effects: { shadows, animations }
}
```

### 3. PostgreSQL with Native Arrays & Enums

**Decision:** Use PostgreSQL from the start with native array and enum support

**Rationale:**

- **Native Array Support:**
  - PostgreSQL has `String[]` and `Int[]` types
  - No JSON parsing overhead (was: `tags: String?` → now: `tags: String[]`)
  - Type-safe at database level
  - Better query performance
  - Cleaner code (no parseTags/stringifyTags workarounds - removed in Session 8)
- **Native Enum Support:**
  - PostgreSQL has native enum types
  - Type safety at database level (database rejects invalid values)
  - Self-documenting schema (enums show valid values)
  - Better than string validation in application layer
  - IDE autocomplete integration via Prisma
- **Production-Grade Features:**
  - ACID compliance
  - Better concurrent access
  - Robust backup and recovery
  - Advanced indexing options
- **Modern Best Practice:**
  - Arrays are the correct SQL datatype for lists
  - Enums are the correct SQL datatype for fixed sets
  - Prisma has excellent PostgreSQL support
  - Future-proof for VPS deployment

**Enum Usage:**

```prisma
// Database schema (Prisma)
enum EventType {
  FESTIVAL
  PUJA
  SPECIAL_DAY
  EKADASHI
  SANKRANTI
  VRATAM
  OTHER
}

model Event {
  type EventType  // Type-safe enum
}
```

**Array Usage:**

```typescript
// Database schema (Prisma)
tags String[] @default([])
visibleTypes String[] @default([])
visibleCategories Int[] @default([])

// TypeScript types
tags: string[]  // Direct array, no parsing needed

// Direct usage in code
event.tags.map(tag => ...)  // No JSON.parse() needed
```

**Centralized Zod Enums (Session 15):**

```typescript
// Generic helper in validations.ts
function createZodEnum<T extends Record<string, string>>(prismaEnum: T) {
  const values = Object.values(prismaEnum) as [string, ...string[]]
  return z.enum(values)
}

// Usage - single source of truth from Prisma schema
export const zodEventType = createZodEnum(EventType)
export const zodRecurrenceType = createZodEnum(RecurrenceType)
export const zodLunarType = createZodEnum(LunarType)
export const zodPaksha = createZodEnum(Paksha)
export const zodCalendarView = createZodEnum(CalendarView)

// In validation schemas - automatic sync with database
const eventSchema = z.object({
  type: zodEventType, // Instead of: z.enum(['FESTIVAL', 'PUJA', ...])
  // ...
})
```

**Dynamic TypeScript Types:**

```typescript
// Single source of truth in constants.ts
export const EVENT_TYPES = [
  { value: 'FESTIVAL', label: 'Festival', icon: '🎉' },
  // ...
] as const

export const EVENT_SOURCES = [
  { value: 'MANUAL', label: 'Manual Entry' },
  { value: 'PANCHANG_API', label: 'Panchang API' },
  { value: 'IMPORTED', label: 'Imported' },
] as const

// Auto-generated TypeScript type (syncs automatically)
export type EventType = (typeof EVENT_TYPES)[number]['value']
export type EventSource = (typeof EVENT_SOURCES)[number]['value']

// Benefit: Add new event type/source → Update only constant!
// TypeScript type and database enum both update automatically
```

### 4. Rust-Free Prisma 6.16

**Decision:** Use Prisma with new JavaScript-based generator

**Rationale:**

- 90% smaller bundle size (critical for deployment)
- No binary compilation issues
- Better TypeScript performance
- Faster install times
- Future-proof for different runtimes (Edge, Cloudflare Workers)
- Simpler deployment process

**Trade-offs:**

- Slightly newer (less battle-tested)
- Performance difference negligible for our scale
- Benefits far outweigh risks

### 5. Event & EventOccurrence Separation

**Decision:** Two-table design for events

**Rationale:**

- **Event Table:**
  - Master definition
  - Recurrence rules
  - Metadata (importance, tags)
- **EventOccurrence Table:**
  - Specific date instances
  - Tithi, Nakshatra data
  - No year column (Session 15 - derived from date)

**Benefits:**

- One event can have multiple occurrences (recurring)
- Efficient date-range queries on occurrences
- Can regenerate occurrences for new years
- Store occurrence-specific data (lunar info)
- Easy to delete old occurrences
- Year always accurate (calculated from date field)

**Example:**

```
Event: "Ganesh Chaturthi" (permanent)
  ├── Occurrence: 2025-08-27
  ├── Occurrence: 2026-09-16
  └── Occurrence: 2027-09-05
```

### 6. CSS Variables for Theming (Tailwind v4 Convention)

**Decision:** Use CSS custom properties with data-attribute selectors

**Rationale:**

- **Tailwind v4 Best Practice:** Official convention for multi-theme support
- **Pure CSS:** No JavaScript manipulation of CSS properties (prevents conflicts)
- **Independent Dark Mode:** `.dark` class scoped per theme
- Runtime theme switching without rebuild
- Better performance (CSS cascade only)
- Easier to debug (inspect in DevTools)
- **DRY CSS:** No redundant theme blocks (Session 15)

**Implementation:**

```css
/* Base theme variables in @theme directive */
@theme {
  --color-primary: oklch(0.55 0.15 30);
}

/* Theme variants via data-attribute */
[data-theme='spiritual-minimal'] {
  --color-primary: oklch(0.55 0.15 30);
}

[data-theme='spiritual-minimal'].dark {
  --color-primary: oklch(0.65 0.15 30);
}

[data-theme='cosmic-purple'] {
  --color-primary: oklch(0.7 0.18 260);
}

[data-theme='cosmic-purple'].dark {
  --color-primary: oklch(0.7 0.18 260);
}
```

**JavaScript Only Sets Attributes:**

```javascript
// JavaScript sets data-attribute, CSS does the rest
document.documentElement.setAttribute('data-theme', 'cosmic-purple')
document.documentElement.classList.toggle('dark', true)
```

### 7. OKLCH Color Space

**Decision:** Use OKLCH instead of RGB/HSL

**Rationale:**

- Perceptually uniform colors
- Better for programmatic manipulation
- More vibrant colors possible
- Better dark mode conversion
- Modern CSS standard

### 8. Complete CRUD Workflow (Session 13-16)

**Decision:** Full event lifecycle management with excellent UX

**Implementation:**

- **Create:** New event page with comprehensive form
- **Read:** Calendar display + detail modal
- **Update:** Edit event page with same form component
- **Delete:** Confirmation dialog with safety prompts
- **Refresh:** Calendar auto-updates after any CRUD operation
- **Notifications:** Toast system for success/error feedback
- **Error Handling:** User-friendly messages via api-errors.ts
- **Request Management:** AbortController prevents stale requests

**UX Enhancements:**

- Modal focus trap for accessibility (focus-trap-react)
- Edit/Delete buttons directly in event modal
- Delete confirmation with event name verification
- Calendar always visible (no empty states hiding UI)
- "New Event" button prominently placed on calendar
- Lunar dropdowns with grouped Tithis and Nakshatras
- Font consistency across all form elements

## API Design

### RESTful Endpoints

```
Events:
GET    /api/events              # List events with filters (✅ Session 1)
POST   /api/events              # Create new event (✅ Session 13)
GET    /api/events/[id]         # Get single event (✅ Session 13)
PUT    /api/events/[id]         # Update event (✅ Session 13)
DELETE /api/events/[id]         # Delete event (✅ Session 13)

Categories:
GET    /api/categories          # Get all categories (✅ Session 13)

Lunar:
GET    /api/lunar               # Get lunar events (📅 Phase 3)

Themes:
GET    /api/themes              # Get available themes (✅ Session 3)

Preferences:
GET    /api/preferences         # Get user preferences (📅 Phase 4)
POST   /api/preferences         # Update preferences (📅 Phase 4)
```

### Response Format

**Success:**

```typescript
{
  "success": true,
  "data": { ... }
}
```

**Error (Session 14):**

```typescript
{
  "success": false,
  "error": "VALIDATION_ERROR",  // Machine-readable type
  "message": "Validation failed...",  // Developer message
  "userMessage": "The information you provided...",  // User-friendly
  "details": [...]  // Structured details (optional)
}
```

### Query Parameters

**GET /api/events:**

```typescript
{
  startDate?: string,    // ISO date
  endDate?: string,      // ISO date
  types?: string[],      // Event types
  categoryIds?: number[] // Category IDs
  // year removed (Session 15 - derived from date)
}
```

### Request Body Validation

All requests validated with centralized Zod schemas (Session 15):

- Type safety at runtime
- Clear error messages
- Auto-generated TypeScript types
- Consistent validation logic
- Single source of truth (Prisma enums)

## Database Schema Philosophy

### Normalization vs Denormalization

**Normalized Tables:**

- EventCategory (lookup table - 8 categories)
  - Ganesha ⚙️, Durga ⚔️, Shiva 🔱, Devi 🌺
  - Krishna 🦚, Rama 🏹, Hanuman 🐒, General 🕉️
- Event (master data - single language: English)
- EventOccurrence (instances with lunar data, no year column)

**Native Array Fields (PostgreSQL):**

- tags (String[] in Event) - Native PostgreSQL array
- visibleTypes (String[] in UserPreference) - Native PostgreSQL array
- visibleCategories (Int[] in UserPreference) - Native PostgreSQL array

**Native Enum Fields (PostgreSQL):**

- type (EventType in Event) - 7 values
- recurrenceType (RecurrenceType in Event) - 4 values
- source (EventSource in Event) - 3 values
- type (LunarType in LunarEvent) - 3 values
- paksha (Paksha in EventOccurrence) - 2 values
- defaultView (CalendarView in UserPreference) - 4 values

**Language Strategy:**

- Single language (English) for simplicity
- Event names remain English/Sanskrit (proper nouns)
- Descriptions translated to Dutch (Session 15)
- Can add i18n later if required

**Rationale:**

- Normalize what changes together
- Use native arrays for list data (better than JSON)
- Use native enums for fixed value sets (type safety)
- PostgreSQL arrays and enums provide type safety and performance
- Foreign keys for relationships

### Seed Data Improvements (Session 15)

- **Transaction wrapper** for atomic operations
- **Database cleanup** before seeding (idempotent)
- **UTC dates** to prevent timezone issues
- **Prisma enums** instead of hardcoded strings
- **Dutch translations** for all event descriptions
- **Accurate 2025 dates** verified against lunar calendar

### Indexing Strategy

**Current Indexes:**

- Primary keys (auto)
- Foreign keys (auto)
- date in EventOccurrence (frequent queries)
- date in LunarEvent (frequent queries)

**Future Indexes (if needed):**

- Composite indexes for common query patterns
- Full-text search indexes
- Partial indexes for active records

### Data Types

**Dates:**

- DateTime for precise timestamps
- date field stores full DateTime (allows time)
- startTime/endTime as strings (HH:mm)
- No separate year column (derived from date)

**Numeric:**

- Int for IDs, counts
- Float for coordinates, moon phase (0-1)

**Text:**

- String for most text fields
- Max length validation in Zod, not database

## Performance Considerations

### Current Optimizations

- Index on date columns for fast queries
- Native PostgreSQL arrays (no JSON parsing overhead)
- Prisma query optimization (select only needed fields)
- Client-side caching of themes
- CSS variables (no style recalculation)
- Request deduplication (AbortController - Session 14)

### Future Optimizations (if needed)

- API response caching (Redis/memory)
- Database query caching
- Lazy loading of components (React.lazy)
- Image optimization (next/image)
- Bundle size analysis (webpack-bundle-analyzer)
- Code splitting per route
- Service worker for offline support

### Performance Targets

- Page load: < 2 seconds
- Calendar render: < 500ms
- API response: < 200ms
- Theme switch: < 100ms

## Security Considerations

### Current Measures

- Zod validation on all inputs (prevent injection)
- SQL injection prevention (Prisma ORM parameterized queries)
- XSS prevention (React automatic escaping)
- CORS policies (Next.js defaults)
- Environment variables for secrets
- TypeScript for type safety
- Centralized error handling (api-errors.ts - Session 14)

### Future Enhancements (if needed)

- Rate limiting for API routes
- Input sanitization library
- CSP (Content Security Policy) headers
- CSRF protection (if multi-user)
- Authentication system (if multi-user)
- Audit logging for changes

### Data Privacy

- Single user scenario (no privacy concerns)
- All data stored locally/VPS
- No third-party analytics
- No tracking cookies

## Scalability Path

### Phase 0-2: Monolith (Current)

Single application, single user, local/VPS deployment

```
Next.js App (Frontend + Backend)
    ↓
PostgreSQL 18 (Database)
```

**Capacity:**

- 1 user (primary)
- 5-10 family users (future)
- 1000s of events
- Fast enough for personal use

### Phase 5+: Potential Splits (If Needed)

**Scenario 1: Frontend Split**

```
Frontend (Vercel/Netlify)
    ↓ REST API
Backend API (VPS/Cloud)
    ↓
Database (Managed PostgreSQL)
```

**Scenario 2: Microservices**

```
Frontend
    ↓
API Gateway
    ├─► Events Service
    ├─► Lunar Service
    ├─► Themes Service
    └─► Auth Service
```

**When to split:**

- Multiple concurrent users (>10)
- Performance degradation
- Team growth requiring separation
- Complex business logic requiring isolation
- Different scaling needs per service

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Setup database
npm run db:push
npm run db:seed

# Start dev server
npm run dev

# Open Prisma Studio
npm run db:studio
```

### Development Tools

- **Prisma Studio:** Visual database editor (localhost:5555)
- **Next.js Dev:** Hot reload, error overlay
- **TypeScript:** Real-time type checking
- **ESLint:** Code quality checks

### Database Operations

```bash
# After schema changes
npm run db:generate  # Update Prisma client
npm run db:push      # Update database

# Reset database (PostgreSQL)
psql -U postgres -c "DROP DATABASE dharma_calendar;"
psql -U postgres -c "CREATE DATABASE dharma_calendar;"
npm run db:push
npm run db:seed
```

### Deployment Process

```bash
# Production build
npm run build

# Test production build locally
npm start

# Deploy to VPS
# (Docker/manual deployment in Phase 6)
```

## Testing Strategy

### Current Approach (Manual)

- Browser testing (Firefox 143)
- Manual QA of features
- Visual testing
- Database verification (Prisma Studio)

### Future Testing (If Needed)

- **Unit Tests:** Utility functions (Jest/Vitest)
- **Integration Tests:** API routes (Supertest)
- **Component Tests:** UI components (React Testing Library)
- **E2E Tests:** Critical user flows (Playwright)

### Test Coverage Goals

- Utilities: 80%+
- API routes: 70%+
- Components: 50%+
- E2E: Critical paths only

## Error Handling

### Current Strategy (Session 14)

- Try-catch in all API routes
- Centralized error handling (api-errors.ts)
- Zod validation with formatted errors
- Prisma error code mapping
- User-friendly vs developer messages
- Structured error responses

### API Error Types

```typescript
enum ApiErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DATABASE_ERROR = 'DATABASE_ERROR',
  PRISMA_ERROR = 'PRISMA_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
}
```

### Future Improvements

- Error boundaries in React
- Custom error classes
- Sentry/LogRocket integration (optional)

## Accessibility

### Current Implementation (Session 11)

- **Modal Focus Trap:** Using focus-trap-react v11
  - Tab/Shift+Tab containment within modals
  - Focus return to trigger element
  - ESC key closes modal
  - Backdrop click closes modal
- **Keyboard Navigation:** Full keyboard support
- **WCAG 2.1 Compliance:** Accessible modals

### Future Enhancements

- Screen reader testing
- ARIA labels throughout
- Color contrast verification
- Keyboard shortcuts

## Future Considerations

### Multi-User Support

If needed:

- Add authentication (NextAuth.js)
- Add user table and relations
- Row-level security
- User-specific preferences
- Shared events feature

### Mobile App

If desired:

- React Native app
- Share API with web
- Offline-first architecture
- Push notifications

### API Extensions

- GraphQL option (Apollo)
- WebSocket for real-time (Socket.io)
- Webhook support
- Public API for integrations

---

## Architecture Evolution

### v0.1 (Current - October 2025)

- Monolithic Next.js app
- PostgreSQL database with native arrays and enums
- Theme system complete (3 themes)
- Calendar view with event display
- Event detail modal with edit/delete
- **Complete CRUD workflow** ✅
- Single user
- **Phase 0:** Foundation (100%)
  - PostgreSQL 18 with native arrays
  - 6 native enums for type safety
  - Dynamic TypeScript type generation
  - Centralized Zod enums (createZodEnum helper)
- **Phase 1:** View & Navigate (100%)
  - Calendar page with react-big-calendar
  - Theme system with 3 themes
  - Event detail modal with accessibility
  - Category colors on calendar
  - Weekend styling
- **Phase 2:** Create & Manage (100%) ✅
  - Complete CRUD API (POST/PUT/DELETE)
  - EventForm component (create/edit modes)
  - New event page + Edit event page
  - Delete confirmation dialog
  - Edit/Delete buttons in modal
  - Calendar auto-refresh after CRUD
  - Toast notifications system
  - Request deduplication (AbortController)
  - Centralized error handling (api-errors.ts)
  - Lunar field dropdowns (Tithi groups, Nakshatras, Maas)
  - Font consistency improvements
  - Dutch event translations
  - Accurate 2025 lunar calendar dates
  - Calendar always visible (better UX)
  - Importance bar removed (cleaner UI)

### v0.2 (Phase 3 - Starting)

- Filter and search functionality
- Lunar event markers
- Enhanced UI/UX refinements
- Responsive design polish
- Still monolithic

### v0.3 (Phase 4-5)

- Database persistence for preferences
- Performance optimizations
- Advanced features (API integration, imports)
- Enhanced error handling

### v1.0 (Phase 6)

- Production deployment
- PostgreSQL optimization (indexes, backups)
- Docker containerization
- Complete feature set
- VPS hosted with monitoring

### v2.0 (Future)

- Multi-user support (if needed)
- Mobile app (if desired)
- Microservices (if required)
- Advanced integrations

---

**Last Updated:** October 4, 2025  
**Architecture Status:** v0.1 - Phase 2 Complete (100% ✅)  
**Current Phase:** Phase 3 - Filter & Search (Starting)  
**Next Milestone:** v0.2 - Filters, search, lunar event markers
