// app/(auth)/register/page.tsx
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
  FormDescription,
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

// Schema de validação simplificado para cadastro básico de usuário
const registerSchema = z
  .object({
    nome: z.string().min(3, {
      message: "O nome deve ter pelo menos 3 caracteres",
    }),
    email: z.string().email({
      message: "Email inválido",
    }),
    login: z
      .string()
      .min(3, {
        message: "O usuário deve ter pelo menos 3 caracteres",
      })
      .regex(/^[a-zA-Z0-9._-]+$/, {
        message:
          "Usuário deve conter apenas letras, números, pontos, hífens e underscores",
      }),
    senha: z.string().min(6, {
      message: "A senha deve ter pelo menos 6 caracteres",
    }),
    confirmacaoSenha: z.string().min(6, {
      message: "A confirmação de senha deve ter pelo menos 6 caracteres",
    }),
    aceiteTermos: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos e condições",
    }),
  })
  .refine((data) => data.senha === data.confirmacaoSenha, {
    message: "As senhas não coincidem",
    path: ["confirmacaoSenha"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// Interface para a resposta da API
interface RegisterResponse {
  id?: string;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
}

// Interface para os dados enviados à API
interface RegisterRequest {
  login: string;
  senha: string;
  nome: string;
  email: string;
  role: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome: "",
      email: "",
      login: "",
      senha: "",
      confirmacaoSenha: "",
      aceiteTermos: false,
    },
  });

  // Função para fazer a chamada à API de registro
  async function registerUser(
    userData: RegisterRequest
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

  async function onSubmit(values: RegisterFormValues) {
    setIsSubmitting(true);

    try {
      // Preparar dados para envio à API (role sempre será "USER")
      const registerData: RegisterRequest = {
        login: values.login,
        senha: values.senha,
        nome: values.nome,
        email: values.email,
        role: "USER", // Sempre será USER por padrão
      };

      await registerUser(registerData);

      toast.success("Registro realizado com sucesso!", {
        description:
          "Sua conta foi criada. Você será redirecionado para o login.",
      });

      // Limpar formulário
      form.reset();

      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao registrar:", error);

      // Tratar erros de validação específicos do backend
      if (error.errors && typeof error.errors === "object") {
        Object.keys(error.errors).forEach((key) => {
          const fieldMap: Record<string, keyof RegisterFormValues> = {
            login: "login",
            senha: "senha",
            nome: "nome",
            email: "email",
            role: "role",
          };

          const formField = fieldMap[key];
          if (formField) {
            form.setError(formField, {
              type: "manual",
              message: error.errors[key],
            });
          }
        });
      } else {
        // Tratar erros gerais
        let errorMessage = "Verifique os dados e tente novamente.";

        if (error.status === 400) {
          errorMessage =
            "Dados inválidos. Verifique as informações fornecidas.";
        } else if (error.status === 409) {
          errorMessage = "Email ou login já cadastrados. Tente outros dados.";
        } else if (error.status === 422) {
          errorMessage = "Dados não atendem aos critérios de validação.";
        } else if (error.status === 500) {
          errorMessage =
            "Erro interno do servidor. Tente novamente mais tarde.";
        } else if (
          error.message.toLowerCase().includes("network") ||
          error.message.toLowerCase().includes("fetch")
        ) {
          errorMessage =
            "Erro de conexão. Verifique sua internet e tente novamente.";
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast.error("Erro ao criar conta", {
          description: errorMessage,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Coluna esquerda - Formulário de registro */}
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
              <CardTitle>Criar uma conta</CardTitle>
              <CardDescription>
                Preencha os campos abaixo para se registrar no BioConnect.
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
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite seu nome completo"
                            autoComplete="name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="seu@email.com"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="login"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usuário</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite seu nome de usuário"
                            autoComplete="username"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Este será seu nome de usuário para fazer login
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="senha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              autoComplete="new-password"
                              {...field}
                            />
                          </FormControl>
                          {/* <FormDescription className="text-xs">
                            Mín. 8 caracteres, incluindo maiúscula, minúscula e
                            número
                          </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmacaoSenha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              autoComplete="new-password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="aceiteTermos"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Aceito os termos e condições</FormLabel>
                          <FormDescription>
                            Ao criar uma conta, você concorda com nossos{" "}
                            <Link
                              href="/terms-of-service"
                              className="text-blue-600 hover:underline"
                              target="_blank"
                            >
                              Termos de serviço
                            </Link>{" "}
                            e{" "}
                            <Link
                              href="/privacy-policy"
                              className="text-blue-600 hover:underline"
                              target="_blank"
                            >
                              Política de privacidade
                            </Link>{" "}
                            (LGPD)
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Criando conta..." : "Criar conta"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-slate-600">
                Já tem uma conta?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Faça login
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
            <h1 className="text-4xl font-bold mb-4">Bem-vindo ao BioConnect</h1>
            <p className="text-xl text-blue-100 mb-8">
              Junte-se à comunidade acadêmica da Faculdade Biopark para
              gerenciar projetos, eventos e monitorias.
            </p>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">👨‍🎓 Alunos</h3>
                <p className="text-blue-100">
                  Consulte projetos, inscreva-se em eventos e monitorias
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">👨‍🏫 Professores</h3>
                <p className="text-blue-100">
                  Cadastre projetos de pesquisa e extensão, gerencie monitorias
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">👨‍💼 Coordenadores</h3>
                <p className="text-blue-100">
                  Aprove projetos e monitorias, organize eventos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
