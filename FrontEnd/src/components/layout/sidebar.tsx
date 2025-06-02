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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/theme-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { logout } from "@/lib/auth";
import { toast } from "sonner";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Projetos",
    icon: FileText,
    href: "/projetos",
    color: "text-violet-500",
  },
  {
    label: "Eventos",
    icon: Calendar,
    href: "/eventos",
    color: "text-pink-700",
  },
  {
    label: "Monitorias",
    icon: BookOpen,
    href: "/monitorias",
    color: "text-orange-500",
  },
  {
    label: "Relatórios",
    icon: BarChart,
    href: "/relatorios",
    color: "text-emerald-500",
  },
];

// Rotas administrativas que só são mostradas para Admin e Coordenadores
const adminRoutes = [
  {
    label: "Usuários",
    icon: Users,
    href: "/usuarios",
    color: "text-blue-500",
  },
  {
    label: "Configurações",
    icon: Settings,
    href: "/configuracoes",
    color: "text-gray-500",
  },
];

interface SidebarProps {
  userRole?: "ADMIN" | "USER";
  userName?: string;
  userImage?: string;
}

export const Sidebar = ({
  userRole = "USER",
  userName = "Usuário",
  userImage,
}: SidebarProps) => {
  const pathname = usePathname();
  const { theme } = useTheme();

  // Determine if dark mode is active based on theme value
  const isDarkMode = theme === "dark";
  const isAdmin = userRole === "ADMIN";

  const handleLogout = () => {
    try {
      logout();
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro no logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <div
      className={cn(
        "space-y-4 py-4 flex flex-col h-full border-r-2",
        isDarkMode ? "bg-background text-white" : "bg-white text-slate-900"
      )}
    >
      <div className="px-3 py-2 flex-1">
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
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition",
                pathname === route.href
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

          {isAdmin && (
            <>
              <div
                className={cn(
                  "mt-6 mb-2 px-3",
                  isDarkMode ? "text-zinc-400" : "text-slate-500"
                )}
              >
                <h2 className="text-xs uppercase font-semibold">
                  Administração
                </h2>
              </div>
              {adminRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition",
                    pathname === route.href
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
            </>
          )}
        </div>
      </div>
      <div
        className={cn(
          "px-3 py-2 border-t",
          isDarkMode ? "border-gray-800" : "border-slate-200"
        )}
      >
        <div className="flex items-center gap-x-4 pl-3 py-1">
          <Avatar>
            <AvatarImage src={userImage} />
            <AvatarFallback className="bg-sky-500">
              {userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{userName}</span>
          {/* <div className="flex flex-col">
            <span className="text-sm font-medium">{userName}</span>
            <span
              className={
                isDarkMode ? "text-xs text-zinc-400" : "text-xs text-slate-500"
              }
            >
              {userRole}
            </span>
          </div> */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "ml-auto",
              isDarkMode
                ? "text-zinc-400 hover:text-white"
                : "text-slate-500 hover:text-slate-900"
            )}
            onClick={handleLogout}
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
