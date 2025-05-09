import { Sidebar } from "@/components/layout/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { BellIcon, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mockado - seria preenchido com dados de autenticação reais
  const userInfo = {
    role: "COORDENADOR" as const,
    name: "Gabriel",
    image: "",
  };

  return (
    <div className="h-full relative">
      {/* Sidebar para desktop */}
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80">
        <Sidebar
          userRole={userInfo.role}
          userName={userInfo.name}
          userImage={userInfo.image}
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
            userRole={userInfo.role}
            userName={userInfo.name}
            userImage={userInfo.image}
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
  );
}
