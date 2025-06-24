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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

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

const adminRoutes = [
  {
    label: "Usuários",
    icon: Users,
    href: "/usuarios",
    color: "text-blue-500",
    roles: ["ADMIN"],
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();

  const isDarkMode = theme === "dark";

  if (!isAuthenticated || !user) {
    return null;
  }

  const isMasterUser = user.login?.toLowerCase() === "master";
  const isAdmin = user.tipo === "ADMIN" || isMasterUser;

  const userName = user.nome || "Usuário";
  const userEmail = user.email || "";

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

  return (
    <div
      className={cn(
        "space-y-4 py-4 flex flex-col h-full border-r-2",
        isDarkMode ? "bg-background text-white" : "bg-white text-slate-900"
      )}
    >
      <div className="px-3 py-2 flex-1">
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
        </div>

        {/* Menu Principal */}
        <div className="space-y-1">
          {visibleRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
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

        {/* Menu Administrativo */}
        {isAdmin && visibleAdminRoutes.length > 0 && (
          <>
            <div
              className={cn(
                "mt-6 mb-2 px-3",
                isDarkMode ? "text-zinc-400" : "text-slate-500"
              )}
            >
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3" />
                <h2 className="text-xs uppercase font-semibold">
                  Administração
                </h2>
              </div>
            </div>
            <div className="space-y-1">
              {visibleAdminRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
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
          </>
        )}
      </div>

      {/* Footer com informações do usuário */}
      <div className="px-3 py-2">
        <div className="bg-muted/50 rounded-lg p-3 space-y-3">
          {/* Informações do usuário */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={userName} />
              <AvatarFallback>
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {userEmail}
              </p>{" "}
              <div className="flex items-center gap-1 mt-1">
                <Badge
                  variant={isAdmin ? "default" : "secondary"}
                  className={cn(
                    "text-xs",
                    isAdmin
                      ? "bg-red-100 text-red-800 border-red-200"
                      : "bg-blue-100 text-blue-800 border-blue-200"
                  )}
                >
                  {isAdmin ? (
                    <>
                      <Shield className="mr-1 h-2 w-2" />
                      {isMasterUser ? "Coordenador" : "Admin"}{" "}
                    </>
                  ) : (
                    "Professor"
                  )}
                </Badge>
              </div>
            </div>
          </div>

          {/* Botão de logout */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};
