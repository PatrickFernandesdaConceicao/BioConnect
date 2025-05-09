// app/(dashboard)/monitorias/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  BookOpen,
  MoreVertical,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  GraduationCap,
  School,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Dados fictícios de monitorias para demonstração
const mockMonitorias = [
  {
    id: "1",
    disciplina: "Algoritmos e Estruturas de Dados",
    curso: "Análise e Desenvolvimento de Sistemas",
    professor: "Prof. Carlos Mendes",
    monitor: "João Silva",
    status: "EM_ANDAMENTO",
    semestre: "2025/1",
    cargaHoraria: 20,
    startDate: "2025-03-10",
    endDate: "2025-06-30",
    horarios: "Segunda e Quarta, 14h às 16h",
  },
  {
    id: "2",
    disciplina: "Bioquímica Celular",
    curso: "Biotecnologia",
    professor: "Profa. Ana Oliveira",
    monitor: null,
    status: "PENDENTE",
    semestre: "2025/1",
    cargaHoraria: 15,
    startDate: "2025-03-15",
    endDate: "2025-06-30",
    horarios: "Terça e Quinta, 10h às 12h",
  },
  {
    id: "3",
    disciplina: "Anatomia Humana",
    curso: "Enfermagem",
    professor: "Prof. Ricardo Santos",
    monitor: "Mariana Costa",
    status: "APROVADO",
    semestre: "2025/1",
    cargaHoraria: 30,
    startDate: "2025-03-20",
    endDate: "2025-07-10",
    horarios: "Segunda, Quarta e Sexta, 8h às 10h",
  },
  {
    id: "4",
    disciplina: "Cálculo I",
    curso: "Engenharia",
    professor: "Prof. Paulo Martins",
    monitor: "Pedro Almeida",
    status: "EM_ANDAMENTO",
    semestre: "2025/1",
    cargaHoraria: 20,
    startDate: "2025-02-20",
    endDate: "2025-06-20",
    horarios: "Terça e Quinta, 16h às 18h",
  },
  {
    id: "5",
    disciplina: "Programação Web",
    curso: "Análise e Desenvolvimento de Sistemas",
    professor: "Profa. Luciana Ferreira",
    monitor: null,
    status: "REJEITADO",
    semestre: "2025/1",
    cargaHoraria: 15,
    startDate: null,
    endDate: null,
    horarios: "A definir",
  },
  {
    id: "6",
    disciplina: "Microbiologia",
    curso: "Biotecnologia",
    professor: "Prof. José Carvalho",
    monitor: "Juliana Lopes",
    status: "CONCLUIDO",
    semestre: "2024/2",
    cargaHoraria: 20,
    startDate: "2024-09-15",
    endDate: "2024-12-20",
    horarios: "Segunda e Quarta, 14h às 16h",
  },
];

// Componente para exibir o status da monitoria com cores adequadas
const StatusBadge = ({ status }) => {
  const statusMap = {
    PENDENTE: { bg: "bg-yellow-500", icon: <Clock className="mr-1 h-3 w-3" /> },
    APROVADO: {
      bg: "bg-green-500",
      icon: <CheckCircle className="mr-1 h-3 w-3" />,
    },
    REJEITADO: { bg: "bg-red-500", icon: <XCircle className="mr-1 h-3 w-3" /> },
    EM_ANDAMENTO: {
      bg: "bg-blue-500",
      icon: <BookOpen className="mr-1 h-3 w-3" />,
    },
    CONCLUIDO: {
      bg: "bg-purple-500",
      icon: <CheckCircle className="mr-1 h-3 w-3" />,
    },
    CANCELADO: {
      bg: "bg-gray-500",
      icon: <XCircle className="mr-1 h-3 w-3" />,
    },
  };

  const { bg, icon } = statusMap[status] || statusMap.PENDENTE;

  return (
    <Badge className={bg}>
      {icon}
      {status.replace("_", " ")}
    </Badge>
  );
};

export default function MonitoriasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cursoFilter, setCursoFilter] = useState("");
  const [view, setView] = useState("cards");

  // Extrair lista de cursos únicos para o filtro
  const cursos = [...new Set(mockMonitorias.map((m) => m.curso))];

  // Filtrar monitorias com base nos critérios
  const filteredMonitorias = mockMonitorias.filter((monitoria) => {
    const matchesSearch =
      monitoria.disciplina.toLowerCase().includes(searchTerm.toLowerCase()) ||
      monitoria.professor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (monitoria.monitor &&
        monitoria.monitor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      !statusFilter ||
      statusFilter === "all" ||
      monitoria.status === statusFilter;
    const matchesCurso =
      !cursoFilter || cursoFilter === "all" || monitoria.curso === cursoFilter;

    return matchesSearch && matchesStatus && matchesCurso;
  });

  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return "A definir";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Monitorias</h1>
          <p className="text-muted-foreground">
            Gerencie as monitorias acadêmicas
          </p>
        </div>
        <Link href="/monitorias/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Monitoria
          </Button>
        </Link>
      </div>

      {/* Filtros e Pesquisa */}
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar monitorias..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="PENDENTE">Pendente</SelectItem>
            <SelectItem value="APROVADO">Aprovado</SelectItem>
            <SelectItem value="REJEITADO">Rejeitado</SelectItem>
            <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
            <SelectItem value="CONCLUIDO">Concluído</SelectItem>
            <SelectItem value="CANCELADO">Cancelado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={cursoFilter} onValueChange={setCursoFilter}>
          <SelectTrigger className="w-full md:w-[280px]">
            <SelectValue placeholder="Curso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {cursos.map((curso) => (
              <SelectItem key={curso} value={curso}>
                {curso}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex border rounded-md">
          <Button
            variant={view === "cards" ? "default" : "ghost"}
            size="sm"
            className="rounded-r-none"
            onClick={() => setView("cards")}
          >
            Cards
          </Button>
          <Button
            variant={view === "table" ? "default" : "ghost"}
            size="sm"
            className="rounded-l-none"
            onClick={() => setView("table")}
          >
            Tabela
          </Button>
        </div>
      </div>

      {/* Visualização por Cards */}
      {view === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMonitorias.map((monitoria) => (
            <Card key={monitoria.id} className="hover:shadow-md transition">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {monitoria.disciplina}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Link
                          href={`/monitorias/${monitoria.id}`}
                          className="flex w-full"
                        >
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {!monitoria.monitor && (
                        <DropdownMenuItem>Candidatar-se</DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600">
                        Cancelar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="mt-1">
                  <div className="flex items-center">
                    <School className="mr-2 h-4 w-4 text-muted-foreground" />
                    {monitoria.curso}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={monitoria.status} />
                    <Badge variant="outline">{monitoria.semestre}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="mr-2 h-4 w-4" />
                    <span>Professor: {monitoria.professor}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    <span>Monitor: {monitoria.monitor || "Não definido"}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>
                      {formatDate(monitoria.startDate)} até{" "}
                      {formatDate(monitoria.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{monitoria.horarios}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm text-muted-foreground">
                    {monitoria.cargaHoraria}h semanais
                  </span>
                  <Link href={`/monitorias/${monitoria.id}`}>
                    <Button variant="ghost" size="sm">
                      Ver
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Visualização por Tabela */}
      {view === "table" && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Disciplina</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Professor</TableHead>
                <TableHead>Monitor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMonitorias.map((monitoria) => (
                <TableRow key={monitoria.id}>
                  <TableCell className="font-medium">
                    {monitoria.disciplina}
                  </TableCell>
                  <TableCell>{monitoria.curso}</TableCell>
                  <TableCell>{monitoria.professor}</TableCell>
                  <TableCell>
                    {monitoria.monitor || (
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700"
                      >
                        Vaga aberta
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={monitoria.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{monitoria.semestre}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(monitoria.startDate)} -{" "}
                        {formatDate(monitoria.endDate)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Link
                            href={`/monitorias/${monitoria.id}`}
                            className="flex w-full"
                          >
                            Ver detalhes
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {!monitoria.monitor && (
                          <DropdownMenuItem>Candidatar-se</DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          Cancelar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Mensagem quando não há monitorias */}
      {filteredMonitorias.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Nenhuma monitoria encontrada</h3>
          <p className="text-muted-foreground mt-1">
            Não encontramos monitorias que correspondam aos seus critérios de
            busca.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
              setCursoFilter("");
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
