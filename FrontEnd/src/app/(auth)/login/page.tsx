// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

// Esquema de validação do formulário
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

// Interface para resposta da API
interface LoginResponse {
  token?: string;
  user?: {
    id: string;
    nome: string;
    email: string;
    tipo: string;
  };
  message?: string;
  error?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Valores padrão para o formulário
  const defaultValues: Partial<LoginFormValues> = {
    login: "",
    senha: "",
    rememberMe: false,
  };

  // Configuração do formulário
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  // Função para fazer a chamada à API de login
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

  // Função para salvar os dados do usuário
  function saveUserSession(data: LoginResponse, rememberMe: boolean) {
    const storage = rememberMe ? localStorage : sessionStorage;

    if (data.token) {
      storage.setItem("bioconnect_token", data.token);
    }

    if (data.user) {
      storage.setItem("bioconnect_user", JSON.stringify(data.user));
    }
  }

  // Função para lidar com o envio do formulário
  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);

    try {
      const credentials = {
        login: values.login,
        senha: values.senha,
      };

      const response = await authenticateUser(credentials);

      // Salvar dados da sessão
      saveUserSession(response, values.rememberMe);

      // Exibir mensagem de sucesso
      toast.success("Login realizado com sucesso!", {
        description: "Você será redirecionado para o dashboard.",
      });

      // Pequeno delay para mostrar a mensagem antes do redirecionamento
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Erro no login:", error);

      let errorMessage = "Verifique suas credenciais e tente novamente.";

      if (error instanceof Error) {
        // Personalizar mensagens de erro baseadas na resposta da API
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

  return (
    <div className="flex min-h-screen">
      {/* Coluna esquerda - Formulário de login */}
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
                          {/* <Link
                            href="/recover-password"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Esqueceu a senha?
                          </Link> */}
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

      {/* Coluna direita - Banner informativo */}
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
