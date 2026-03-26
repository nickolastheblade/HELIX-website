# HELIX-website Frontend - PRD

## Original Problem Statement
Migration of HELIX-website frontend from Riff-specific infrastructure to work on Emergent platform as a standard React/Vite application.

## Architecture
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 4
- **Package Manager**: Yarn 1.x (standard Emergent)
- **Styling**: Tailwind CSS + Chakra UI + Radix UI
- **Routing**: React Router 6 (client-side SPA)
- **Auth**: Stack Auth (optional - works without config)
- **3D**: React Three Fiber + Drei

## What Was Implemented (2025-03-26)

### Phase 1: Initial Migration (Vite env vars)
- Replaced all `declare const __VAR__` Riff globals with `import.meta.env.VITE_*`
- Removed `DATABUTTON_*` env parsing from vite.config.ts
- Created `.env.example` with documentation

### Phase 2: Emergent Standard Setup
- Converted from Yarn 4 to Yarn 1.x
- Added `start` script for supervisor
- Configured vite for port 3000 with `allowedHosts: true`
- Fixed cmdk dependency conflict (postinstall script)
- Made Stack Auth optional (graceful fallback when not configured)

### Files Modified:
1. **vite.config.ts** - Emergent-compatible config
2. **package.json** - Yarn 1.x, proper scripts, postinstall fix
3. **src/AppWrapper.tsx** - Optional Stack Auth wrapper
4. **src/app/auth/stack.ts** - Lazy initialization
5. **src/constants.ts** - Environment variables

## How to Run
```bash
cd frontend
yarn install
yarn start  # Dev server on port 3000
```

## Testing Results (100% passed)
- Homepage loads correctly with Helix logo
- 3D particle background renders
- Navigation menu works
- All sections render correctly
- Contact form displays
- Language switcher works (EN/RU)

## Next Tasks / Backlog
- P1: Configure Stack Auth if authentication needed
- P2: Optimize expertise cards re-rendering
- P2: Code splitting for production build
