# Helix.GP Frontend

A standalone Vite + React SPA for Helix.GP, ready for deployment on any static hosting platform (Timeweb, Vercel, Netlify, etc.).

## Tech Stack

- **React 18** with TypeScript
- **Vite 4** for blazing-fast builds
- **Yarn 4** (Berry) for package management
- **Tailwind CSS** for styling
- **Chakra UI** + **Radix UI** for components
- **React Router 6** for client-side routing
- **Stack Auth** for authentication

## Quick Start

### Prerequisites

- Node.js 18+ 
- Corepack enabled (`corepack enable`)

### Installation

```bash
cd frontend
yarn install
```

### Development

```bash
yarn dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
yarn build
```

This outputs a static SPA to `frontend/dist/` ready for deployment.

### Preview Production Build

```bash
yarn preview
```

## Environment Variables

All environment variables are prefixed with `VITE_` and are exposed to the client-side code.

Copy `.env.example` to `.env` and configure the values:

```bash
cp .env.example .env
```

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.helix-gp.example.com` |
| `VITE_WS_API_URL` | WebSocket API URL | `wss://api.helix-gp.example.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_ID` | Application identifier | `helix-gp` |
| `VITE_API_PATH` | API route prefix | `/api` |
| `VITE_API_HOST` | API host for CORS | *(empty)* |
| `VITE_API_PREFIX_PATH` | Additional API prefix | *(empty)* |
| `VITE_APP_BASE_PATH` | SPA base path | `/` |
| `VITE_APP_TITLE` | Browser tab title | `Helix.GP` |
| `VITE_APP_FAVICON_LIGHT` | Light mode favicon | `/favicon-light.svg` |
| `VITE_APP_FAVICON_DARK` | Dark mode favicon | `/favicon-dark.svg` |
| `VITE_APP_DEPLOY_USERNAME` | Deploy username (display) | *(empty)* |
| `VITE_APP_DEPLOY_APPNAME` | Deploy app name (display) | *(empty)* |
| `VITE_APP_DEPLOY_CUSTOM_DOMAIN` | Custom domain | *(empty)* |

### Authentication Variables (Stack Auth)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_STACK_AUTH_PROJECT_ID` | Stack Auth project ID | `your-project-id` |
| `VITE_STACK_AUTH_PUBLISHABLE_KEY` | Publishable client key | `pk_...` |
| `VITE_STACK_AUTH_JWKS_URL` | JWKS URL for token verification | `https://api.stack-auth.com/...` |
| `VITE_STACK_AUTH_HANDLER_URL` | Auth handler path | `auth` |

## Deployment

### Static Hosting (Timeweb, Vercel, Netlify, etc.)

1. **Build the app:**
   ```bash
   cd frontend
   yarn install
   yarn build
   ```

2. **Deploy the `dist/` folder** to your static hosting provider.

3. **Configure environment variables** in your hosting provider's dashboard.

4. **Configure SPA routing** - ensure all routes redirect to `index.html` for client-side routing.

### Timeweb App Platform

1. Connect your repository
2. Set build command: `cd frontend && yarn install && yarn build`
3. Set publish directory: `frontend/dist`
4. Add environment variables in the dashboard
5. Deploy

### SPA Routing Configuration

Since this is a Single Page Application, you need to configure your hosting to redirect all requests to `index.html`. 

For **nginx**:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

For **Timeweb/Vercel/Netlify**: SPA routing is usually auto-detected or can be enabled in settings.

## Project Structure

```
frontend/
├── dist/                 # Production build output
├── public/               # Static assets
├── src/
│   ├── app/              # App-level exports and auth
│   ├── apiclient/        # API client (generated)
│   ├── components/       # React components
│   ├── constants/        # App constants
│   ├── extensions/       # UI extensions (shadcn)
│   ├── internal-components/  # Internal UI components
│   ├── lib/              # Utilities
│   ├── pages/            # Page components
│   ├── prod-components/  # Production error boundaries
│   ├── utils/            # Helper utilities
│   ├── constants.ts      # Environment configuration
│   ├── main.tsx          # App entry point
│   ├── router.tsx        # Route definitions
│   └── vite-env.d.ts     # TypeScript env declarations
├── .env.example          # Environment template
├── .yarnrc.yml           # Yarn 4 configuration
├── index.html            # HTML entry point
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server |
| `yarn build` | Build for production |
| `yarn preview` | Preview production build |
| `yarn lint` | Run ESLint |

## License

Proprietary - Helix.GP © 2025
