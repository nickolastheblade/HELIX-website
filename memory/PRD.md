# HELIX-website Frontend Migration PRD

## Original Problem Statement
Migrate the HELIX-website frontend from Riff-specific infrastructure to a standalone Vite + Yarn 4 SPA deployable on Timeweb App Platform as a static site.

## Architecture
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 4
- **Package Manager**: Yarn 4 (Berry) with node-modules linker
- **Styling**: Tailwind CSS + Chakra UI + Radix UI
- **Routing**: React Router 6 (client-side SPA)
- **Auth**: Stack Auth (@stackframe/react)

## What Was Implemented (2025-03-26)

### Files Modified:
1. **vite.config.ts** - Removed Riff-specific `define` mechanism and `DATABUTTON_*` env parsing
2. **src/constants.ts** - Replaced `declare const __VAR__` globals with `import.meta.env.VITE_*`
3. **src/app/auth/config.ts** - Individual env vars instead of JSON-parsed `__STACK_AUTH_CONFIG__`
4. **src/internal-components/ThemeProvider.tsx** - Import APP_ID from constants instead of global
5. **src/vite-env.d.ts** - TypeScript declarations for all VITE_* env variables
6. **index.html** - Changed title from "Riff" to "Helix.GP"
7. **package.json** - Removed invalid `nodeLinker` field

### Files Created:
1. **.env.example** - Complete env variable documentation with examples
2. **.yarnrc.yml** - Yarn 4 configuration (nodeLinker: node-modules)
3. **README.md** - Full deployment documentation

## Environment Variables

### Required:
- `VITE_API_URL` - Backend API URL
- `VITE_WS_API_URL` - WebSocket API URL

### Optional (with defaults):
- `VITE_APP_ID` (default: "helix-gp")
- `VITE_API_PATH` (default: "/api")
- `VITE_APP_BASE_PATH` (default: "/")
- `VITE_APP_TITLE` (default: "Helix.GP")
- `VITE_STACK_AUTH_*` - Stack Auth configuration

## Build Commands
```bash
cd frontend && yarn install && yarn build
```

## Output
Static SPA in `frontend/dist/` - deployable to any static hosting.

## Next Tasks / Backlog
- P0: Configure actual production API URL on Timeweb
- P1: Set up Stack Auth credentials for authentication
- P2: Add favicon files to public folder
- P2: Consider code-splitting to reduce main chunk size (currently ~2.5MB)
