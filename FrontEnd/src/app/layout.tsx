import { Inter as FontSans } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Sonner } from "@/components/ui/sonner";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <title>BioConnect - Sistema de Gestão de Pesquisa e Extensão</title>
        <meta
          name="description"
          content="Sistema de gestão para projetos acadêmicos, eventos e monitorias da Faculdade Biopark"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Sonner />
        </ThemeProvider>
      </body>
    </html>
  );
}
