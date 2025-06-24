import { NextRequest, NextResponse } from "next/server";

// ===================================================================
// MIDDLEWARE ANTI-LOOP DEFINITIVO
// ===================================================================

// Variável para rastrear redirects recentes (previne loops)
const recentRedirects = new Map<string, number>();
const REDIRECT_COOLDOWN = 2000; // 2 segundos

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") || "";

  // === IGNORES ABSOLUTOS ===
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/.well-known/") ||
    pathname.includes(".") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/icons/") ||
    pathname.startsWith("/manifest") ||
    pathname.startsWith("/sw.js") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap") ||
    userAgent.includes("Chrome-Lighthouse") ||
    userAgent.includes("DevTools")
  ) {
    return NextResponse.next();
  }

  // === PREVENIR LOOPS COM COOLDOWN ===
  const clientId = request.ip || "unknown";
  const redirectKey = `${clientId}-${pathname}`;
  const now = Date.now();

  // Verificar se houve redirect muito recente
  if (recentRedirects.has(redirectKey)) {
    const lastRedirect = recentRedirects.get(redirectKey)!;
    if (now - lastRedirect < REDIRECT_COOLDOWN) {
      console.log(
        `[Middleware] 🚫 LOOP PROTECTION: ${pathname} - Bloqueando redirect recente`
      );
      return NextResponse.next();
    }
  }

  // === DETECTION DE LOOP ESPECÍFICO LOGIN/DASHBOARD ===
  const referer = request.headers.get("referer");
  if (pathname === "/login" && referer?.includes("/dashboard")) {
    console.log(`[Middleware] 🚫 DASHBOARD->LOGIN LOOP DETECTADO - BLOQUEANDO`);
    // Forçar volta para dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname === "/dashboard" && referer?.includes("/login")) {
    const consecutiveKey = `consecutive-${clientId}`;
    const consecutiveCount = recentRedirects.get(consecutiveKey) || 0;

    if (consecutiveCount > 2) {
      console.log(
        `[Middleware] 🚫 LOGIN->DASHBOARD LOOP DETECTADO - PARANDO CICLO`
      );
      recentRedirects.delete(consecutiveKey);
      const response = NextResponse.next();
      response.headers.set("x-loop-broken", "true");
      return response;
    }

    recentRedirects.set(consecutiveKey, consecutiveCount + 1);
    setTimeout(() => recentRedirects.delete(consecutiveKey), REDIRECT_COOLDOWN);
  }

  console.log(
    `[Middleware] ⚡ PROCESSANDO: ${pathname} (ref: ${
      referer ? new URL(referer).pathname : "none"
    })`
  );

  // === TOKEN E VALIDAÇÃO ===
  const token = getSimpleToken(request);
  const isValidAuth = token ? validateSimpleToken(token) : false;

  console.log(
    `[Middleware] 🔑 Token: ${
      token ? "EXISTS" : "NONE"
    }, Válido: ${isValidAuth}`
  );

  // === LÓGICA SIMPLIFICADA SEM LOOPS ===

  // CASO ESPECIAL: Se está vindo de loop, sempre permitir
  const isLoopBreaker = request.headers.get("x-loop-breaker");
  if (isLoopBreaker) {
    console.log(`[Middleware] 🔄 LOOP BREAKER ATIVO - PERMITINDO: ${pathname}`);
    return NextResponse.next();
  }

  // CASO 1: Página raiz
  if (pathname === "/") {
    if (isValidAuth) {
      console.log(`[Middleware] 🏠 Raiz autenticada -> Dashboard`);
      return createSafeRedirect(request, "/dashboard", "root-to-dashboard");
    }
    console.log(`[Middleware] 🏠 Raiz não autenticada -> Continuar`);
    return NextResponse.next();
  }

  // CASO 2: Login - LÓGICA ESPECIAL ANTI-LOOP
  if (pathname === "/login") {
    if (isValidAuth) {
      // Verificar se não é um loop
      const loopCount = recentRedirects.get(`login-dashboard-${clientId}`) || 0;
      if (loopCount > 1) {
        console.log(`[Middleware] 🚫 INTERROMPENDO LOOP LOGIN->DASHBOARD`);
        recentRedirects.delete(`login-dashboard-${clientId}`);

        // Permitir acesso ao login para quebrar o loop
        const response = NextResponse.next();
        response.headers.set("x-loop-broken", "true");
        return response;
      }

      console.log(
        `[Middleware] 🔐 Login autenticado -> Dashboard (${loopCount + 1})`
      );
      recentRedirects.set(`login-dashboard-${clientId}`, loopCount + 1);

      // Usar setTimeout para limpar depois
      setTimeout(() => {
        recentRedirects.delete(`login-dashboard-${clientId}`);
      }, REDIRECT_COOLDOWN);

      return createSafeRedirect(request, "/dashboard", "login-to-dashboard");
    }
    console.log(`[Middleware] 🔐 Login não autenticado -> Continuar`);
    return NextResponse.next();
  }

  // CASO 3: Dashboard - LÓGICA ESPECIAL ANTI-LOOP
  if (pathname === "/dashboard") {
    if (!isValidAuth) {
      console.log(`[Middleware] 📊 Dashboard não autenticado -> Login`);
      return createSafeRedirect(request, "/login", "dashboard-to-login");
    }

    console.log(`[Middleware] 📊 Dashboard autenticado -> Continuar`);

    // Limpar qualquer contador de loop
    recentRedirects.delete(`login-dashboard-${clientId}`);

    const response = NextResponse.next();
    response.headers.set("x-middleware-processed", "true");
    response.headers.set("x-dashboard-access", "granted");
    return response;
  }

  // CASO 4: Rotas protegidas
  if (isProtectedPage(pathname)) {
    if (!isValidAuth) {
      console.log(
        `[Middleware] 🛡️ Protegida não autenticada -> Login com callback`
      );
      return createSafeRedirect(
        request,
        `/login?callbackUrl=${encodeURIComponent(pathname)}`,
        "protected-to-login"
      );
    }

    // Admin check
    if (isAdminPage(pathname)) {
      const userRole = getUserRole(token!);
      if (userRole !== "ADMIN") {
        console.log(`[Middleware] 👤 Sem permissão admin -> Dashboard`);
        return createSafeRedirect(request, "/dashboard", "admin-to-dashboard");
      }
    }

    console.log(`[Middleware] 🛡️ Protegida autenticada -> Continuar`);
    const response = NextResponse.next();
    response.headers.set("x-middleware-processed", "true");
    return response;
  }

  // CASO 5: Qualquer outra rota
  console.log(`[Middleware] ❓ Rota desconhecida -> Continuar`);
  return NextResponse.next();
}

// ===================================================================
// FUNÇÕES AUXILIARES
// ===================================================================

function getSimpleToken(request: NextRequest): string | null {
  return (
    request.cookies.get("bioconnect_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "") ||
    null
  );
}

function validateSimpleToken(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp > now;
  } catch {
    return false;
  }
}

function getUserRole(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const login = payload.sub || payload.login || payload.username;

    if (login?.toLowerCase() === "master") return "ADMIN";

    const role = payload.role || payload.tipo || payload.authority;
    if (
      role &&
      ["ADMIN", "ADMINISTRATOR", "ADMINISTRADOR"].includes(
        role.toString().toUpperCase()
      )
    ) {
      return "ADMIN";
    }

    return "USER";
  } catch {
    return "USER";
  }
}

function isProtectedPage(pathname: string): boolean {
  return (
    pathname.startsWith("/projetos") ||
    pathname.startsWith("/eventos") ||
    pathname.startsWith("/monitorias") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/usuarios") ||
    pathname.startsWith("/admin")
  );
}

function isAdminPage(pathname: string): boolean {
  return pathname.startsWith("/usuarios") || pathname.startsWith("/admin");
}

function createSafeRedirect(
  request: NextRequest,
  destination: string,
  reason: string
): NextResponse {
  const clientId = request.ip || "unknown";
  const redirectKey = `${clientId}-${destination}`;

  // Registrar o redirect
  recentRedirects.set(redirectKey, Date.now());

  // Limpar depois do cooldown
  setTimeout(() => {
    recentRedirects.delete(redirectKey);
  }, REDIRECT_COOLDOWN);

  const url = new URL(destination, request.url);
  const response = NextResponse.redirect(url);

  // Headers anti-loop
  response.headers.set("x-middleware-redirect", "true");
  response.headers.set("x-redirect-reason", reason);
  response.headers.set("x-redirect-timestamp", Date.now().toString());
  response.headers.set(
    "Cache-Control",
    "no-cache, no-store, must-revalidate, private"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  console.log(
    `[Middleware] 🔄 SAFE REDIRECT [${reason}]: ${request.nextUrl.pathname} -> ${destination}`
  );
  return response;
}

// ===================================================================
// CONFIGURAÇÃO RESTRITIVA + CLEANUP
// ===================================================================

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/login",
    "/register",
    "/projetos",
    "/eventos",
    "/monitorias",
    "/usuarios",
    "/profile",
    "/settings",
    "/admin",
  ],
};

// Cleanup periódico para evitar memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of recentRedirects.entries()) {
    if (now - timestamp > REDIRECT_COOLDOWN * 2) {
      recentRedirects.delete(key);
    }
  }
}, REDIRECT_COOLDOWN);
