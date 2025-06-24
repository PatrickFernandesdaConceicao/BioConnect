"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEventos } from "@/contexts/AppContext";
import { useAuth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function EventosPage() {
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  const eventosContext = useEventos();

  // Estados locais
  const [searchTerm, setSearchTerm] = useState("");
  const [cursoFilter, setCursoFilter] = useState("todos");
  const [periodoFilter, setPeriodoFilter] = useState("todos");
  const [isInitialized, setIsInitialized] = useState(false);

  // CORREÇÃO: Todos os hooks devem ser chamados antes de qualquer return condicional
  useEffect(() => {
    const initializeEventos = async () => {
      if (!isInitialized && eventosContext?.fetchEventos) {
        try {
          console.log("Inicializando eventos...");
          await eventosContext.fetchEventos();
          setIsInitialized(true);
        } catch (error) {
          console.error("Erro ao inicializar eventos:", error);
          // Não marcar como inicializado se houver erro
        }
      }
    };

    initializeEventos();
  }, [eventosContext, eventosContext?.fetchEventos, isInitialized]);

  // CORREÇÃO: Verificação do contexto APÓS todos os hooks
  if (!eventosContext) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-semibold">Contexto não disponível</h2>
          <p className="text-muted-foreground">
            O contexto da aplicação não foi inicializado corretamente.
          </p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Recarregar Página
          </Button>
        </div>
      </div>
    );
  }

  const { eventos, loading, error, fetchEventos, deleteEvento } =
    eventosContext;

  // CORREÇÃO: Garantir que eventos seja sempre um array
  const eventosArray = Array.isArray(eventos) ? eventos : [];

  const filteredEventos = eventosArray.filter((evento) => {
    // CORREÇÃO: Verificação de segurança para cada evento
    if (!evento || typeof evento !== "object") {
      console.warn("Evento inválido encontrado:", evento);
      return false;
    }

    const matchesSearch =
      (evento.titulo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evento.curso || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evento.local || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCurso =
      cursoFilter === "todos" || evento.curso === cursoFilter;

    const matchesPeriodo = (() => {
      if (periodoFilter === "todos") return true;

      if (!evento.dataInicio) return false;

      try {
        const hoje = new Date();
        const dataInicio = new Date(evento.dataInicio);

        switch (periodoFilter) {
          case "proximos":
            return isAfter(dataInicio, hoje);
          case "andamento":
            if (!evento.dataTermino) return false;
            const dataTermino = new Date(evento.dataTermino);
            return isBefore(dataInicio, hoje) && isAfter(dataTermino, hoje);
          case "encerrados":
            if (!evento.dataTermino) return false;
            return isBefore(new Date(evento.dataTermino), hoje);
          default:
            return true;
        }
      } catch (error) {
        console.error("Erro ao processar datas do evento:", evento.id, error);
        return false;
      }
    })();

    return matchesSearch && matchesCurso && matchesPeriodo;
  });

  const handleDeleteEvento = async (id: number) => {
    if (!id || isNaN(id)) {
      toast.error("ID do evento inválido");
      return;
    }

    try {
      await deleteEvento(id);
      toast.success("Evento excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      toast.error("Erro ao excluir evento");
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "APROVADO":
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case "PENDENTE":
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case "REJEITADO":
        return <Badge className="bg-red-500">Rejeitado</Badge>;
      default:
        return <Badge className="bg-gray-500">Pendente</Badge>;
    }
  };

  // Estado de loading
  if (loading || !isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-muted-foreground">Carregando eventos...</p>
        </div>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="text-center space-y-4">
        <div className="text-red-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-2" />
          <h2 className="text-lg font-semibold">Erro ao carregar eventos</h2>
          <p className="text-sm">{error}</p>
        </div>
        <div className="space-y-2">
          <Button onClick={fetchEventos}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
          <div className="text-xs text-muted-foreground">
            <p>Possíveis soluções:</p>
            <ul className="list-disc list-inside text-left max-w-md mx-auto">
              <li>Verificar se o backend está rodando na porta 8080</li>
              <li>Verificar conexão com a internet</li>
              <li>Fazer logout e login novamente</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Lista de cursos únicos para o filtro
  const cursosUnicos = Array.from(
    new Set(eventosArray.map((e) => e.curso).filter(Boolean))
  );

  return (
    <div className="space-y-6">
      {/* Continue com o resto do componente... */}
    </div>
  );
}
