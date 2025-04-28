// app/(dashboard)/projetos/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  FileText,
  MoreVertical,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dados fictícios de projetos para demonstração
const mockProjects = [
  {
    id: "1",
    title: "Análise de Bioinformática em Genomas Bacterianos",
    description:
      "Estudo comparativo de genomas bacterianos utilizando técnicas avançadas de bioinformática.",
    area: "Biotecnologia",
    status: "APROVADO",
    startDate: "2025-03-15",
    endDate: "2025-09-15",
    createdBy: "Prof. Ana Silva",
    participantsCount: 4,
    hasBudget: true,
    budget: 5000.0,
  },
  {
    id: "2",
    title: "IoT em Automação Laboratorial",
    description:
      "Implementação de tecnologias IoT para automação de procedimentos laboratoriais.",
    area: "Informação",
    status: "EM_ANDAMENTO",
    startDate: "2025-03-01",
    endDate: "2025-08-01",
    createdBy: "Prof. Carlos Mendes",
    participantsCount: 5,
    hasBudget: true,
    budget: 7500.0,
  },
  {
    id: "3",
    title: "Inteligência Artificial na Saúde",
    description:
      "Aplicação de algoritmos de IA para auxiliar no diagnóstico precoce de doenças.",
    area: "Saúde",
    status: "CONCLUIDO",
    startDate: "2025-02-20",
    endDate: "2025-03-20",
    createdBy: "Prof. Maria Oliveira",
    participantsCount: 3,
    hasBudget: false,
    budget: null,
  },
  {
    id: "4",
    title: "Desenvolvimento de Biomateriais",
    description:
      "Pesquisa e desenvolvimento de biomateriais sustentáveis para aplicações médicas.",
    area: "Biotecnologia",
    status: "PENDENTE",
    startDate: null,
    endDate: null,
    createdBy: "Prof. João Santos",
    participantsCount: 0,
    hasBudget: true,
    budget: 12000.0,
  },
  {
    id: "5",
    title: "Realidade Aumentada no Ensino",
    description:
      "Uso de realidade aumentada como ferramenta pedagógica em cursos de ciências.",
    area: "Educação",
    status: "REJEITADO",
    startDate: null,
    endDate: null,
    createdBy: "Prof. Luciana Costa",
    participantsCount: 0,
    hasBudget: false,
    budget: null,
  },
  {
    id: "6",
    title: "Algoritmos Genéticos para Otimização",
    description:
      "Estudo de algoritmos genéticos para otimização de processos industriais.",
    area: "Informação",
    status: "APROVADO",
    startDate: "2025-04-01",
    endDate: "2025-10-01",
    createdBy: "Prof. Ricardo Lima",
    participantsCount: 2,
    hasBudget: true,
    budget: 3500.0,
  },
];

// Componente para exibir o status do projeto com cores adequadas
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
      icon: <Users className="mr-1 h-3 w-3" />,
    },
    CONCLUIDO: {
      bg: "bg-purple-500",
      icon: <CheckCircle className="mr-1 h-3 w-3" />,
    },
    CANCELADO: {
      bg: "bg-gray-500",
      icon: <AlertCircle className="mr-1 h-3 w-3" />,
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

export default function ProjetosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [view, setView] = useState("cards");

  // Filtrar projetos com base nos critérios
  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || project.status === statusFilter;
    const matchesArea = !areaFilter || project.area === areaFilter;

    return matchesSearch && matchesStatus && matchesArea;
  });

  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return "Não definida";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie seus projetos de pesquisa e extensão
          </p>
        </div>
        <Link href="/projetos/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </Link>
      </div>

      {/* Filtros e Pesquisa */}
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar projetos..."
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
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="PENDENTE">Pendente</SelectItem>
            <SelectItem value="APROVADO">Aprovado</SelectItem>
            <SelectItem value="REJEITADO">Rejeitado</SelectItem>
            <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
            <SelectItem value="CONCLUIDO">Concluído</SelectItem>
            <SelectItem value="CANCELADO">Cancelado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            <SelectItem value="Biotecnologia">Biotecnologia</SelectItem>
            <SelectItem value="Saúde">Saúde</SelectItem>
            <SelectItem value="Informação">Informação</SelectItem>
            <SelectItem value="Educação">Educação</SelectItem>
            <SelectItem value="Administração">Administração</SelectItem>
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
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
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
                          href={`/projetos/${project.id}`}
                          className="flex w-full"
                        >
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="mt-1">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Badge variant="outline" className="mr-2">
                      {project.area}
                    </Badge>
                    <StatusBadge status={project.status} />
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>
                      {formatDate(project.startDate)}
                      {project.endDate
                        ? ` até ${formatDate(project.endDate)}`
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{project.participantsCount} participantes</span>
                  </div>
                  {project.hasBudget && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="font-medium">Orçamento:</span>
                      <span className="ml-2">
                        R${" "}
                        {project.budget.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm text-muted-foreground">
                    Criado por: {project.createdBy}
                  </span>
                  <Link href={`/projetos/${project.id}`}>
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
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-2 text-left font-medium">Título</th>
                <th className="p-2 text-left font-medium">Área</th>
                <th className="p-2 text-left font-medium">Status</th>
                <th className="p-2 text-left font-medium">Data Início</th>
                <th className="p-2 text-left font-medium">Participantes</th>
                <th className="p-2 text-left font-medium">Orçamento</th>
                <th className="p-2 text-left font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project, index) => (
                <tr
                  key={project.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                >
                  <td className="p-2">
                    <div>
                      <div className="font-medium">{project.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {project.description.length > 60
                          ? `${project.description.substring(0, 60)}...`
                          : project.description}
                      </div>
                    </div>
                  </td>
                  <td className="p-2">
                    <Badge variant="outline">{project.area}</Badge>
                  </td>
                  <td className="p-2">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="p-2">{formatDate(project.startDate)}</td>
                  <td className="p-2">
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                      {project.participantsCount}
                    </div>
                  </td>
                  <td className="p-2">
                    {project.hasBudget
                      ? `R$ ${project.budget.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}`
                      : "Não"}
                  </td>
                  <td className="p-2">
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
                            href={`/projetos/${project.id}`}
                            className="flex w-full"
                          >
                            Ver detalhes
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mensagem quando não há projetos */}
      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Nenhum projeto encontrado</h3>
          <p className="text-muted-foreground mt-1">
            Não encontramos projetos que correspondam aos seus critérios de
            busca.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
              setAreaFilter("");
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
