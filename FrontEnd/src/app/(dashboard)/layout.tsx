"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { useApp } from "@/contexts/AppContext";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated } = useAuth();
  const appContext = useApp();
  const [isInitialized, setIsInitialized] = useState(false);

  // Verificar se está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    if (isAuthenticated && !isInitialized) {
      setIsInitialized(true);
    }
  }, [isAuthenticated, isInitialized]);

  // Não autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <p className="text-muted-foreground">
              Você precisa estar logado para acessar esta página.
            </p>
            <Button onClick={() => (window.location.href = "/login")}>
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar se o contexto da aplicação está disponível
  if (!appContext) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Erro de Contexto</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <p className="text-muted-foreground">
              O contexto da aplicação não foi inicializado corretamente.
            </p>
            <Button onClick={() => window.location.reload()}>
              Recarregar Página
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="container max-w-7xl mx-auto px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
