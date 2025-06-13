"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMonitorias, useMasterData } from "@/contexts/AppContext";
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
  BookOpen,
  Clock,
  DollarSign,
  GraduationCap,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { format, isAfter, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function MonitoriasPage() {
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  const { monitorias, loading, error, fetchMonitorias, deleteMonitoria } =
    useMonitorias();
  const { cursos, disciplinas, fetchMasterData } = useMasterData();

  const [searchTerm, setSearchTerm] = useState("");
  const [cursoFilter, setCursoFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [bolsaFilter, setBolsaFilter] = useState("todos");

  useEffect(() => {
    fetchMonitorias();
    fetchMasterData();
  }, []);

  // Filtrar monitorias
  const filteredMonitorias = monitorias.filter((monitoria) => {
    const matchesSearch =
      monitoria.disciplinaNome
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      monitoria.cursoNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      monitoria.sala?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCurso =
      cursoFilter === "todos" || monitoria.cursoId.toString() === cursoFilter;
    const matchesBolsa =
      bolsaFilter === "todos" ||
      (bolsaFilter === "com_bolsa" && monitoria.bolsa) ||
      (bolsaFilter === "sem_bolsa" && !monitoria.bolsa);

    // Status baseado nas datas
    const today = new Date();
    let matchesStatus = true;

    if (statusFilter === "abertas") {
      matchesStatus = isAfter(new Date(monitoria.dataInicio), today);
    } else if (statusFilter === "em_andamento") {
      matchesStatus =
        isBefore(new Date(monitoria.dataInicio), today) &&
        isAfter(new Date(monitoria.dataTermino), today);
    } else if (statusFilter === "encerradas") {
      matchesStatus = isBefore(new Date(monitoria.dataTermino), today);
    }

    return matchesSearch && matchesCurso && matchesStatus && matchesBolsa;
  });

  // Obter status da monitoria baseado nas datas
  const getMonitoriaStatus = (dataInicio: string, dataTermino: string) => {
    const today = new Date();
    const inicio = new Date(dataInicio);
    const termino = new Date(dataTermino);

    if (isAfter(inicio, today)) {
      return { label: "Aberta", variant: "secondary" as const };
    } else if (isBefore(inicio, today) && isAfter(termino, today)) {
      return { label: "Em Andamento", variant: "default" as const };
    } else if (isBefore(termino, today)) {
      return { label: "Encerrada", variant: "outline" as const };
    }
    return { label: "Indefinido", variant: "secondary" as const };
  };

  // Formatar dias da semana
  const formatDiasSemana = (dias: string[]) => {
    const diasMap: Record<string, string> = {
      DOMINGO: "Dom",
      SEGUNDA: "Seg",
      TERCA: "Ter",
      QUARTA: "Qua",
      QUINTA: "Qui",
      SEXTA: "Sex",
      SABADO: "Sáb",
    };

    return dias.map((dia) => diasMap[dia] || dia).join(", ");
  };

  // Deletar monitoria
  const handleDeleteMonitoria = async (id: number, disciplina: string) => {
    try {
      await deleteMonitoria(id);
      toast.success(`Monitoria de "${disciplina}" deletada com sucesso!`);
    } catch (error) {
      toast.error("Erro ao deletar monitoria");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">
            Carregando monitorias...
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
            Erro ao carregar monitorias
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchMonitorias}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  const monitoriasAbertas = monitorias.filter((m) =>
    isAfter(new Date(m.dataInicio), new Date())
  );
  const monitoriasEmAndamento = monitorias.filter(
    (m) =>
      isBefore(new Date(m.dataInicio), new Date()) &&
      isAfter(new Date(m.dataTermino), new Date())
  );
  const monitoriasComBolsa = monitorias.filter((m) => m.bolsa);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Monitorias</h1>
          <p className="text-muted-foreground">
            Gerencie monitorias acadêmicas e oportunidades de ensino
          </p>
        </div>
        <Link href="/monitorias/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Monitoria
          </Button>
        </Link>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Monitorias
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monitorias.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abertas</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monitoriasAbertas.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monitoriasEmAndamento.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Bolsa</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monitoriasComBolsa.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Total: R${" "}
              {monitoriasComBolsa
                .reduce((acc, m) => acc + (m.valorBolsa || 0), 0)
                .toLocaleString()}
            </p>
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
                  placeholder="Buscar monitorias..."
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
                {cursos.map((curso) => (
                  <SelectItem key={curso.id} value={curso.id.toString()}>
                    {curso.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="abertas">Abertas</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="encerradas">Encerradas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={bolsaFilter} onValueChange={setBolsaFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Bolsa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="com_bolsa">Com Bolsa</SelectItem>
                <SelectItem value="sem_bolsa">Sem Bolsa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de monitorias */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Monitorias</CardTitle>
          <CardDescription>
            {filteredMonitorias.length} monitoria(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredMonitorias.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhuma monitoria encontrada
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ||
                cursoFilter !== "todos" ||
                statusFilter !== "todos" ||
                bolsaFilter !== "todos"
                  ? "Tente ajustar os filtros."
                  : "Nenhuma monitoria cadastrada ainda."}
              </p>
              <Link href="/monitorias/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Monitoria
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Semestre</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Dias</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bolsa</TableHead>
                    <TableHead>Sala</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMonitorias.map((monitoria) => {
                    const status = getMonitoriaStatus(
                      monitoria.dataInicio,
                      monitoria.dataTermino
                    );
                    return (
                      <TableRow key={monitoria.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {monitoria.disciplinaNome}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {monitoria.cargaHoraria}h - CH
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{monitoria.cursoNome}</Badge>
                        </TableCell>
                        <TableCell>{monitoria.semestre}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>
                              {monitoria.horarioInicio} -{" "}
                              {monitoria.horarioTermino}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDiasSemana(monitoria.diasSemana)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          {monitoria.bolsa ? (
                            <div>
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800"
                              >
                                Com Bolsa
                              </Badge>
                              {monitoria.valorBolsa && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  R$ {monitoria.valorBolsa.toLocaleString()}
                                </div>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline">Sem Bolsa</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {monitoria.sala ? (
                            <div className="text-sm">{monitoria.sala}</div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Não definida
                            </span>
                          )}
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
                                  router.push(`/monitorias/${monitoria.id}`)
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/monitorias/${monitoria.id}/edit`
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
                                      Tem certeza que deseja deletar a monitoria
                                      de "{monitoria.disciplinaNome}"? Esta ação
                                      não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteMonitoria(
                                          monitoria.id,
                                          monitoria.disciplinaNome ||
                                            "disciplina"
                                        )
                                      }
                                      className="bg-destructive hover:bg-destructive/90"
                                    >
                                      Deletar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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
