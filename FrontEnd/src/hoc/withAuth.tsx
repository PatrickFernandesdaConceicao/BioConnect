import { ComponentType } from "react";
import { ProtectedPage } from "@/components/ProtectedPage";
import type { User } from "@/lib/auth";

interface WithAuthOptions {
  requiredRoles?: User["tipo"][];
  fallback?: React.ReactNode;
}

export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options?: WithAuthOptions
) {
  const AuthenticatedComponent = (props: P) => {
    return (
      <ProtectedPage
        requiredRoles={options?.requiredRoles}
        fallbackComponent={options?.fallback}
      >
        <Component {...props} />
      </ProtectedPage>
    );
  };

  AuthenticatedComponent.displayName = `withAuth(${
    Component.displayName || Component.name
  })`;

  return AuthenticatedComponent;
}
