"use client";

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

export function saveAuthData(
  token: string,
  userData: User,
  rememberMe: boolean = false
): void {
  if (typeof window === "undefined") return;

  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem("bioconnect_token", token);
  storage.setItem("bioconnect_user", JSON.stringify(userData));

  const oppositeStorage = rememberMe ? sessionStorage : localStorage;
  oppositeStorage.removeItem("bioconnect_token");
  oppositeStorage.removeItem("bioconnect_user");
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  const token = getToken();
  const user = getUser();

  return !!(token && user && !isTokenExpired());
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("bioconnect_token") ||
    sessionStorage.getItem("bioconnect_token")
  );
}

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

  localStorage.removeItem("bioconnect_token");
  localStorage.removeItem("bioconnect_user");

  sessionStorage.removeItem("bioconnect_token");
  sessionStorage.removeItem("bioconnect_user");

  window.location.href = "/login";
}

export function isTokenExpired(): boolean {
  const token = getToken();
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp < currentTime;
  } catch {
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

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => getAuthState());

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthState(getAuthState());
    };

    window.addEventListener("storage", handleStorageChange);

    const checkTokenInterval = setInterval(() => {
      if (isTokenExpired() && authState.isAuthenticated) {
        logout();
      }
    }, 60000);

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

export function requireAuth(redirectTo: string = "/auth/login") {
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

export function mapRoleToTipo(role: string): User["tipo"] {
  const roleMap: Record<string, User["tipo"]> = {
    USER: "USER",
    ADMIN: "ADMIN",
    ADMINISTRADOR: "ADMIN",
  };

  return roleMap[role] || "USER";
}
