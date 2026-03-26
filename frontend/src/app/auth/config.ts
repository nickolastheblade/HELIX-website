import { z } from "zod";

const configSchema = z.object({
  projectId: z.string().default(""),
  jwksUrl: z.string().default(""),
  publishableClientKey: z.string().default(""),
  handlerUrl: z.string().default("auth"),
});

type StackAuthExtensionConfig = z.infer<typeof configSchema>;

// Build config from individual environment variables
const buildConfig = (): StackAuthExtensionConfig => {
  return {
    projectId: import.meta.env.VITE_STACK_AUTH_PROJECT_ID || "",
    jwksUrl: import.meta.env.VITE_STACK_AUTH_JWKS_URL || "",
    publishableClientKey: import.meta.env.VITE_STACK_AUTH_PUBLISHABLE_KEY || "",
    handlerUrl: import.meta.env.VITE_STACK_AUTH_HANDLER_URL || "auth",
  };
};

export const config: StackAuthExtensionConfig = configSchema.parse(buildConfig());
