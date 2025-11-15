-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('FESTIVAL', 'PUJA', 'SPECIAL_DAY', 'EKADASHI', 'SANKRANTI', 'VRATAM', 'OTHER');

-- CreateEnum
CREATE TYPE "RecurrenceType" AS ENUM ('LUNAR', 'SOLAR', 'FIXED', 'ANNUAL');

-- CreateEnum
CREATE TYPE "EventSource" AS ENUM ('MANUAL', 'PANCHANG_API', 'IMPORTED');

-- CreateEnum
CREATE TYPE "LunarType" AS ENUM ('PURNIMA', 'AMAVASYA', 'EKADASHI');

-- CreateEnum
CREATE TYPE "Paksha" AS ENUM ('Shukla', 'Krishna');

-- CreateEnum
CREATE TYPE "MoonPhaseType" AS ENUM ('NEW_MOON', 'FIRST_QUARTER', 'FULL_MOON', 'LAST_QUARTER');

-- CreateEnum
CREATE TYPE "CalendarView" AS ENUM ('month', 'week', 'day', 'agenda');

-- CreateTable
CREATE TABLE "EventCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "EventType" NOT NULL,
    "categoryId" INTEGER,
    "isRecurring" BOOLEAN NOT NULL DEFAULT true,
    "recurrenceType" "RecurrenceType" NOT NULL DEFAULT 'LUNAR',
    "source" "EventSource" NOT NULL DEFAULT 'MANUAL',
    "apiId" TEXT,
    "importance" INTEGER NOT NULL DEFAULT 5,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventOccurrence" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "tithi" TEXT,
    "nakshatra" TEXT,
    "paksha" "Paksha",
    "maas" TEXT,
    "moonPhase" DOUBLE PRECISION,
    "sunrise" TEXT,
    "sunset" TEXT,
    "locationLat" DOUBLE PRECISION,
    "locationLon" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventOccurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LunarEvent" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "type" "LunarType" NOT NULL,
    "tithi" TEXT,
    "nakshatra" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LunarEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" SERIAL NOT NULL,
    "currentTheme" TEXT NOT NULL DEFAULT 'spiritual-minimal',
    "defaultView" "CalendarView" NOT NULL DEFAULT 'month',
    "weekStartsOn" INTEGER NOT NULL DEFAULT 0,
    "visibleTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "visibleCategories" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "activeLocationId" INTEGER,
    "tempLocationName" TEXT,
    "tempLocationLat" DOUBLE PRECISION,
    "tempLocationLon" DOUBLE PRECISION,
    "locationName" TEXT,
    "locationLat" DOUBLE PRECISION,
    "locationLon" DOUBLE PRECISION,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Amsterdam',
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "notificationDaysBefore" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiCache" (
    "id" SERIAL NOT NULL,
    "endpoint" TEXT NOT NULL,
    "params" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedLocation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyAstronomy" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "locationId" INTEGER NOT NULL,
    "percentageVisible" INTEGER NOT NULL,
    "phase" "MoonPhaseType",
    "isWaxing" BOOLEAN NOT NULL,
    "sunrise" TEXT,
    "sunset" TEXT,
    "moonrise" TEXT,
    "moonset" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyAstronomy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventCategory_name_key" ON "EventCategory"("name");

-- CreateIndex
CREATE INDEX "EventOccurrence_date_idx" ON "EventOccurrence"("date");

-- CreateIndex
CREATE INDEX "EventOccurrence_eventId_date_idx" ON "EventOccurrence"("eventId", "date");

-- CreateIndex
CREATE INDEX "LunarEvent_date_idx" ON "LunarEvent"("date");

-- CreateIndex
CREATE INDEX "LunarEvent_type_date_idx" ON "LunarEvent"("type", "date");

-- CreateIndex
CREATE INDEX "ApiCache_expiresAt_idx" ON "ApiCache"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "ApiCache_endpoint_params_key" ON "ApiCache"("endpoint", "params");

-- CreateIndex
CREATE INDEX "SavedLocation_isPrimary_idx" ON "SavedLocation"("isPrimary");

-- CreateIndex
CREATE INDEX "DailyAstronomy_date_idx" ON "DailyAstronomy"("date");

-- CreateIndex
CREATE INDEX "DailyAstronomy_locationId_date_idx" ON "DailyAstronomy"("locationId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyAstronomy_date_locationId_key" ON "DailyAstronomy"("date", "locationId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EventCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOccurrence" ADD CONSTRAINT "EventOccurrence_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyAstronomy" ADD CONSTRAINT "DailyAstronomy_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "SavedLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
