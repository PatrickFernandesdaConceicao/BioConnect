import { useEffect, useState } from "react";

export interface User {
  id: string;
  nome: string;
  email: string;
  login: string;
  tipo: "USER" | "ADMIN";
  instituicao?: string;
  curso?: string;
  ativo: boolean;
}

export interface RegisterData {
  login: string;
  senha: string;
  nome: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface RegisterResponse {
  id?: string;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// Verificar se o usuário está autenticado
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  const token = getToken();
  const user = getUser();

  return !!(token && user);
}

// Obter token do armazenamento
export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("bioconnect_token") ||
    sessionStorage.getItem("bioconnect_token")
  );
}

// Obter dados do usuário
export function getUser(): User | null {
  if (typeof window === "undefined") return null;

  const userString =
    localStorage.getItem("bioconnect_user") ||
    sessionStorage.getItem("bioconnect_user");

  if (!userString) return null;

  try {
    return JSON.parse(userString);
  } catch {
    return null;
  }
}

// Obter estado completo da autenticação
export function getAuthState(): AuthState {
  const token = getToken();
  const user = getUser();

  return {
    isAuthenticated: !!(token && user),
    user,
    token,
  };
}

// Fazer logout
export function logout(): void {
  if (typeof window === "undefined") return;

  // Remover dados do localStorage
  localStorage.removeItem("bioconnect_token");
  localStorage.removeItem("bioconnect_user");

  // Remover dados do sessionStorage
  sessionStorage.removeItem("bioconnect_token");
  sessionStorage.removeItem("bioconnect_user");

  // Opcional: Redirecionar para login
  window.location.href = "/auth/login";
}

// Verificar se o token está expirado
export function isTokenExpired(): boolean {
  const token = getToken();
  if (!token) return true;

  try {
    // Decodificar JWT para verificar expiração
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp < currentTime;
  } catch {
    return true;
  }
}

// Verificar permissões do usuário
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

// Função para registrar usuário
export async function registerUser(
  userData: RegisterData
): Promise<RegisterResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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
}

// Interceptador para requisições autenticadas
export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();

  if (isTokenExpired()) {
    logout();
    throw new Error("Token expirado. Faça login novamente.");
  }

  const authHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers: authHeaders,
  });
}

// Hook personalizado para autenticação (se usando React)
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => getAuthState());

  useEffect(() => {
    // Verificar mudanças no armazenamento
    const handleStorageChange = () => {
      setAuthState(getAuthState());
    };

    window.addEventListener("storage", handleStorageChange);

    // Verificar token expirado periodicamente
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
    logout,
    hasPermission,
  };
}

// Configuração para axios (se estiver usando)
export function setupAxiosInterceptors(axiosInstance: any) {
  // Request interceptor para adicionar token
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

  // Response interceptor para lidar com erros de autenticação
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

// Utilitário para redirecionar usuários não autenticados
export function requireAuth(redirectTo: string = "/auth/login") {
  if (typeof window !== "undefined" && !isAuthenticated()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

// Utilitário para proteger rotas baseado em permissões
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

// Validar força da senha
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Deve ter pelo menos 8 caracteres");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Deve conter pelo menos uma letra minúscula");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Deve conter pelo menos uma letra maiúscula");
  }

  if (!/\d/.test(password)) {
    errors.push("Deve conter pelo menos um número");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validar formato do login
export function validateLoginFormat(login: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (login.length < 3) {
    errors.push("Login deve ter pelo menos 3 caracteres");
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(login)) {
    errors.push(
      "Login deve conter apenas letras, números, pontos, hífens e underscores"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Mapear role do backend para tipo do frontend
export function mapRoleToTipo(role: string): User["tipo"] {
  const roleMap: Record<string, User["tipo"]> = {
    USER: "USER",
    ADMIN: "ADMIN",
  };

  return roleMap[role] || "USER";
}
