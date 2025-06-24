import { NextRequest, NextResponse } from "next/server";

type UserRole = "USER" | "ADMIN";

// ===================================================================
// ROTAS DE CONFIGURAÇÃO
// ===================================================================

// Rotas públicas que não precisam de autenticação
const publicRoutes = [
  "/",
  "/login",
  "/auth/login",
  "/auth/register",
  "/auth/recover-password",
  "/register",
  "/recover-password",
];

// Rotas de autenticação que redirecionam se já logado
const authRoutes = [
  "/login",
  "/auth/login",
  "/auth/register",
  "/register",
  "/auth/recover-password",
  "/recover-password",
];

// Rotas protegidas que requerem autenticação
const protectedRoutes = [
  "/dashboard",
  "/projetos",
  "/eventos",
  "/monitorias",
  "/usuarios",
  "/profile",
  "/settings",
];

// Rotas que requerem permissão de admin
const adminRoutes = ["/usuarios", "/admin"];

// ===================================================================
// FUNÇÕES AUXILIARES
// ===================================================================

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function isAuthRoute(pathname: string): boolean {
  return authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some((route) => pathname.startsWith(route));
}

function isValidToken(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // Verificar se o token não expirou (com margem de 5 minutos)
    return payload.exp && payload.exp > currentTime + 300;
  } catch (error) {
    console.error("Token inválido:", error);
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

    // Verificar se é master user
    if (login && login.toLowerCase() === "master") {
      role = "ADMIN";
    } else {
      // Verificar role do token
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

      // Verificar authorities array
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
  } catch (error) {
    console.error("Erro ao extrair usuário do token:", error);
    return null;
  }
}

function hasPermission(userRole: UserRole, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

function getAuthToken(request: NextRequest): string | null {
  // Tentar cookie primeiro
  const tokenFromCookie = request.cookies.get("bioconnect_token")?.value;
  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  // Tentar header Authorization
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Tentar header customizado
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

  // Preservar callback URL para rotas protegidas
  if (
    preserveCallback &&
    isProtectedRoute(request.nextUrl.pathname) &&
    destination.includes("/login") &&
    request.nextUrl.pathname !== "/dashboard" &&
    request.nextUrl.pathname !== "/"
  ) {
    redirectUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  }

  const response = NextResponse.redirect(redirectUrl);

  // Adicionar headers de segurança
  response.headers.set("X-Middleware-Cache", "no-cache");

  return response;
}

// ===================================================================
// MIDDLEWARE PRINCIPAL
// ===================================================================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar arquivos estáticos e APIs internas
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/icons/")
  ) {
    return NextResponse.next();
  }

  console.log(`[Middleware] Processando rota: ${pathname}`);

  // Obter token de autenticação
  const token = getAuthToken(request);
  const isAuthenticated = token ? isValidToken(token) : false;

  console.log(
    `[Middleware] Token presente: ${!!token}, Válido: ${isAuthenticated}`
  );

  // === LÓGICA DE ROTEAMENTO ===

  // 1. Rotas públicas - permitir acesso livre
  if (isPublicRoute(pathname) && !isAuthRoute(pathname)) {
    console.log(`[Middleware] Rota pública permitida: ${pathname}`);
    return NextResponse.next();
  }

  // 2. Rotas de autenticação - redirecionar se já autenticado
  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      console.log(
        `[Middleware] Usuário já autenticado, redirecionando para dashboard`
      );
      return createRedirectResponse(request, "/dashboard");
    }
    console.log(`[Middleware] Rota de auth permitida: ${pathname}`);
    return NextResponse.next();
  }

  // 3. Rotas protegidas - verificar autenticação
  if (isProtectedRoute(pathname)) {
    if (!isAuthenticated) {
      console.log(`[Middleware] Não autenticado, redirecionando para login`);
      return createRedirectResponse(request, "/login", true);
    }

    // 4. Verificar permissões para rotas admin
    if (isAdminRoute(pathname)) {
      const userData = getUserFromToken(token!);

      if (!userData || !hasPermission(userData.role, ["ADMIN"])) {
        console.log(
          `[Middleware] Sem permissão admin, redirecionando para dashboard`
        );
        return createRedirectResponse(request, "/dashboard");
      }
    }

    console.log(`[Middleware] Rota protegida permitida: ${pathname}`);
    return NextResponse.next();
  }

  // 5. Rota raiz - redirecionar baseado na autenticação
  if (pathname === "/") {
    if (isAuthenticated) {
      console.log(
        `[Middleware] Usuário autenticado na raiz, redirecionando para dashboard`
      );
      return createRedirectResponse(request, "/dashboard");
    }
    console.log(
      `[Middleware] Usuário não autenticado na raiz, permitindo acesso`
    );
    return NextResponse.next();
  }

  // 6. Outras rotas - verificar se precisa de autenticação
  if (isAuthenticated) {
    console.log(
      `[Middleware] Usuário autenticado, permitindo acesso: ${pathname}`
    );
    return NextResponse.next();
  } else {
    console.log(
      `[Middleware] Rota não reconhecida, redirecionando para login: ${pathname}`
    );
    return createRedirectResponse(request, "/login", true);
  }
}

// ===================================================================
// CONFIGURAÇÃO DO MATCHER
// ===================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|static|images|icons).*)",
  ],
};
