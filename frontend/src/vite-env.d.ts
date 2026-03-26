/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ID: string;
  readonly VITE_API_PATH: string;
  readonly VITE_API_URL: string;
  readonly VITE_API_HOST: string;
  readonly VITE_API_PREFIX_PATH: string;
  readonly VITE_WS_API_URL: string;
  readonly VITE_APP_BASE_PATH: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_FAVICON_LIGHT: string;
  readonly VITE_APP_FAVICON_DARK: string;
  readonly VITE_APP_DEPLOY_USERNAME: string;
  readonly VITE_APP_DEPLOY_APPNAME: string;
  readonly VITE_APP_DEPLOY_CUSTOM_DOMAIN: string;
  readonly VITE_STACK_AUTH_PROJECT_ID: string;
  readonly VITE_STACK_AUTH_PUBLISHABLE_KEY: string;
  readonly VITE_STACK_AUTH_JWKS_URL: string;
  readonly VITE_STACK_AUTH_HANDLER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
