"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp, useEventos } from "@/contexts/AppContext";
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
  Filter,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { format, isAfter, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";

// ===================================================================
// FUNÇÕES UTILITÁRIAS PARA KEYS ÚNICAS
// ===================================================================

/**
 * Gera uma key única para eventos, mesmo com IDs undefined
 */
const generateEventKey = (evento: any, index: number): string => {
  // Verificar se evento existe
  if (!evento) {
    return `evento-empty-${index}-${Date.now()}`;
  }

  // Usar ID se válido
  if (evento.id !== null && evento.id !== undefined && evento.id !== "") {
    return `evento-${evento.id}`;
  }

  // Fallback usando título + index
  if (evento.titulo && typeof evento.titulo === "string") {
    const titleSlug = evento.titulo
      .substring(0, 15)
      .replace(/[^a-zA-Z0-9]/g, "");
    return `evento-${titleSlug}-${index}`;
  }

  // Fallback usando data + index
  if (evento.dataInicio) {
    try {
      const dateSlug = new Date(evento.dataInicio).getTime();
      return `evento-${dateSlug}-${index}`;
    } catch (e) {
      // Se data for inválida, usar timestamp
    }
  }

  // Último recurso: timestamp + index + random
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `evento-fallback-${timestamp}-${index}-${random}`;
};

/**
 * Valida se um evento é válido para renderização
 */
const isValidEvento = (evento: any): boolean => {
  if (!evento || typeof evento !== "object") {
    return false;
  }

  // Pelo menos deve ter título ou curso
  return (
    (evento.titulo && evento.titulo.trim() !== "") ||
    (evento.curso && evento.curso.trim() !== "")
  );
};

export default function EventosPage() {
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [cursoFilter, setCursoFilter] = useState("todos");
  const [periodoFilter, setPeriodoFilter] = useState("todos");

  // CORREÇÃO: Usar useApp diretamente em vez de useEventos
  const appContext = useApp();

  // CORREÇÃO: Verificação robusta do contexto
  if (!appContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">
                  Contexto não disponível
                </h3>
                <p className="text-muted-foreground">
                  O contexto da aplicação não foi carregado
                </p>
              </div>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Recarregar Página
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // CORREÇÃO: Extrair dados do contexto principal com fallbacks seguros
  const {
    eventos = [],
    loading = { eventos: false },
    error = { eventos: null },
    fetchEventos,
    deleteEvento,
  } = appContext;

  // CORREÇÃO: Garantir que as funções existem
  const safeFetchEventos = fetchEventos || (() => Promise.resolve());
  const safeDeleteEvento = deleteEvento || (() => Promise.resolve());

  // Carregar eventos na inicialização
  useEffect(() => {
    const initializeEventos = async () => {
      if (!isInitialized && safeFetchEventos) {
        try {
          console.log("Inicializando eventos...");
          await safeFetchEventos();
          setIsInitialized(true);
        } catch (error) {
          console.error("Erro ao inicializar eventos:", error);
        }
      }
    };

    initializeEventos();
  }, [safeFetchEventos, isInitialized]);

  // CORREÇÃO: Filtro de eventos com validação robusta e memoização
  const filteredEventos = useMemo(() => {
    // Garantir que eventos seja sempre um array válido
    const eventosArray = Array.isArray(eventos) ? eventos : [];

    return eventosArray.filter((evento) => {
      // Verificação de segurança para cada evento
      if (!isValidEvento(evento)) {
        console.warn("Evento inválido removido da lista:", evento);
        return false;
      }

      const matchesSearch =
        (evento.titulo || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
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
  }, [eventos, searchTerm, cursoFilter, periodoFilter]);

  const handleDeleteEvento = async (id: number) => {
    if (!id || isNaN(id)) {
      toast.error("ID do evento inválido");
      return;
    }

    if (!safeDeleteEvento) {
      toast.error("Função de exclusão não disponível");
      return;
    }

    try {
      await safeDeleteEvento(id);
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
      case "EM_ANDAMENTO":
        return <Badge className="bg-blue-500">Em Andamento</Badge>;
      case "ENCERRADO":
        return <Badge className="bg-gray-500">Encerrado</Badge>;
      default:
        return <Badge className="bg-gray-500">Pendente</Badge>;
    }
  };

  // Estados de loading e erro - com verificações seguras
  const isLoading = loading?.eventos || false;
  const hasError = error?.eventos || null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-muted-foreground">Carregando eventos...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="text-center space-y-4">
        <div className="text-red-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-2" />
          <h2 className="text-lg font-semibold">Erro ao carregar eventos</h2>
          <p className="text-sm">{hasError}</p>
        </div>
        <div className="space-y-2">
          <Button onClick={safeFetchEventos}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Eventos</h1>
          <p className="text-muted-foreground">
            Gerencie eventos acadêmicos, seminários e atividades.
          </p>
        </div>
        {hasPermission("ADMIN") && (
          <Link href="/eventos/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Evento
            </Button>
          </Link>
        )}
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={cursoFilter} onValueChange={setCursoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os cursos</SelectItem>
                <SelectItem value="Análise e Desenvolvimento de Sistemas">
                  Análise e Desenvolvimento de Sistemas
                </SelectItem>
                <SelectItem value="Biotecnologia">Biotecnologia</SelectItem>
                <SelectItem value="Enfermagem">Enfermagem</SelectItem>
              </SelectContent>
            </Select>
            <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os períodos</SelectItem>
                <SelectItem value="proximos">Próximos</SelectItem>
                <SelectItem value="andamento">Em andamento</SelectItem>
                <SelectItem value="encerrados">Encerrados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Eventos */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos ({filteredEventos.length})</CardTitle>
          <CardDescription>
            Lista de todos os eventos cadastrados no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEventos.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum evento encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ||
                cursoFilter !== "todos" ||
                periodoFilter !== "todos"
                  ? "Tente ajustar os filtros para encontrar eventos."
                  : "Não há eventos cadastrados no momento."}
              </p>
              {hasPermission("ADMIN") && (
                <Link href="/eventos/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Evento
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Status</TableHead>
                  {hasPermission("ADMIN") && <TableHead>Orçamento</TableHead>}
                  <TableHead>Participantes</TableHead>
                  <TableHead className="w-[70px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEventos.filter(isValidEvento).map((evento, index) => {
                  // CORREÇÃO PRINCIPAL: Key única e robusta
                  const uniqueKey = generateEventKey(evento, index);

                  return (
                    <TableRow key={uniqueKey}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {evento?.titulo || "Título não informado"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {evento?.curso || "Curso não informado"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {evento?.dataInicio ? (
                            <>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                                {format(
                                  new Date(evento.dataInicio),
                                  "dd/MM/yyyy",
                                  {
                                    locale: ptBR,
                                  }
                                )}
                              </div>
                              {evento?.dataTermino && (
                                <div className="text-muted-foreground">
                                  até{" "}
                                  {format(
                                    new Date(evento.dataTermino),
                                    "dd/MM/yyyy",
                                    {
                                      locale: ptBR,
                                    }
                                  )}
                                </div>
                              )}
                            </>
                          ) : (
                            "Data não informada"
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                          {evento?.local || "Local não informado"}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(evento?.status)}</TableCell>
                      {hasPermission("ADMIN") && (
                        <TableCell>
                          <div className="text-sm">
                            <div className="text-muted-foreground">
                              Sol: R${" "}
                              {evento?.vlTotalSolicitado?.toLocaleString() ||
                                "0"}
                            </div>
                            <div className="text-muted-foreground">
                              Apr: R${" "}
                              {evento?.vlTotalAprovado?.toLocaleString() || "0"}
                            </div>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-muted-foreground mr-1" />
                          {evento?.participantes?.length || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/eventos/${evento.id || "novo"}`)
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>

                            {hasPermission("ADMIN") && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/eventos/${evento.id || "novo"}/edit`
                                    )
                                  }
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Excluir
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Confirmar exclusão
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja excluir o evento
                                        "{evento?.titulo || "sem título"}"? Esta
                                        ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancelar
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => {
                                          if (
                                            evento?.id &&
                                            !isNaN(Number(evento.id))
                                          ) {
                                            handleDeleteEvento(
                                              Number(evento.id)
                                            );
                                          } else {
                                            toast.error(
                                              "ID do evento inválido"
                                            );
                                          }
                                        }}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
