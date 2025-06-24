"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

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
import {
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Schema de validação
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

interface RegisterResponse {
  id?: string;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
}

interface RegisterRequest {
  login: string;
  senha: string;
  nome: string;
  email: string;
  role: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [] as string[],
  });

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

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

  // Verificar força da senha
  const checkPasswordStrength = (password: string) => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("Pelo menos 8 caracteres");
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Uma letra maiúscula");
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Uma letra minúscula");
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Um número");
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Um caractere especial");
    }

    setPasswordStrength({ score, feedback });
  };

  // Monitorar mudanças na senha
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "senha" && value.senha) {
        checkPasswordStrength(value.senha);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function registerUser(
    userData: RegisterRequest
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
      console.error("Erro na requisição de registro:", error);
      throw error;
    }
  }

  async function onSubmit(values: RegisterFormValues) {
    setIsSubmitting(true);

    try {
      const registerData: RegisterRequest = {
        login: values.login,
        senha: values.senha,
        nome: values.nome,
        email: values.email,
        role: "USER",
      };

      await registerUser(registerData);

      toast.success("Registro realizado com sucesso!", {
        description:
          "Sua conta foi criada. Você será redirecionado para o login.",
      });

      form.reset();

      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao registrar:", error);

      // Tratar erros de validação do backend
      if (error.errors && typeof error.errors === "object") {
        Object.keys(error.errors).forEach((key) => {
          const fieldMap: Record<string, keyof RegisterFormValues> = {
            login: "login",
            senha: "senha",
            nome: "nome",
            email: "email",
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
        // Tratar outros tipos de erro
        let errorMessage = "Verifique os dados e tente novamente.";

        if (error.status === 400) {
          errorMessage =
            "Dados inválidos. Verifique as informações fornecidas.";
        } else if (error.status === 409) {
          errorMessage = "Email ou login já cadastrados. Tente outros dados.";
        } else if (error.status === 500) {
          errorMessage =
            "Erro interno do servidor. Tente novamente mais tarde.";
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

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return "bg-red-500";
    if (passwordStrength.score <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return "Fraca";
    if (passwordStrength.score <= 3) return "Média";
    return "Forte";
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
              <p className="text-muted-foreground">Redirecionando...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8">
        <div className="w-full max-w-md">
          {/* Link para voltar */}
          <Link href="/login" className="inline-block mb-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Voltar para login
            </Button>
          </Link>

          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
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
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Criar conta
              </CardTitle>
              <CardDescription>
                Preencha as informações abaixo para criar sua conta
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
                        <FormLabel>Nome de usuário</FormLabel>
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
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          {field.value && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Força da senha:</span>
                                <span
                                  className={
                                    passwordStrength.score <= 2
                                      ? "text-red-600"
                                      : passwordStrength.score <= 3
                                      ? "text-yellow-600"
                                      : "text-green-600"
                                  }
                                >
                                  {getPasswordStrengthText()}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                                  style={{
                                    width: `${
                                      (passwordStrength.score / 5) * 100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              {passwordStrength.feedback.length > 0 && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Faltam: {passwordStrength.feedback.join(", ")}
                                </div>
                              )}
                            </div>
                          )}
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
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
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
                          <FormLabel>
                            Aceito os{" "}
                            <Link
                              href="/terms"
                              className="underline underline-offset-4 hover:text-primary"
                              target="_blank"
                            >
                              termos e condições
                            </Link>
                          </FormLabel>
                          <FormDescription>
                            Você deve aceitar os termos para criar uma conta.
                          </FormDescription>
                          <FormMessage />
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
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Criar conta
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter>
              <div className="text-center text-sm text-muted-foreground w-full">
                Já tem uma conta?{" "}
                <Link
                  href="/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Fazer login
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Seção lateral com informações */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlus className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Junte-se ao BioConnect</h2>
          <p className="text-xl text-blue-100 mb-8">
            Gerencie projetos, eventos e monitorias de forma integrada
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <p className="text-blue-100">
                Acesso completo às funcionalidades
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <p className="text-blue-100">Interface intuitiva e responsiva</p>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <p className="text-blue-100">Dados seguros e protegidos</p>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <p className="text-blue-100">Suporte técnico especializado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
