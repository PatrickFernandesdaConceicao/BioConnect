"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  BookOpen,
  BarChart,
  Users,
  Settings,
  LogOut,
  Shield,
  User,
  Menu,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Rotas principais
const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
    roles: ["USER", "ADMIN"],
  },
  {
    label: "Projetos",
    icon: FileText,
    href: "/projetos",
    color: "text-violet-500",
    roles: ["USER", "ADMIN"],
  },
  {
    label: "Eventos",
    icon: Calendar,
    href: "/eventos",
    color: "text-pink-700",
    roles: ["USER", "ADMIN"],
  },
  {
    label: "Monitorias",
    icon: BookOpen,
    href: "/monitorias",
    color: "text-orange-500",
    roles: ["USER", "ADMIN"],
  },
];

// Rotas administrativas
const adminRoutes = [
  {
    label: "Usuários",
    icon: Users,
    href: "/usuarios",
    color: "text-blue-500",
    roles: ["ADMIN"],
  },
  {
    label: "Relatórios",
    icon: BarChart,
    href: "/relatorios",
    color: "text-green-500",
    roles: ["ADMIN"],
  },
];

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isDarkMode = theme === "dark";

  if (!isAuthenticated || !user) {
    return null;
  }

  const isMasterUser = user.login?.toLowerCase() === "master";
  const isAdmin = user.tipo === "ADMIN" || isMasterUser;

  const userName = user.nome || "Usuário";
  const userEmail = user.email || "";
  const userInitials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    try {
      logout();
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro no logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const visibleRoutes = routes.filter(
    (route) =>
      route.roles.includes(user.tipo) ||
      (isMasterUser && route.roles.includes("ADMIN"))
  );

  const visibleAdminRoutes = adminRoutes.filter(
    (route) =>
      route.roles.includes(user.tipo) ||
      (isMasterUser && route.roles.includes("ADMIN"))
  );

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between pl-3 mb-8">
        <Link href="/dashboard" className="flex items-center">
          <div className="relative w-8 h-8 mr-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className={cn(
                "w-full h-full",
                isDarkMode ? "text-white" : "text-slate-900"
              )}
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">BioConnect</h1>
        </Link>

        {/* Botão mobile para fechar */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Perfil do usuário */}
      <div className="px-3 mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start p-3 h-auto",
                isDarkMode ? "hover:bg-white/10" : "hover:bg-slate-100"
              )}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-500 text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {userEmail}
                  </p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Menu Principal */}
      <div className="px-3 mb-6">
        <div className="space-y-1">
          {visibleRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition",
                pathname === route.href || pathname.startsWith(route.href + "/")
                  ? isDarkMode
                    ? "bg-white/10 text-white"
                    : "bg-slate-100 text-slate-900"
                  : isDarkMode
                  ? "text-zinc-400 hover:text-white hover:bg-white/10"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Menu Administrativo */}
      {isAdmin && visibleAdminRoutes.length > 0 && (
        <div className="px-3 mb-6">
          <div
            className={cn(
              "mb-2 px-3",
              isDarkMode ? "text-zinc-400" : "text-slate-500"
            )}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-3 w-3" />
              <h2 className="text-xs uppercase font-semibold">Administração</h2>
            </div>
          </div>
          <div className="space-y-1">
            {visibleAdminRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition",
                  pathname === route.href ||
                    pathname.startsWith(route.href + "/")
                    ? isDarkMode
                      ? "bg-white/10 text-white"
                      : "bg-slate-100 text-slate-900"
                    : isDarkMode
                    ? "text-zinc-400 hover:text-white hover:bg-white/10"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Status/Badge do usuário */}
      <div className="px-3 mt-auto">
        <div className="flex items-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          {isAdmin ? (
            <Badge variant="destructive" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Coordenador
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              <User className="w-3 h-3 mr-1" />
              Usuário
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {user.ativo ? "Ativo" : "Inativo"}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Botão mobile para abrir sidebar */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Overlay mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Desktop */}
      <div
        className={cn(
          "hidden md:flex space-y-4 py-4 flex-col h-full border-r-2 w-64 fixed left-0 top-0",
          isDarkMode ? "bg-background text-white" : "bg-white text-slate-900",
          className
        )}
      >
        <NavContent />
      </div>

      {/* Sidebar Mobile */}
      <div
        className={cn(
          "md:hidden fixed left-0 top-0 z-50 h-full w-64 transform transition-transform duration-200 ease-in-out border-r-2",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          isDarkMode ? "bg-background text-white" : "bg-white text-slate-900"
        )}
      >
        <div className="space-y-4 py-4 flex flex-col h-full">
          <NavContent />
        </div>
      </div>
    </>
  );
};
