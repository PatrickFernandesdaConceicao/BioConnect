"use client";

import { RouteGuard } from "./RouteGuard";
import type { User } from "@/lib/auth";

interface ProtectedPageProps {
  children: React.ReactNode;
  requiredRoles?: User["tipo"][];
  fallbackComponent?: React.ReactNode;
}

export function ProtectedPage({
  children,
  requiredRoles,
  fallbackComponent,
}: ProtectedPageProps) {
  return (
    <RouteGuard requiredRoles={requiredRoles} fallback={fallbackComponent}>
      {children}
    </RouteGuard>
  );
}

// =============================================================================
// COMPONENTE DE LOADING PARA AUTENTICAÇÃO
// =============================================================================

// components/AuthLoadingSpinner.tsx
export function AuthLoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
        </div>
        <p className="mt-4 text-sm text-gray-600">Carregando BioConnect...</p>
        <p className="text-xs text-gray-400">Verificando autenticação</p>
      </div>
    </div>
  );
}
