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

  // CORREÇÃO: Verificação segura do contexto
  const eventosContext = useEventos();

  // Estados locais
  const [searchTerm, setSearchTerm] = useState("");
  const [cursoFilter, setCursoFilter] = useState("todos");
  const [periodoFilter, setPeriodoFilter] = useState("todos");
  const [isInitialized, setIsInitialized] = useState(false);

  // CORREÇÃO: Verificar se o contexto está disponível
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

  // Carregar eventos na inicialização
  useEffect(() => {
    const initializeEventos = async () => {
      if (!isInitialized) {
        try {
          console.log("Inicializando eventos...");
          await fetchEventos();
          setIsInitialized(true);
        } catch (error) {
          console.error("Erro ao inicializar eventos:", error);
          // Não marcar como inicializado se houver erro
        }
      }
    };

    initializeEventos();
  }, [fetchEventos, isInitialized]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Eventos</h1>
          <p className="text-muted-foreground">
            Gerencie os eventos acadêmicos da instituição ({eventosArray.length}{" "}
            eventos)
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
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre os eventos por título, curso, local ou período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Título, curso ou local..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Curso</label>
              <Select value={cursoFilter} onValueChange={setCursoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os cursos</SelectItem>
                  <SelectItem value="Análise e Desenvolvimento de Sistemas">
                    ADS
                  </SelectItem>
                  <SelectItem value="Biotecnologia">Biotecnologia</SelectItem>
                  <SelectItem value="Enfermagem">Enfermagem</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os períodos</SelectItem>
                  <SelectItem value="proximos">Próximos</SelectItem>
                  <SelectItem value="andamento">Em andamento</SelectItem>
                  <SelectItem value="encerrados">Encerrados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Eventos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Eventos ({filteredEventos.length})</CardTitle>
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
                {/* CORREÇÃO: Chave única robusta e verificações de segurança */}
                {filteredEventos.map((evento, index) => {
                  // Garantir ID único para cada linha
                  const eventoId = evento?.id ?? `temp-${index}`;
                  const uniqueKey = `evento-row-${eventoId}-${
                    evento?.titulo?.substring(0, 10) || "sem-titulo"
                  }`;

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
                            <span className="text-muted-foreground">
                              Data não informada
                            </span>
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
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                if (evento?.id && !isNaN(evento.id)) {
                                  router.push(`/eventos/${evento.id}`);
                                } else {
                                  toast.error("ID do evento não encontrado");
                                }
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            {hasPermission("ADMIN") && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (evento?.id && !isNaN(evento.id)) {
                                      router.push(`/eventos/${evento.id}/edit`);
                                    } else {
                                      toast.error(
                                        "ID do evento não encontrado"
                                      );
                                    }
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      className="text-destructive"
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
                                        Tem certeza que deseja excluir o evento{" "}
                                        <strong>
                                          "{evento?.titulo || "este evento"}"
                                        </strong>
                                        ? Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancelar
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => {
                                          if (evento?.id && !isNaN(evento.id)) {
                                            handleDeleteEvento(evento.id);
                                          } else {
                                            toast.error(
                                              "ID do evento não encontrado"
                                            );
                                          }
                                        }}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
