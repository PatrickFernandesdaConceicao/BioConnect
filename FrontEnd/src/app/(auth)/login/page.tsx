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

const loginSchema = z.object({
  login: z.string().min(1, {
    message: "Login é obrigatório",
  }),
  senha: z.string().min(1, {
    message: "A senha é obrigatória",
  }),
  rememberMe: z.boolean().default(false),
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

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      senha: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    const checkExistingAuth = () => {
      const token =
        localStorage.getItem("bioconnect_token") ||
        sessionStorage.getItem("bioconnect_token");
      const user =
        localStorage.getItem("bioconnect_user") ||
        sessionStorage.getItem("bioconnect_user");

      if (token && user) {
        const callbackUrl = searchParams.get("callbackUrl");
        const redirectPath =
          callbackUrl && callbackUrl.startsWith("/")
            ? callbackUrl
            : "/dashboard";

        router.push(redirectPath);
        return;
      }

      setIsCheckingAuth(false);
    };

    const timer = setTimeout(checkExistingAuth, 100);
    return () => clearTimeout(timer);
  }, [router, searchParams]);

  const saveAuthData = (token: string, userData: any, rememberMe: boolean) => {
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
      return null;
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
        const userFromAPI = await fetchUserData(response.token);

        if (userFromAPI) {
          userData = {
            id: userFromAPI.id,
            nome: userFromAPI.nome,
            email: userFromAPI.email,
            login: userFromAPI.login,
            tipo:
              values.login.toLowerCase() === "master"
                ? "ADMIN"
                : mapRoleToTipo(userFromAPI.tipo || userFromAPI.role || "USER"),
            ativo: userFromAPI.ativo ?? true,
          };
        } else {
          const tokenPayload = decodeToken(response.token);
          userData = {
            id: tokenPayload?.sub || "unknown",
            nome: values.login,
            email: `${values.login}@biopark.edu.br`,
            login: values.login,
            tipo:
              values.login.toLowerCase() === "master"
                ? "ADMIN"
                : mapRoleToTipo(tokenPayload?.role || "USER"),
            ativo: true,
          };
        }
      }

      saveAuthData(response.token, userData, values.rememberMe);

      toast.success("Login realizado com sucesso!", {
        description: "Você será redirecionado em instantes.",
      });
      router.push("/dashboard");
    } catch (error) {
      let errorMessage = "Verifique suas credenciais e tente novamente.";

      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage = "Credenciais inválidas. Verifique seu login e senha.";
        } else if (error.message.includes("403")) {
          errorMessage = "Acesso negado. Conta pode estar inativa.";
        } else if (error.message.includes("404")) {
          errorMessage = "Serviço de autenticação não encontrado.";
        } else if (error.message.includes("500")) {
          errorMessage =
            "Erro interno do servidor. Tente novamente mais tarde.";
        } else if (
          error.message.toLowerCase().includes("network") ||
          error.message.toLowerCase().includes("fetch")
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
              <CardTitle>Entrar no BioConnect</CardTitle>
              <CardDescription>
                Entre com suas credenciais para acessar sua conta
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
                            type="text"
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
                        <div className="flex items-center justify-between">
                          <FormLabel>Senha</FormLabel>
                        </div>
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
                          <FormLabel>Lembrar de mim</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-slate-600">
                Não tem uma conta?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Registre-se aqui
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="h-full flex flex-col justify-center items-center p-12">
          <div className="max-w-md text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Bem-vindo de volta!</h1>
            <p className="text-xl text-blue-100 mb-8">
              Acesse o BioConnect para gerenciar seus projetos acadêmicos,
              eventos e monitorias da Faculdade Biopark.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 p-3 rounded-lg">
                <h3 className="font-semibold mb-1">Projetos</h3>
                <p className="text-blue-100">Pesquisa e Extensão</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <h3 className="font-semibold mb-1">Eventos</h3>
                <p className="text-blue-100">Acadêmicos</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <h3 className="font-semibold mb-1">Monitorias</h3>
                <p className="text-blue-100">Disciplinas</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <h3 className="font-semibold mb-1">Relatórios</h3>
                <p className="text-blue-100">Detalhados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
