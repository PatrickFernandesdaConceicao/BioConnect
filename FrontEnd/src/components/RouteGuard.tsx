"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, hasPermission, getUser } from "@/lib/auth";
import type { User } from "@/lib/auth";
import { AccessDeniedPage } from "./AccessDeniedPage";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRoles?: User["tipo"][];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function RouteGuard({
  children,
  requiredRoles,
  fallback,
  redirectTo,
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = () => {
      // Verifica se está autenticado
      if (!isAuthenticated()) {
        const loginUrl = `/auth/login?callbackUrl=${encodeURIComponent(
          pathname
        )}`;
        router.push(loginUrl);
        return;
      }

      // Se tem roles específicas, verifica permissões
      if (requiredRoles && requiredRoles.length > 0) {
        const user = getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }

        const hasRequiredPermission = requiredRoles.some((role) =>
          hasPermission(role)
        );

        if (!hasRequiredPermission) {
          if (redirectTo) {
            router.push(redirectTo);
          } else {
            setHasAccess(false);
            setIsLoading(false);
          }
          return;
        }
      }

      setHasAccess(true);
      setIsLoading(false);
    };

    checkAccess();
  }, [pathname, requiredRoles, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">
            Verificando permissões...
          </p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return fallback || <AccessDeniedPage />;
  }

  return <>{children}</>;
}
