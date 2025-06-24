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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Check,
  Mail,
  KeyRound,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Schema para solicitação de recuperação
const requestRecoverSchema = z.object({
  email: z.string().email({
    message: "Email inválido",
  }),
});

// Schema para redefinir senha
const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token é obrigatório"),
    novaSenha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string().min(6, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

type RequestRecoverFormValues = z.infer<typeof requestRecoverSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function RecoverPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  // Verificar se há token na URL para modo de redefinição
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setResetToken(token);
      setIsResetMode(true);
    }
  }, [searchParams]);

  // Formulário para solicitar recuperação
  const requestForm = useForm<RequestRecoverFormValues>({
    resolver: zodResolver(requestRecoverSchema),
    defaultValues: {
      email: "",
    },
  });

  // Formulário para redefinir senha
  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: resetToken || "",
      novaSenha: "",
      confirmarSenha: "",
    },
  });

  // Atualizar token no formulário quando mudar
  useEffect(() => {
    if (resetToken) {
      resetForm.setValue("token", resetToken);
    }
  }, [resetToken, resetForm]);

  // Função para solicitar recuperação de senha
  async function requestPasswordReset(values: RequestRecoverFormValues) {
    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      const response = await fetch(`${apiUrl}/auth/recover-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erro ${response.status}: ${response.statusText}`
        );
      }

      // Sucesso na solicitação
      setIsSuccess(true);
      toast.success("Solicitação enviada!", {
        description: "Verifique seu email para instruções de recuperação.",
      });
    } catch (error: any) {
      console.error("Erro na recuperação de senha:", error);

      let errorMessage = "Não foi possível processar a solicitação.";

      if (error.message) {
        if (error.message.includes("404")) {
          errorMessage = "Email não encontrado em nosso sistema.";
        } else if (error.message.includes("429")) {
          errorMessage = "Muitas tentativas. Tente novamente mais tarde.";
        } else if (error.message.includes("500")) {
          errorMessage =
            "Erro interno do servidor. Tente novamente mais tarde.";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error("Erro ao processar solicitação", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Função para redefinir senha
  async function resetPassword(values: ResetPasswordFormValues) {
    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: values.token,
          novaSenha: values.novaSenha,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erro ${response.status}: ${response.statusText}`
        );
      }

      // Sucesso na redefinição
      toast.success("Senha redefinida com sucesso!", {
        description: "Você já pode fazer login com sua nova senha.",
      });

      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error);

      let errorMessage = "Não foi possível redefinir a senha.";

      if (error.message) {
        if (error.message.includes("400")) {
          errorMessage =
            "Token inválido ou expirado. Solicite uma nova recuperação.";
        } else if (error.message.includes("404")) {
          errorMessage = "Token não encontrado. Solicite uma nova recuperação.";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error("Erro ao redefinir senha", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
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

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isResetMode ? (
                  <>
                    <KeyRound className="h-5 w-5" />
                    Redefinir Senha
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5" />
                    Recuperar Senha
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {isResetMode
                  ? "Digite sua nova senha abaixo."
                  : !isSuccess
                  ? "Informe seu email para receber instruções de recuperação."
                  : "Instruções enviadas! Verifique seu email."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!isSuccess && !isResetMode ? (
                // Formulário de solicitação de recuperação
                <Form {...requestForm}>
                  <form
                    onSubmit={requestForm.handleSubmit(requestPasswordReset)}
                    className="space-y-4"
                  >
                    <FormField
                      control={requestForm.control}
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
                          <FormDescription>
                            Digite o email associado à sua conta
                          </FormDescription>
                          <FormMessage />
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
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Enviar Instruções
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              ) : isResetMode ? (
                // Formulário de redefinição de senha
                <Form {...resetForm}>
                  <form
                    onSubmit={resetForm.handleSubmit(resetPassword)}
                    className="space-y-4"
                  >
                    <FormField
                      control={resetForm.control}
                      name="novaSenha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nova Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Digite sua nova senha"
                              autoComplete="new-password"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Mínimo de 6 caracteres
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={resetForm.control}
                      name="confirmarSenha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Nova Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirme sua nova senha"
                              autoComplete="new-password"
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
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Redefinindo...
                        </>
                      ) : (
                        <>
                          <KeyRound className="mr-2 h-4 w-4" />
                          Redefinir Senha
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                // Mensagem de sucesso
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Email Enviado!
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      Verifique sua caixa de entrada e siga as instruções para
                      redefinir sua senha.
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Não recebeu o email? Verifique sua pasta de spam ou tente
                    novamente em alguns minutos.
                  </div>
                </div>
              )}
            </CardContent>

            {!isSuccess && (
              <CardFooter>
                <div className="text-center text-sm text-muted-foreground w-full">
                  Lembrou da senha?{" "}
                  <Link
                    href="/login"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Fazer login
                  </Link>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>

      {/* Seção lateral com informações */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
            <KeyRound className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Recuperação Segura</h2>
          <p className="text-xl text-blue-100 mb-6">
            Recupere o acesso à sua conta de forma rápida e segura
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">1</span>
              </div>
              <p className="text-blue-100">Informe o email da sua conta</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">2</span>
              </div>
              <p className="text-blue-100">Verifique seu email</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">3</span>
              </div>
              <p className="text-blue-100">Defina uma nova senha</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
