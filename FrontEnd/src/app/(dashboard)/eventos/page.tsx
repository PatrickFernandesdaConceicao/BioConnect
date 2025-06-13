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
} from "lucide-react";
import { toast } from "sonner";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function EventosPage() {
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  const { eventos, loading, error, fetchEventos, deleteEvento } = useEventos();

  const [searchTerm, setSearchTerm] = useState("");
  const [cursoFilter, setCursoFilter] = useState("todos");
  const [periodoFilter, setPeriodoFilter] = useState("todos");

  useEffect(() => {
    fetchEventos();
  }, []);

  const filteredEventos = eventos.filter((evento) => {
    const matchesSearch =
      evento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.local.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCurso =
      cursoFilter === "todos" || evento.curso.includes(cursoFilter);

    const today = new Date();
    let matchesPeriodo = true;

    if (periodoFilter === "proximos") {
      matchesPeriodo = isAfter(new Date(evento.dataInicio), today);
    } else if (periodoFilter === "em_andamento") {
      matchesPeriodo =
        isBefore(new Date(evento.dataInicio), today) &&
        isAfter(new Date(evento.dataTermino), today);
    } else if (periodoFilter === "concluidos") {
      matchesPeriodo = isBefore(new Date(evento.dataTermino), today);
    }

    return matchesSearch && matchesCurso && matchesPeriodo;
  });

  const getEventoStatus = (dataInicio: string, dataTermino: string) => {
    const today = new Date();
    const inicio = new Date(dataInicio);
    const termino = new Date(dataTermino);

    if (isAfter(inicio, today)) {
      return { label: "Próximo", variant: "secondary" as const };
    } else if (isBefore(inicio, today) && isAfter(termino, today)) {
      return { label: "Em Andamento", variant: "default" as const };
    } else if (isBefore(termino, today)) {
      return { label: "Concluído", variant: "outline" as const };
    }
    return { label: "Indefinido", variant: "secondary" as const };
  };

  const handleDeleteEvento = async (id: number, titulo: string) => {
    try {
      await deleteEvento(id);
      toast.success(`Evento "${titulo}" deletado com sucesso!`);
    } catch (error) {
      toast.error("Erro ao deletar evento");
    }
  };

  const cursosDisponiveis = [...new Set(eventos.map((e) => e.curso))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">
            Carregando eventos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Erro ao carregar eventos
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchEventos}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  const eventosProximos = eventos.filter((e) =>
    isAfter(new Date(e.dataInicio), new Date())
  );
  const eventosEmAndamento = eventos.filter(
    (e) =>
      isBefore(new Date(e.dataInicio), new Date()) &&
      isAfter(new Date(e.dataTermino), new Date())
  );
  const eventosConcluidos = eventos.filter((e) =>
    isBefore(new Date(e.dataTermino), new Date())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Eventos</h1>
          <p className="text-muted-foreground">
            Gerencie eventos acadêmicos e institucionais
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

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Eventos
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventosProximos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {eventosEmAndamento.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Orçamento Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R${" "}
              {eventos
                .reduce((acc, e) => acc + (e.vlTotalSolicitado || 0), 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Select value={cursoFilter} onValueChange={setCursoFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Cursos</SelectItem>
                {cursosDisponiveis.map((curso) => (
                  <SelectItem key={curso} value={curso}>
                    {curso}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Períodos</SelectItem>
                <SelectItem value="proximos">Próximos</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluidos">Concluídos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de eventos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Eventos</CardTitle>
          <CardDescription>
            {filteredEventos.length} evento(s) encontrado(s)
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
                  ? "Tente ajustar os filtros."
                  : "Nenhum evento cadastrado ainda."}
              </p>
              {hasPermission("ADMIN") && (
                <Link href="/eventos/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Evento
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Data Início</TableHead>
                    <TableHead>Data Término</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Orçamento</TableHead>
                    <TableHead>Participantes</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEventos.map((evento) => {
                    const status = getEventoStatus(
                      evento.dataInicio,
                      evento.dataTermino
                    );
                    return (
                      <TableRow key={evento.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{evento.titulo}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {evento.justificativa}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{evento.curso}</Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(evento.dataInicio), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </TableCell>
                        <TableCell>
                          {format(new Date(evento.dataTermino), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                            {evento.local}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>
                              Sol: R${" "}
                              {evento.vlTotalSolicitado?.toLocaleString() ||
                                "0"}
                            </div>
                            <div className="text-muted-foreground">
                              Apr: R${" "}
                              {evento.vlTotalAprovado?.toLocaleString() || "0"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-muted-foreground mr-1" />
                            {evento.participantes?.length || 0}
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
                                onClick={() =>
                                  router.push(`/eventos/${evento.id}`)
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                              {hasPermission("ADMIN") && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(`/eventos/${evento.id}/edit`)
                                    }
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
                                        Deletar
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Confirmar Exclusão
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Tem certeza que deseja deletar o
                                          evento "{evento.titulo}"? Esta ação
                                          não pode ser desfeita.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancelar
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDeleteEvento(
                                              evento.id,
                                              evento.titulo
                                            )
                                          }
                                          className="bg-destructive hover:bg-destructive/90"
                                        >
                                          Deletar
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
