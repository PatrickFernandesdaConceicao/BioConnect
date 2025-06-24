"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { useApp } from "@/contexts/AppContext";
import { Loader2, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const appContext = useApp();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Verificar conectividade
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Conexão restaurada!");
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Sem conexão com a internet");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Verificar status inicial
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Verificar autenticação
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    if (isAuthenticated && !isInitialized) {
      setIsInitialized(true);
    }
  }, [isAuthenticated, isLoading, isInitialized]);

  // Loading state
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">Carregando...</h3>
                <p className="text-muted-foreground">
                  Verificando autenticação e carregando dados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Não autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <div>
              <p className="text-muted-foreground mb-4">
                Você precisa estar logado para acessar esta página.
              </p>
              <Button onClick={() => (window.location.href = "/login")}>
                Fazer Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Erro no contexto da aplicação
  if (!appContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Erro de Sistema</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <div>
              <p className="text-muted-foreground mb-4">
                O sistema não foi inicializado corretamente. Tente atualizar a
                página.
              </p>
              <Button onClick={() => window.location.reload()}>
                Atualizar Página
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header com status de conectividade */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-slate-900 hidden md:block">
                BioConnect
              </h1>
            </div>

            {/* Informações do usuário no header mobile */}
            <div className="flex items-center space-x-2 md:hidden">
              <span className="text-sm font-medium text-slate-900">
                {user?.nome?.split(" ")[0] || "Usuário"}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="min-h-full">
            {/* Container do conteúdo */}
            <div className="mx-auto w-[90%] my-5">{children}</div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 px-4 py-3 md:px-6">
          <div className="flex items-end justify-center text-xs text-slate-500">
            <div className="flex items-center space-x-4">
              <span>© 2025 BioConnect</span>
              <span>Versão 1.0.0</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
