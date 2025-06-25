import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/contexts/AppContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BioConnect - Sistema de Gestão Acadêmica",
  description:
    "Sistema integrado para gestão de projetos, eventos e monitorias acadêmicas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AppProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
              }}
            />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
