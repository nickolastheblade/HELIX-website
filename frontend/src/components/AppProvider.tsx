import type { ReactNode } from "react";
import { Toaster } from "sonner";

interface Props {
  children: ReactNode;
}

/**
 * A provider wrapping the whole app.
 *
 * You can add multiple providers here by nesting them,
 * and they will all be applied to the app.
 */
export const AppProvider = ({ children }: Props) => {
  return (
    <>
      {children}
      <Toaster 
        position="top-right" 
        theme="dark"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
          },
        }}
      />
    </>
  );
};
