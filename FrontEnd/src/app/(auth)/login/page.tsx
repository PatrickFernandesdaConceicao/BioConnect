// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Sonner } from "@/components/ui/sonner";
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
  email: z.string().email({
    message: "Email inválido",
  }),
  password: z.string().min(1, {
    message: "A senha é obrigatória",
  }),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Valores padrão para o formulário
  const defaultValues: Partial<LoginFormValues> = {
    email: "",
    password: "",
    rememberMe: false,
  };

  // Configuração do formulário
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  // Função para lidar com o envio do formulário
  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);

    try {
      // Simulação de login (seria substituído pela chamada real à API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Dados do login:", values);

      // Exibir mensagem de sucesso
      Sonner({
        title: "Login realizado com sucesso!",
        description: "Você será redirecionado para o dashboard.",
      });

      // Redirecionar para o dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);
      Sonner({
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="seu@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Senha</FormLabel>
                          <Link
                            href="/recover-password"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Esqueceu a senha?
                          </Link>
                        </div>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
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
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Lembrar de mim
                        </FormLabel>
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
              eventos e monitorias.
            </p>

            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-white opacity-10 blur"></div>
              <div className="relative p-4 rounded-lg bg-blue-500 bg-opacity-20">
                <blockquote className="italic text-white">
                  "O BioConnect tem sido essencial para organizar nossas
                  atividades acadêmicas, melhorando significativamente a
                  comunicação entre professores e alunos."
                </blockquote>
                <div className="mt-4 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-700 font-bold">
                    P
                  </div>
                  <div className="ml-2 text-left">
                    <p className="text-white text-sm font-medium">
                      Prof. Paulo Silva
                    </p>
                    <p className="text-blue-200 text-xs">
                      Coordenador de Pesquisa
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
