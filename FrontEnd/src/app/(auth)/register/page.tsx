// app/(auth)/register/page.tsx
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
const registerSchema = z
  .object({
    name: z.string().min(3, {
      message: "O nome deve ter pelo menos 3 caracteres",
    }),
    email: z.string().email({
      message: "Email inválido",
    }),
    password: z.string().min(8, {
      message: "A senha deve ter pelo menos 8 caracteres",
    }),
    confirmPassword: z.string().min(8, {
      message: "A confirmação de senha deve ter pelo menos 8 caracteres",
    }),
    role: z.string({
      required_error: "Selecione um tipo de usuário",
    }),
    institution: z.string().optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos e condições",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Valores padrão para o formulário
  const defaultValues: Partial<RegisterFormValues> = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    institution: "",
    acceptTerms: false,
  };

  // Configuração do formulário
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues,
  });

  // Observar o campo role para lógica condicional
  const watchRole = form.watch("role");

  // Função para lidar com o envio do formulário
  async function onSubmit(values: RegisterFormValues) {
    setIsSubmitting(true);

    try {
      // Simulação de envio (seria substituído pela chamada real à API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Dados do registro:", values);

      // Exibir mensagem de sucesso
      Sonner({
        title: "Registro realizado com sucesso!",
        description:
          "Sua conta foi criada. Você será redirecionado para o login.",
      });

      // Redirecionar para o login
      router.push("/login");
    } catch (error) {
      console.error("Erro ao registrar:", error);
      Sonner({
        title: "Erro ao criar conta",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome Completo" {...field} />
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
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
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
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar senha</FormLabel>
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
                  </div>

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de usuário</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione seu perfil" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ALUNO">Aluno</SelectItem>
                            <SelectItem value="PROFESSOR">Professor</SelectItem>
                            <SelectItem value="EXTERNO">
                              Colaborador Externo
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {(watchRole === "ALUNO" || watchRole === "PROFESSOR") && (
                    <FormField
                      control={form.control}
                      name="institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instituição</FormLabel>
                          <FormControl>
                            <Input placeholder="Faculdade Biopark" {...field} />
                          </FormControl>
                          <FormDescription>
                            {watchRole === "ALUNO"
                              ? "Informe a instituição onde você estuda"
                              : "Informe a instituição onde você leciona"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="acceptTerms"
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
                              href="#"
                              className="text-blue-600 hover:underline"
                            >
                              Termos de serviço
                            </Link>{" "}
                            e{" "}
                            <Link
                              href="#"
                              className="text-blue-600 hover:underline"
                            >
                              Política de privacidade
                            </Link>
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
                    {isSubmitting ? "Processando..." : "Criar conta"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-slate-600">
                Já tem uma conta?{" "}
                <Link
                  href="/login"
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
              Gerencie seus projetos acadêmicos, eventos e monitorias de forma
              eficiente e integrada.
            </p>

            <div className="space-y-6">
              <div className="flex items-center text-left">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Projetos Acadêmicos</h3>
                  <p className="text-blue-100">
                    Gerencie projetos de pesquisa e extensão em um só lugar.
                  </p>
                </div>
              </div>

              <div className="flex items-center text-left">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">
                    Eventos Institucionais
                  </h3>
                  <p className="text-blue-100">
                    Organize e participe de eventos com facilidade.
                  </p>
                </div>
              </div>

              <div className="flex items-center text-left">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">
                    Monitorias Acadêmicas
                  </h3>
                  <p className="text-blue-100">
                    Ofereça ou inscreva-se em monitorias acadêmicas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
