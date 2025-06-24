"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, authFetch } from "@/lib/auth";
import { useTheme } from "@/components/theme-provider";
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
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Save,
  AlertCircle,
  Loader2,
  Moon,
  Sun,
  Monitor,
  Mail,
  Smartphone,
  Globe,
} from "lucide-react";

// Schema de validação para configurações
const settingsSchema = z.object({
  // Notificações
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  notifyNewProjects: z.boolean().default(true),
  notifyEvents: z.boolean().default(true),
  notifyMonitorias: z.boolean().default(true),
  notifyDeadlines: z.boolean().default(true),

  // Preferências
  language: z.string().default("pt-BR"),
  timezone: z.string().default("America/Sao_Paulo"),
  dateFormat: z.string().default("dd/MM/yyyy"),

  // Privacidade
  profileVisible: z.boolean().default(true),
  showEmail: z.boolean().default(false),
  allowDirectMessages: z.boolean().default(true),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface UserSettings {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  notifyNewProjects: boolean;
  notifyEvents: boolean;
  notifyMonitorias: boolean;
  notifyDeadlines: boolean;
  language: string;
  timezone: string;
  dateFormat: string;
  profileVisible: boolean;
  showEmail: boolean;
  allowDirectMessages: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Formulário de configurações
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      notifyNewProjects: true,
      notifyEvents: true,
      notifyMonitorias: true,
      notifyDeadlines: true,
      language: "pt-BR",
      timezone: "America/Sao_Paulo",
      dateFormat: "dd/MM/yyyy",
      profileVisible: true,
      showEmail: false,
      allowDirectMessages: true,
    },
  });

  // Verificar autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, router]);

  // Carregar configurações do usuário
  useEffect(() => {
    if (user?.id) {
      fetchSettings();
    }
  }, [user?.id]);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await authFetch(`${apiUrl}/api/usuarios/settings`);

      if (!response.ok) {
        // Se não encontrar configurações, usar padrões
        if (response.status === 404) {
          return;
        }
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setSettings(data);

      // Atualizar formulário com configurações salvas
      form.reset(data);
    } catch (error: any) {
      console.error("Erro ao carregar configurações:", error);
      // Usar configurações padrão em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (values: SettingsFormValues) => {
    try {
      setIsUpdating(true);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await authFetch(`${apiUrl}/api/usuarios/settings`, {
        method: "PUT",
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const updatedSettings = await response.json();
      setSettings(updatedSettings);

      toast.success("Configurações salvas com sucesso!");
    } catch (error: any) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações", {
        description: error.message || "Tente novamente.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const clearCache = async () => {
    try {
      toast.loading("Limpando cache...");

      // Limpar cache do navegador
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }

      // Limpar localStorage (exceto dados de auth)
      const authKeys = ["bioconnect_token", "bioconnect_user"];
      Object.keys(localStorage).forEach((key) => {
        if (!authKeys.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      toast.success("Cache limpo com sucesso!");
    } catch (error) {
      console.error("Erro ao limpar cache:", error);
      toast.error("Erro ao limpar cache");
    }
  };

  const exportData = async () => {
    try {
      toast.loading("Gerando exportação...");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await authFetch(`${apiUrl}/api/usuarios/export`);

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bioconnect-dados-${user?.login}-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Dados exportados com sucesso!");
    } catch (error: any) {
      console.error("Erro ao exportar dados:", error);
      toast.error("Erro ao exportar dados", {
        description: error.message || "Tente novamente.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
          <p className="mt-2 text-muted-foreground">
            Carregando configurações...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Personalize sua experiência no BioConnect
        </p>
      </div>

      {/* Tabs de Configurações */}
      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="privacy">Privacidade</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(updateSettings)}
            className="space-y-6"
          >
            {/* Tab: Notificações */}
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Configurações de Notificação
                  </CardTitle>
                  <CardDescription>
                    Configure como e quando você deseja receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Notificações gerais */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Canais de Notificação
                    </h3>

                    <FormField
                      control={form.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center">
                              <Mail className="mr-2 h-4 w-4" />
                              Notificações por Email
                            </FormLabel>
                            <FormDescription>
                              Receber notificações no seu email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pushNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center">
                              <Smartphone className="mr-2 h-4 w-4" />
                              Notificações Push
                            </FormLabel>
                            <FormDescription>
                              Receber notificações no navegador
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Tipos de notificação */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Tipos de Notificação
                    </h3>

                    <FormField
                      control={form.control}
                      name="notifyNewProjects"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Novos Projetos
                            </FormLabel>
                            <FormDescription>
                              Notificar sobre novos projetos disponíveis
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notifyEvents"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Eventos</FormLabel>
                            <FormDescription>
                              Notificar sobre novos eventos e alterações
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notifyMonitorias"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Monitorias
                            </FormLabel>
                            <FormDescription>
                              Notificar sobre oportunidades de monitoria
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notifyDeadlines"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Prazos</FormLabel>
                            <FormDescription>
                              Notificar sobre prazos importantes
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Aparência */}
            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="mr-2 h-5 w-5" />
                    Aparência e Localização
                  </CardTitle>
                  <CardDescription>
                    Personalize a aparência e configurações regionais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tema */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Tema</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Button
                        type="button"
                        variant={theme === "light" ? "default" : "outline"}
                        onClick={() => setTheme("light")}
                        className="flex flex-col items-center p-4 h-auto"
                      >
                        <Sun className="h-6 w-6 mb-2" />
                        Claro
                      </Button>
                      <Button
                        type="button"
                        variant={theme === "dark" ? "default" : "outline"}
                        onClick={() => setTheme("dark")}
                        className="flex flex-col items-center p-4 h-auto"
                      >
                        <Moon className="h-6 w-6 mb-2" />
                        Escuro
                      </Button>
                      <Button
                        type="button"
                        variant={theme === "system" ? "default" : "outline"}
                        onClick={() => setTheme("system")}
                        className="flex flex-col items-center p-4 h-auto"
                      >
                        <Monitor className="h-6 w-6 mb-2" />
                        Sistema
                      </Button>
                    </div>
                  </div>

                  {/* Configurações regionais */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Idioma</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o idioma" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pt-BR">
                                Português (Brasil)
                              </SelectItem>
                              <SelectItem value="en-US">
                                English (US)
                              </SelectItem>
                              <SelectItem value="es-ES">Español</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fuso Horário</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o fuso horário" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="America/Sao_Paulo">
                                Brasília (GMT-3)
                              </SelectItem>
                              <SelectItem value="America/New_York">
                                Nova York (GMT-5)
                              </SelectItem>
                              <SelectItem value="Europe/London">
                                Londres (GMT+0)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateFormat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Formato de Data</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o formato" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="dd/MM/yyyy">
                                DD/MM/AAAA
                              </SelectItem>
                              <SelectItem value="MM/dd/yyyy">
                                MM/DD/AAAA
                              </SelectItem>
                              <SelectItem value="yyyy-MM-dd">
                                AAAA-MM-DD
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Privacidade */}
            <TabsContent value="privacy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Configurações de Privacidade
                  </CardTitle>
                  <CardDescription>
                    Controle a visibilidade das suas informações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="profileVisible"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Perfil Visível
                          </FormLabel>
                          <FormDescription>
                            Permitir que outros usuários vejam seu perfil
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="showEmail"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Mostrar Email
                          </FormLabel>
                          <FormDescription>
                            Exibir seu email no perfil público
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allowDirectMessages"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Mensagens Diretas
                          </FormLabel>
                          <FormDescription>
                            Permitir que outros usuários enviem mensagens
                            diretas
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Avançado */}
            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Configurações Avançadas
                  </CardTitle>
                  <CardDescription>
                    Configurações do sistema e ferramentas de manutenção
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearCache}
                      className="flex items-center justify-center"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Limpar Cache
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={exportData}
                      className="flex items-center justify-center"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Exportar Dados
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                          Atenção
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          As configurações avançadas podem afetar o
                          funcionamento do sistema. Use com cautela.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Botão de salvar */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
