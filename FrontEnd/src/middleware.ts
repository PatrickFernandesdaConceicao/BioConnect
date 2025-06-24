import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/recover-password",
  "/terms-of-service",
  "/privacy-policy",
  "/about",
  "/contact",
];

const AUTH_ROUTES = ["/login", "/register", "/recover-password"];

const PROTECTED_ROUTES = [
  "/dashboard",
  "/projetos",
  "/monitorias",
  "/eventos",
  "/relatorios",
  "/profile",
  "/settings",
  "/usuarios",
  "/configuracoes",
];

const ROLE_BASED_ROUTES = {
  "/usuarios": ["ADMIN"],
  "/configuracoes": ["ADMIN"],
  "/relatorios": ["USER", "ADMIN"],
} as const;

type UserRole = "USER" | "ADMIN";

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    if (route === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(route);
  });
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

function requiresSpecificRole(pathname: string): string[] | null {
  for (const [route, roles] of Object.entries(ROLE_BASED_ROUTES)) {
    if (pathname.startsWith(route)) {
      return Array.from(roles);
    }
  }
  return null;
}

function isValidToken(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp > currentTime;
  } catch (error) {
    return false;
  }
}

function getUserFromToken(
  token: string
): { role: UserRole; tipo: UserRole; login?: string } | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    const login = payload.sub || payload.login || payload.username;

    let role: UserRole = "USER";

    if (login && login.toLowerCase() === "master") {
      role = "ADMIN";
    } else {
      const roleFromToken = payload.role || payload.tipo || payload.authority;
      if (roleFromToken) {
        const normalizedRole = roleFromToken.toString().toUpperCase();
        if (
          ["ADMIN", "ADMINISTRATOR", "ADMINISTRADOR", "ROOT"].includes(
            normalizedRole
          )
        ) {
          role = "ADMIN";
        }
      }

      if (payload.authorities && Array.isArray(payload.authorities)) {
        const hasAdminAuth = payload.authorities.some(
          (auth: string) =>
            auth.toUpperCase().includes("ADMIN") ||
            auth.toUpperCase().includes("ROLE_ADMIN")
        );
        if (hasAdminAuth) {
          role = "ADMIN";
        }
      }
    }

    return {
      role: role,
      tipo: role,
      login: login,
    };
  } catch {
    return null;
  }
}

function hasPermission(userRole: UserRole, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

function getAuthToken(request: NextRequest): string | null {
  const tokenFromCookie = request.cookies.get("bioconnect_token")?.value;

  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  const customHeader = request.headers.get("x-auth-token");
  if (customHeader) {
    return customHeader;
  }

  return null;
}

function createRedirectResponse(
  request: NextRequest,
  destination: string,
  preserveCallback: boolean = false
): NextResponse {
  const redirectUrl = new URL(destination, request.url);

  if (
    preserveCallback &&
    isProtectedRoute(request.nextUrl.pathname) &&
    destination.includes("/login") &&
    request.nextUrl.pathname !== "/dashboard"
  ) {
    redirectUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  }

  return NextResponse.redirect(redirectUrl);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const token = getAuthToken(request);
  const isAuthenticated = token ? isValidToken(token) : false;

  if (token && !isAuthenticated) {
    const response = NextResponse.next();
    response.cookies.delete("bioconnect_token");
    response.cookies.delete("bioconnect_user");

    if (isProtectedRoute(pathname)) {
      return createRedirectResponse(request, "/login", false);
    }

    return response;
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");

      if (
        callbackUrl &&
        callbackUrl.startsWith("/") &&
        callbackUrl !== "/login"
      ) {
        return createRedirectResponse(request, callbackUrl, false);
      }

      return createRedirectResponse(request, "/dashboard", false);
    }
    return NextResponse.next();
  }

  if (isProtectedRoute(pathname) || requiresSpecificRole(pathname)) {
    if (!isAuthenticated) {
      if (pathname === "/dashboard") {
        return createRedirectResponse(request, "/login", false);
      }

      const shouldPreserveCallback =
        pathname.startsWith("/projetos/") ||
        pathname.startsWith("/eventos/") ||
        pathname.startsWith("/monitorias/");

      return createRedirectResponse(request, "/login", shouldPreserveCallback);
    }

    const requiredRoles = requiresSpecificRole(pathname);
    if (requiredRoles) {
      const userInfo = getUserFromToken(token!);

      if (!userInfo || !hasPermission(userInfo.role, requiredRoles)) {
        return createRedirectResponse(
          request,
          "/dashboard?error=access_denied",
          false
        );
      }
    }

    return NextResponse.next();
  }

  if (pathname === "/") {
    return createRedirectResponse(request, "/login", false);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)"],
};
