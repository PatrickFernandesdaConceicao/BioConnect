"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { BellIcon, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RouteGuard } from "@/components/RouteGuard";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Carregando BioConnect...</p>
        </div>
      </div>
    );
  }

  return (
    <RouteGuard>
      <div className="h-full relative">
        {/* Sidebar para desktop */}
        <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80">
          <Sidebar
            userRole={user?.tipo || "USER"}
            userName={user?.nome || "Usuário"}
            userImage=""
          />
        </div>

        {/* Mobile sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden fixed top-4 left-4 z-40"
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar
              userRole={user?.tipo || "USER"}
              userName={user?.nome || "Usuário"}
              userImage=""
            />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="md:pl-72 pb-10 h-full">
          {/* Top bar */}
          <div className="flex items-center p-4 border-b h-16 justify-between bg-background">
            <h1 className="font-semibold text-xl md:ml-2">BioConnect</h1>
            <div className="flex items-center gap-x-4">
              <Button size="icon" variant="ghost">
                <BellIcon className="h-5 w-5" />
              </Button>
              <ModeToggle />
            </div>
          </div>

          {/* Page content */}
          <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}
