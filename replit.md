# Auto List Bahrain

## Overview

A high-end automotive marketplace for the Kingdom of Bahrain. Buyers browse luxury, sports, family, and electric vehicles; sellers list their cars in Bahraini Dinar (BHD).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Frontend**: React + Vite + Tailwind + shadcn/ui + framer-motion + wouter

## Artifacts

- `artifacts/auto-list-bahrain` — main marketplace web app (`/`)
- `artifacts/api-server` — Express API at `/api`

## Domain Model

- `cars` — listings with make, model, trim, year, priceBhd, mileageKm, fuel, transmission, bodyType, color, condition (new|used), location, seller info, description, images[], featured.
- `inquiries` — buyer messages tied to a car.

## Pages

- `/` — Home (hero + featured + market stats + browse-by-make/body-type + recent)
- `/listings` — Filterable browse with sort & pagination
- `/listings/:id` — Detail with gallery, specs, similar cars, inquiry form
- `/sell` — List your car form

## Key Commands

- `pnpm run typecheck` — full typecheck
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client/zod
- `pnpm --filter @workspace/db run push` — push DB schema
- `pnpm --filter @workspace/scripts run seed-cars` — re-seed sample listings
