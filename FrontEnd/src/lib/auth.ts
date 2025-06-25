import { useState, useEffect } from "react";

// ===================================================================
// INTERFACES E TIPOS
// ===================================================================

export interface User {
  id: string;
  nome: string;
  email: string;
  login: string;
  tipo: "USER" | "ADMIN";
  ativo: boolean;
  dataCriacao?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface LoginData {
  login: string;
  senha: string;
}

export interface RegisterData {
  login: string;
  senha: string;
  nome: string;
  email: string;
  role: string;
}

export interface RegisterResponse {
  id?: string;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
}

// ===================================================================
// FUNÇÕES DE AUTENTICAÇÃO
// ===================================================================

export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return (
      localStorage.getItem("bioconnect_token") ||
      sessionStorage.getItem("bioconnect_token")
    );
  } catch (error) {
    console.error("Erro ao obter token:", error);
    return null;
  }
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;

  try {
    const userStr =
      localStorage.getItem("bioconnect_user") ||
      sessionStorage.getItem("bioconnect_user");

    if (!userStr) return null;

    const user = JSON.parse(userStr);
    return user as User;
  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    return null;
  }
}

export function isAuthenticated(): boolean {
  const token = getToken();
  const user = getUser();

  if (!token || !user) return false;

  // Verificar se o token não expirou
  return !isTokenExpired();
}

export function getAuthState(): AuthState {
  const token = getToken();
  const user = getUser();

  return {
    isAuthenticated: !!(token && user && !isTokenExpired()),
    user,
    token,
  };
}

export function logout(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem("bioconnect_token");
    localStorage.removeItem("bioconnect_user");
    sessionStorage.removeItem("bioconnect_token");
    sessionStorage.removeItem("bioconnect_user");

    // Limpar cookie
    document.cookie =
      "bioconnect_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirecionar para login
    window.location.href = "/login";
  } catch (error) {
    console.error("Erro no logout:", error);
    window.location.href = "/login";
  }
}

export function isTokenExpired(): boolean {
  const token = getToken();
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // Adicionar margem de 5 minutos para evitar problemas de timing
    return payload.exp < currentTime + 300;
  } catch (error) {
    console.error("Erro ao verificar expiração do token:", error);
    return true;
  }
}

export function hasPermission(requiredRole: User["tipo"]): boolean {
  const user = getUser();
  if (!user) return false;

  const roleHierarchy = {
    USER: 0,
    ADMIN: 1,
  };

  const userLevel = roleHierarchy[user.tipo];
  const requiredLevel = roleHierarchy[requiredRole];

  return userLevel >= requiredLevel;
}

// ===================================================================
// FUNÇÃO DE REGISTRO
// ===================================================================

export async function registerUser(
  userData: RegisterData
): Promise<RegisterResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  try {
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw {
        message:
          responseData.message ||
          `Erro ${response.status}: ${response.statusText}`,
        errors: responseData.errors || {},
        status: response.status,
      };
    }

    return responseData;
  } catch (error) {
    console.error("Erro no registro:", error);
    throw error;
  }
}

// ===================================================================
// FETCH AUTENTICADO
// ===================================================================

export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();

  // Verificar se o token não expirou
  if (token && isTokenExpired()) {
    console.warn("Token expirado, fazendo logout...");
    logout();
    throw new Error("Token expirado. Faça login novamente.");
  }

  const authHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    console.log("Fazendo requisição para:", url);
    console.log("Headers:", authHeaders);

    const response = await fetch(url, {
      ...options,
      headers: authHeaders,
    });

    console.log("Status da resposta:", response.status);

    // Se não autorizado, fazer logout
    if (response.status === 401) {
      console.warn("Não autorizado (401), fazendo logout...");
      logout();
      throw new Error("Não autorizado. Faça login novamente.");
    }

    return response;
  } catch (error) {
    console.error("Erro na requisição:", error);

    // Verificar se é erro de rede
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Erro de conexão com o servidor. Verifique se o backend está rodando."
      );
    }

    throw error;
  }
}

// ===================================================================
// HOOK useAuth
// ===================================================================

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => getAuthState());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificação inicial
    const checkAuth = () => {
      try {
        const newAuthState = getAuthState();
        setAuthState(newAuthState);
      } catch (error) {
        console.error("Erro na verificação de autenticação:", error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Escutar mudanças no localStorage/sessionStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith("bioconnect_")) {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Verificar token periodicamente
    const checkTokenInterval = setInterval(() => {
      if (isTokenExpired() && authState.isAuthenticated) {
        logout();
      }
    }, 60000); // Verificar a cada minuto

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(checkTokenInterval);
    };
  }, [authState.isAuthenticated]);

  return {
    ...authState,
    isLoading,
    logout,
    hasPermission,
    refreshAuth: () => setAuthState(getAuthState()),
  };
}

// ===================================================================
// INTERCEPTADORES DO AXIOS (OPCIONAL)
// ===================================================================

export function setupAxiosInterceptors(axiosInstance: any) {
  axiosInstance.interceptors.request.use(
    (config: any) => {
      const token = getToken();
      if (token && !isTokenExpired()) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );
}

// ===================================================================
// UTILITÁRIOS DE AUTORIZAÇÃO
// ===================================================================

export function requireAuth(redirectTo: string = "/login") {
  if (typeof window !== "undefined" && !isAuthenticated()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

export function requirePermission(
  requiredRole: User["tipo"],
  redirectTo: string = "/dashboard"
) {
  if (!requireAuth()) return false;

  if (!hasPermission(requiredRole)) {
    if (typeof window !== "undefined") {
      window.location.href = redirectTo;
    }
    return false;
  }

  return true;
}

// ===================================================================
// VALIDAÇÃO DE SENHA
// ===================================================================

export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Deve ter pelo menos 8 caracteres");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Deve conter ao menos uma letra maiúscula");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Deve conter ao menos uma letra minúscula");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Deve conter ao menos um número");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Deve conter ao menos um caractere especial");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ===================================================================
// UTILITÁRIOS ADICIONAIS
// ===================================================================

export function getTokenPayload(): any | null {
  const token = getToken();
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
}

export function getTokenExpiration(): Date | null {
  const payload = getTokenPayload();
  if (!payload?.exp) return null;

  return new Date(payload.exp * 1000);
}

export function isUserActive(): boolean {
  const user = getUser();
  return user?.ativo ?? false;
}

// ===================================================================
// EXPORT DEFAULT OBJECT
// ===================================================================

const auth = {
  getToken,
  getUser,
  isAuthenticated,
  getAuthState,
  logout,
  isTokenExpired,
  hasPermission,
  registerUser,
  authFetch,
  useAuth,
  requireAuth,
  requirePermission,
  validatePasswordStrength,
  getTokenPayload,
  getTokenExpiration,
  isUserActive,
};

export default auth;
