import { APP_BASE_PATH } from "@/constants";
import { StackHandler, StackTheme } from "@stackframe/react";
import * as React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { stackClientApp } from "./stack";
import { joinPaths } from "./utils";

export const StackHandlerRoutes = () => {
  const location = useLocation();

  // If Stack Auth is not configured, redirect to home
  if (!stackClientApp) {
    return <Navigate to="/" replace />;
  }

  return (
    <StackTheme>
      <StackHandler
        app={stackClientApp}
        location={joinPaths(APP_BASE_PATH, location.pathname)}
        fullPage={true}
      />
    </StackTheme>
  );
};
