// app/(auth)/recover-password/page.tsx
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
import { Input } from "@/components/ui/input";
import { Sonner } from "@/components/ui/sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";

// Esquema de validação do formulário
const recoverSchema = z.object({
  email: z.string().email({
    message: "Email inválido",
  }),
});

type RecoverFormValues = z.infer<typeof recoverSchema>;

export default function RecoverPasswordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Valores padrão para o formulário
  const defaultValues: Partial<RecoverFormValues> = {
    email: "",
  };

  // Configuração do formulário
  const form = useForm<RecoverFormValues>({
    resolver: zodResolver(recoverSchema),
    defaultValues,
  });

  // Função para lidar com o envio do formulário
  async function onSubmit(values: RecoverFormValues) {
    setIsSubmitting(true);

    try {
      // Simulação de envio (seria substituído pela chamada real à API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Email para recuperação:", values.email);

      // Exibir mensagem de sucesso
      Sonner({
        title: "Solicitação enviada",
        description:
          "Verifique seu email para instruções de recuperação de senha.",
      });

      // Atualizar estado para mostrar a mensagem de sucesso
      setIsSuccess(true);
    } catch (error) {
      console.error("Erro na recuperação de senha:", error);
      Sonner({
        title: "Erro ao processar solicitação",
        description: "Não foi possível enviar as instruções. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-block mb-4">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Voltar para login
          </Button>
        </Link>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Recuperar senha</CardTitle>
            <CardDescription>
              {!isSuccess
                ? "Informe seu email para receber instruções de recuperação de senha."
                : "Instruções de recuperação enviadas. Verifique seu email."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSuccess ? (
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
                        <FormDescription>
                          Enviaremos um link para recuperação de senha para este
                          email.
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
                    {isSubmitting ? "Enviando..." : "Enviar instruções"}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="py-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-lg font-medium mb-2">Email enviado!</p>
                <p className="text-slate-600 mb-4">
                  Enviamos um link de recuperação para o seu email. Por favor,
                  verifique sua caixa de entrada e a pasta de spam.
                </p>
                <p className="text-slate-600 text-sm">
                  O link expirará em 1 hora. Se não receber o email, você pode{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => setIsSuccess(false)}
                  >
                    tentar novamente
                  </button>
                  .
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-slate-600">
              Lembrou sua senha?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Voltar para login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
