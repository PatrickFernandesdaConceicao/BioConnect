// middleware.ts (na raiz do projeto)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// =============================================================================
// CONFIGURAÇÕES DO MIDDLEWARE
// =============================================================================

// Rotas públicas que não precisam de autenticação
const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/recover-password",
  "/terms-of-service",
  "/privacy-policy",
  "/about",
  "/contact",
];

// Rotas que só podem ser acessadas por usuários NÃO autenticados
const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/recover-password"];

// Rotas protegidas que precisam de autenticação
const PROTECTED_ROUTES = [
  "/dashboard",
  "/projetos",
  "/monitorias",
  "/eventos",
  "/profile",
  "/settings",
];

// Rotas que precisam de permissões específicas
const ROLE_BASED_ROUTES = {
  "/admin": ["ADMINISTRADOR"],
  "/coordenacao": ["USER", "ADMINISTRADOR"],
  "/professores": ["USER", "ADMINISTRADOR"],
  "/projetos/criar": ["USER", "ADMINISTRADOR"],
  "/monitorias/criar": ["USER", "ADMINISTRADOR"],
  "/eventos/criar": ["USER", "ADMINISTRADOR"],
  "/relatorios": ["USER", "ADMINISTRADOR"],
  "/usuarios": ["ADMINISTRADOR"],
} as const;

type UserRole = "USER" | "ADMINISTRADOR";

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

/**
 * Verifica se a rota é pública
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    if (route === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(route);
  });
}

/**
 * Verifica se a rota é de autenticação
 */
function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Verifica se a rota é protegida
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Verifica se a rota precisa de permissões específicas
 */
function requiresSpecificRole(pathname: string): string[] | null {
  for (const [route, roles] of Object.entries(ROLE_BASED_ROUTES)) {
    if (pathname.startsWith(route)) {
      return Array.from(roles);
    }
  }
  return null;
}

/**
 * Verifica se o token JWT é válido
 */
function isValidToken(token: string): boolean {
  try {
    // Decodifica o JWT para verificar se não está expirado
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // Verifica se o token não expirou
    return payload.exp && payload.exp > currentTime;
  } catch {
    return false;
  }
}

/**
 * Extrai informações do usuário do token
 */
function getUserFromToken(token: string): { role: UserRole } | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      role: payload.role || "USER",
    };
  } catch {
    return null;
  }
}

/**
 * Verifica se o usuário tem permissão para acessar a rota
 */
function hasPermission(userRole: UserRole, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * Obtém o token de autenticação dos cookies
 */
function getAuthToken(request: NextRequest): string | null {
  // Tenta obter o token do cookie
  const tokenFromCookie = request.cookies.get("bioconnect_token")?.value;

  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  // Fallback: tenta obter do header Authorization
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
}

/**
 * Cria resposta de redirecionamento preservando a URL de destino
 */
function createRedirectResponse(
  request: NextRequest,
  destination: string
): NextResponse {
  const redirectUrl = new URL(destination, request.url);

  // Se estiver tentando acessar uma rota protegida, salva a URL para redirecionamento após login
  if (
    isProtectedRoute(request.nextUrl.pathname) &&
    destination.includes("/auth/login")
  ) {
    redirectUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  }

  return NextResponse.redirect(redirectUrl);
}

// =============================================================================
// MIDDLEWARE PRINCIPAL
// =============================================================================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignora arquivos estáticos e APIs internas do Next.js
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Obtém o token de autenticação
  const token = getAuthToken(request);
  const isAuthenticated = token ? isValidToken(token) : false;

  // Se o token existe mas é inválido, limpa os cookies
  if (token && !isAuthenticated) {
    const response = NextResponse.next();
    response.cookies.delete("bioconnect_token");
    response.cookies.delete("bioconnect_user");
    return response;
  }

  // =============================================================================
  // LÓGICA DE ROTEAMENTO
  // =============================================================================

  // 1. ROTAS PÚBLICAS - sempre acessíveis
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // 2. ROTAS DE AUTENTICAÇÃO - só para usuários não logados
  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      // Usuário já está logado, redireciona para dashboard
      const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
      const redirectTo =
        callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";
      return createRedirectResponse(request, redirectTo);
    }
    return NextResponse.next();
  }

  // 3. ROTAS PROTEGIDAS - precisa estar logado
  if (isProtectedRoute(pathname) || requiresSpecificRole(pathname)) {
    if (!isAuthenticated) {
      // Usuário não está logado, redireciona para login
      return createRedirectResponse(request, "/auth/login");
    }

    // Usuário está logado, verifica permissões específicas
    const requiredRoles = requiresSpecificRole(pathname);
    if (requiredRoles) {
      const userInfo = getUserFromToken(token!);

      if (!userInfo || !hasPermission(userInfo.role, requiredRoles)) {
        // Usuário não tem permissão, redireciona para página de acesso negado
        return createRedirectResponse(
          request,
          "/dashboard?error=access_denied"
        );
      }
    }

    return NextResponse.next();
  }

  // 4. ROTA RAIZ - redireciona baseado no status de autenticação
  if (pathname === "/") {
    if (isAuthenticated) {
      return createRedirectResponse(request, "/dashboard");
    }
    // Usuário não autenticado continua na homepage
    return NextResponse.next();
  }

  // 5. ROTAS NÃO DEFINIDAS - comportamento padrão
  // Se chegou até aqui, permite o acesso (pode ser uma rota dinâmica)
  return NextResponse.next();
}

// =============================================================================
// CONFIGURAÇÃO DO MIDDLEWARE
// =============================================================================

export const config = {
  /*
   * Configura em quais rotas o middleware deve ser executado
   * - Exclui arquivos estáticos (_next/static)
   * - Exclui imagens e outros assets
   * - Exclui rotas de API internas do Next.js
   */
  matcher: [
    /*
     * Aplica o middleware em todas as rotas exceto:
     * - API routes (/api/*)
     * - Static files (_next/static/*)
     * - Image optimization (_next/image/*)
     * - Favicon e outros arquivos estáticos
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
