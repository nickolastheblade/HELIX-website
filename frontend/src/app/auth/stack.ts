import { APP_BASE_PATH } from "@/constants";
import { StackClientApp } from "@stackframe/react";
import { useNavigate } from "react-router-dom";
import { config } from "./config";
import { joinPaths } from "./utils";

// Only initialize if config is valid
const isConfigured = config.projectId && config.projectId.length > 0;

// Create a dummy app for when not configured
const createStackApp = () => {
  if (!isConfigured) {
    return null;
  }
  
  return new StackClientApp({
    projectId: config.projectId,
    publishableClientKey: config.publishableClientKey,
    tokenStore: "cookie",
    redirectMethod: {
      useNavigate,
    },
    urls: {
      handler: joinPaths(APP_BASE_PATH, config.handlerUrl),
      home: joinPaths(APP_BASE_PATH, "/"),
      afterSignIn: joinPaths(APP_BASE_PATH, config.handlerUrl, "redirect"),
      afterSignUp: joinPaths(APP_BASE_PATH, config.handlerUrl, "redirect"),
    },
  });
};

export const stackClientApp = createStackApp();
