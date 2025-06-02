"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

/**
 * Hook para gerenciar redirecionamentos após login/logout
 */
export function useAuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectAfterLogin = () => {
    const callbackUrl = searchParams.get("callbackUrl");
    const destination =
      callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";
    router.push(destination);
  };

  const redirectToLogin = (currentPath?: string) => {
    const loginUrl = currentPath
      ? `/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`
      : "/auth/login";
    router.push(loginUrl);
  };

  const redirectToDashboard = () => {
    router.push("/dashboard");
  };

  return {
    redirectAfterLogin,
    redirectToLogin,
    redirectToDashboard,
  };
}
