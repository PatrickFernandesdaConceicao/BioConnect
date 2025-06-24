"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// FIX: Schema corrigido para resolver erro TypeScript
const loginSchema = z.object({
  login: z.string().min(1, {
    message: "Login é obrigatório",
  }),
  senha: z.string().min(1, {
    message: "A senha é obrigatória",
  }),
  rememberMe: z.boolean().default(false), // Removido opcional para corrigir TypeScript
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginResponse {
  token?: string;
  user?: {
    id: string;
    nome: string;
    email: string;
    login: string;
    tipo: string;
    role?: string;
    ativo?: boolean;
  };
  message?: string;
  error?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // FIX: Resolver corrigido com tipos compatíveis
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      senha: "",
      rememberMe: false, // Sempre false como padrão
    },
  });

  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        const token =
          localStorage.getItem("bioconnect_token") ||
          sessionStorage.getItem("bioconnect_token");
        const user =
          localStorage.getItem("bioconnect_user") ||
          sessionStorage.getItem("bioconnect_user");

        if (token && user) {
          // Verificar se o token não expirou
          if (!isTokenExpired(token)) {
            const callbackUrl = searchParams.get("callbackUrl");
            const redirectPath =
              callbackUrl && callbackUrl.startsWith("/")
                ? callbackUrl
                : "/dashboard";

            router.push(redirectPath);
            return;
          } else {
            // Token expirado, limpar
            clearAuthData();
          }
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        clearAuthData();
      }

      setIsCheckingAuth(false);
    };

    const timer = setTimeout(checkExistingAuth, 200);
    return () => clearTimeout(timer);
  }, [router, searchParams]);

  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem("bioconnect_token");
    localStorage.removeItem("bioconnect_user");
    sessionStorage.removeItem("bioconnect_token");
    sessionStorage.removeItem("bioconnect_user");
  };

  const saveAuthData = (token: string, userData: any, rememberMe: boolean) => {
    // Configurar dados do usuário
    if (userData.login?.toLowerCase() === "master") {
      userData.tipo = "ADMIN";
      localStorage.setItem("bioconnect_token", token);
      localStorage.setItem("bioconnect_user", JSON.stringify(userData));
      sessionStorage.setItem("bioconnect_token", token);
      sessionStorage.setItem("bioconnect_user", JSON.stringify(userData));
    } else {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("bioconnect_token", token);
      storage.setItem("bioconnect_user", JSON.stringify(userData));
    }

    // Cookie para compatibilidade
    document.cookie = `bioconnect_token=${token}; path=/; ${
      rememberMe ? "expires=Fri, 31 Dec 9999 23:59:59 GMT" : ""
    }`;
  };

  const mapRoleToTipo = (role: string) => {
    const roleMap: Record<string, "USER" | "ADMIN"> = {
      USER: "USER",
      ADMIN: "ADMIN",
      ADMINISTRADOR: "ADMIN",
    };
    return roleMap[role] || "USER";
  };

  async function authenticateUser(credentials: {
    login: string;
    senha: string;
  }): Promise<LoginResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erro ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na autenticação:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Erro de conexão. Verifique se o backend está rodando."
        );
      }
      throw error;
    }
  }

  const fetchUserData = async (token: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
    return null;
  };

  const decodeToken = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (error) {
      return null;
    }
  };

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);

    try {
      const credentials = {
        login: values.login,
        senha: values.senha,
      };

      const response = await authenticateUser(credentials);

      if (!response.token) {
        throw new Error("Token não encontrado na resposta do servidor");
      }

      let userData = null;

      // Tentar buscar dados completos do usuário
      if (response.user) {
        userData = {
          id: response.user.id,
          nome: response.user.nome,
          email: response.user.email,
          login: response.user.login,
          tipo:
            values.login.toLowerCase() === "master"
              ? "ADMIN"
              : mapRoleToTipo(
                  response.user.tipo || response.user.role || "USER"
                ),
          ativo: response.user.ativo ?? true,
        };
      } else {
        // Fallback: tentar extrair dados do token
        const tokenData = decodeToken(response.token);
        if (tokenData) {
          userData = {
            id: tokenData.id || tokenData.sub || "unknown",
            nome: tokenData.nome || tokenData.name || values.login,
            email: tokenData.email || "",
            login: values.login,
            tipo:
              values.login.toLowerCase() === "master"
                ? "ADMIN"
                : mapRoleToTipo(tokenData.role || tokenData.tipo || "USER"),
            ativo: true,
          };
        }
      }

      // Tentar buscar dados adicionais do usuário
      const additionalUserData = await fetchUserData(response.token);
      if (additionalUserData) {
        userData = { ...userData, ...additionalUserData };
      }

      if (!userData) {
        throw new Error("Não foi possível obter dados do usuário");
      }

      // Salvar dados de autenticação
      saveAuthData(response.token, userData, values.rememberMe);

      toast.success("Login realizado com sucesso!", {
        description: `Bem-vindo(a), ${userData.nome}`,
      });

      // Redirecionar
      const callbackUrl = searchParams.get("callbackUrl");
      const redirectPath =
        callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";

      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);

      let errorMessage = "Verifique suas credenciais e tente novamente.";

      if (error.message) {
        if (
          error.message.includes("401") ||
          error.message.includes("Unauthorized")
        ) {
          errorMessage = "Login ou senha incorretos. Conta pode estar inativa.";
        } else if (error.message.includes("404")) {
          errorMessage = "Serviço de autenticação não encontrado.";
        } else if (error.message.includes("500")) {
          errorMessage =
            "Erro interno do servidor. Tente novamente mais tarde.";
        } else if (
          error.message.toLowerCase().includes("network") ||
          error.message.toLowerCase().includes("fetch") ||
          error.message.toLowerCase().includes("conexão")
        ) {
          errorMessage =
            "Erro de conexão. Verifique sua internet e tente novamente.";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error("Erro ao fazer login", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Verificando login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center mb-8 justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-10 h-10 text-blue-600"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-2 text-2xl font-bold text-slate-900">
              BioConnect
            </span>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Bem-vindo de volta</CardTitle>
              <CardDescription>
                Entre com suas credenciais para acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="login"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Login</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite seu login"
                            autoComplete="username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="senha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Digite sua senha"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Lembrar-me</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-center text-sm text-muted-foreground">
                <Link
                  href="/recover-password"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link
                  href="/register"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Criar conta
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Seção lateral com imagem/informações */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center p-8"></div>
    </div>
  );
}
