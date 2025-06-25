import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

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
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  login: z.string().min(1, {
    message: "Login é obrigatório",
  }),
  senha: z.string().min(1, {
    message: "A senha é obrigatória",
  }),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface Props {
  callbackUrl: string | null;
  router: ReturnType<typeof useRouter>;
}

export default function LoginPageContent({ callbackUrl, router }: Props) {
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
      try {
        const token =
          localStorage.getItem("bioconnect_token") ||
          sessionStorage.getItem("bioconnect_token");
        const user =
          localStorage.getItem("bioconnect_user") ||
          sessionStorage.getItem("bioconnect_user");

        if (token && user) {
          if (!isTokenExpired(token)) {
            const redirectPath =
              callbackUrl && callbackUrl.startsWith("/")
                ? callbackUrl
                : "/dashboard";
            router.push(redirectPath);
            return;
          } else {
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
  }, [callbackUrl, router]);

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
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("bioconnect_token", token);
    storage.setItem("bioconnect_user", JSON.stringify(userData));

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

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
        }/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!data.token) {
        throw new Error("Token não encontrado");
      }

      const userData = {
        id: data.user?.id || "",
        nome: data.user?.nome || values.login,
        email: data.user?.email || "",
        login: values.login,
        tipo:
          values.login.toLowerCase() === "master"
            ? "ADMIN"
            : mapRoleToTipo(data.user?.tipo || data.user?.role || "USER"),
        ativo: data.user?.ativo ?? true,
      };

      saveAuthData(data.token, userData, values.rememberMe);

      toast.success("Login realizado com sucesso!", {
        description: `Bem-vindo(a), ${userData.nome}`,
      });

      const redirectPath =
        callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";

      setTimeout(() => {
        router.push(redirectPath);
      }, 100);
    } catch (error) {
      console.error("Erro de login:", error);
      toast.error("Erro no login", {
        description:
          error instanceof Error
            ? error.message
            : "Verifique suas credenciais e tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Digite suas credenciais</CardDescription>
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
                      <FormLabel>Usuário</FormLabel>
                      <FormControl>
                        <Input {...field} autoComplete="username" />
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
                          {...field}
                          autoComplete="current-password"
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
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Lembrar de mim</FormLabel>
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
          <CardFooter className="flex justify-between">
            <Link
              href="/auth/recover-password"
              className="text-sm text-blue-600"
            >
              Esqueceu a senha?
            </Link>
            <Link href="/register" className="text-sm text-blue-600">
              Criar conta
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
