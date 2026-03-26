export enum Mode {
  DEV = "development",
  PROD = "production",
}

export const mode = import.meta.env.MODE as Mode;

// Application configuration from environment variables
export const APP_ID = import.meta.env.VITE_APP_ID || "helix-gp";

export const API_PATH = import.meta.env.VITE_API_PATH || "/api";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_HOST = import.meta.env.VITE_API_HOST || "";

export const API_PREFIX_PATH = import.meta.env.VITE_API_PREFIX_PATH || "";

export const WS_API_URL = import.meta.env.VITE_WS_API_URL || "ws://localhost:8000";

export const APP_BASE_PATH = import.meta.env.VITE_APP_BASE_PATH || "/";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "Helix.GP";

export const APP_FAVICON_LIGHT = import.meta.env.VITE_APP_FAVICON_LIGHT || "/favicon-light.svg";

export const APP_FAVICON_DARK = import.meta.env.VITE_APP_FAVICON_DARK || "/favicon-dark.svg";

export const APP_DEPLOY_USERNAME = import.meta.env.VITE_APP_DEPLOY_USERNAME || "";

export const APP_DEPLOY_APPNAME = import.meta.env.VITE_APP_DEPLOY_APPNAME || "";

export const APP_DEPLOY_CUSTOM_DOMAIN = import.meta.env.VITE_APP_DEPLOY_CUSTOM_DOMAIN || "";
