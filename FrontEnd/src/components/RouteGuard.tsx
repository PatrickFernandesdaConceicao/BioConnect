"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  isAuthenticated,
  hasPermission,
  getUser,
  isTokenExpired,
} from "@/lib/auth";
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
      try {
        if (!isAuthenticated() || isTokenExpired()) {
          console.log("[RouteGuard] User not authenticated or token expired");

          if (pathname === "/dashboard") {
            router.push("/login");
            return;
          }

          const shouldPreserveCallback =
            pathname.startsWith("/projetos/") ||
            pathname.startsWith("/eventos/") ||
            pathname.startsWith("/monitorias/");

          const loginUrl = shouldPreserveCallback
            ? `/login?callbackUrl=${encodeURIComponent(pathname)}`
            : "/login";

          router.push(loginUrl);
          return;
        }

        if (requiredRoles && requiredRoles.length > 0) {
          const user = getUser();
          if (!user) {
            console.log("[RouteGuard] No user data found");
            router.push("/login");
            return;
          }

          const hasRequiredPermission = requiredRoles.some((role) =>
            hasPermission(role)
          );

          if (!hasRequiredPermission) {
            console.log("[RouteGuard] User lacks required permissions", {
              userRole: user.tipo,
              requiredRoles,
            });

            if (redirectTo) {
              router.push(redirectTo);
            } else {
              setHasAccess(false);
              setIsLoading(false);
            }
            return;
          }
        }

        console.log("[RouteGuard] Access granted");
        setHasAccess(true);
        setIsLoading(false);
      } catch (error) {
        console.error("[RouteGuard] Error checking access:", error);
        router.push("/login");
      }
    };

    const timer = setTimeout(checkAccess, 100);

    return () => clearTimeout(timer);
  }, [pathname, requiredRoles, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">
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
