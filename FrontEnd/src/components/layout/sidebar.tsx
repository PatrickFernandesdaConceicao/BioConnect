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
  userRole?: "ADMIN" | "COORDENADOR" | "PROFESSOR" | "ALUNO";
  userName?: string;
  userImage?: string;
}

export const Sidebar = ({
  userRole = "PROFESSOR",
  userName = "Usuário",
  userImage,
}: SidebarProps) => {
  const pathname = usePathname();

  const isAdmin = userRole === "ADMIN" || userRole === "COORDENADOR";

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-8">
          <div className="relative w-8 h-8 mr-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-full h-full text-white"
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
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "bg-white/10 text-white"
                  : "text-zinc-400"
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
              <div className="mt-6 mb-2 px-3">
                <h2 className="text-xs uppercase text-zinc-400 font-semibold">
                  Administração
                </h2>
              </div>
              {adminRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                    pathname === route.href
                      ? "bg-white/10 text-white"
                      : "text-zinc-400"
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
      <div className="px-3 py-2 border-t border-slate-700">
        <div className="flex items-center gap-x-4 pl-3 py-2">
          <Avatar>
            <AvatarImage src={userImage} />
            <AvatarFallback className="bg-sky-500">
              {userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{userName}</span>
            <span className="text-xs text-zinc-400">{userRole}</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto text-zinc-400">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
