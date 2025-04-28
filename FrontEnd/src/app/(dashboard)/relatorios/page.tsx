// app/(dashboard)/relatorios/page.tsx
"use client";

import { useState } from "react";
import {
  BarChart as BarChartIcon,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as PieChartComponent,
  Pie,
  LineChart,
  Line,
  Cell,
} from "recharts";
import {
  Download,
  Filter,
  FileText,
  Calendar,
  BookOpen,
  ChevronDown,
  BarChart,
  PieChart,
  TrendingUp,
  Users,
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dados fictícios para os gráficos
const projetosPorMes = [
  { name: "Jan", projetos: 4 },
  { name: "Fev", projetos: 3 },
  { name: "Mar", projetos: 5 },
  { name: "Abr", projetos: 7 },
  { name: "Mai", projetos: 2 },
  { name: "Jun", projetos: 6 },
  { name: "Jul", projetos: 4 },
  { name: "Ago", projetos: 5 },
  { name: "Set", projetos: 8 },
  { name: "Out", projetos: 6 },
  { name: "Nov", projetos: 4 },
  { name: "Dez", projetos: 3 },
];

const eventosPorMes = [
  { name: "Jan", eventos: 2 },
  { name: "Fev", eventos: 4 },
  { name: "Mar", eventos: 3 },
  { name: "Abr", eventos: 5 },
  { name: "Mai", eventos: 1 },
  { name: "Jun", eventos: 3 },
  { name: "Jul", eventos: 2 },
  { name: "Ago", eventos: 4 },
  { name: "Set", eventos: 6 },
  { name: "Out", eventos: 3 },
  { name: "Nov", eventos: 2 },
  { name: "Dez", eventos: 1 },
];

const monitoriasPorMes = [
  { name: "Jan", monitorias: 5 },
  { name: "Fev", monitorias: 7 },
  { name: "Mar", monitorias: 8 },
  { name: "Abr", monitorias: 6 },
  { name: "Mai", monitorias: 4 },
  { name: "Jun", monitorias: 5 },
  { name: "Jul", monitorias: 3 },
  { name: "Ago", monitorias: 6 },
  { name: "Set", monitorias: 9 },
  { name: "Out", monitorias: 7 },
  { name: "Nov", monitorias: 5 },
  { name: "Dez", monitorias: 4 },
];

const distribuicaoPorStatus = [
  { name: "Pendente", value: 15 },
  { name: "Aprovado", value: 25 },
  { name: "Em Andamento", value: 40 },
  { name: "Concluído", value: 20 },
  { name: "Rejeitado", value: 5 },
];

const distribuicaoPorArea = [
  { name: "Biotecnologia", value: 35 },
  { name: "Saúde", value: 25 },
  { name: "Informação", value: 20 },
  { name: "Administração", value: 10 },
  { name: "Educação", value: 10 },
];

const participacaoPorEvento = [
  { name: "Simpósio de Biotecnologia", inscritos: 45, presentes: 38 },
  { name: "Workshop de IA", inscritos: 30, presentes: 25 },
  { name: "Palestra: Biologia Molecular", inscritos: 60, presentes: 45 },
  { name: "Hackathon", inscritos: 50, presentes: 48 },
  { name: "Feira de Carreiras", inscritos: 120, presentes: 95 },
];

// Atividades recentes (últimos 6 meses)
const atividadesRecentes = [
  {
    id: "1",
    tipo: "projeto",
    titulo: "Bioinformática Aplicada",
    status: "Em andamento",
    data: "15/03/2025",
    responsavel: "Prof. Ana Silva",
  },
  {
    id: "2",
    tipo: "evento",
    titulo: "Simpósio de Biotecnologia",
    status: "Concluído",
    data: "30/04/2025",
    responsavel: "Prof. Carlos Mendes",
  },
  {
    id: "3",
    tipo: "monitoria",
    titulo: "Algoritmos e Estruturas de Dados",
    status: "Em andamento",
    data: "10/03/2025",
    responsavel: "Prof. Carlos Mendes",
  },
  {
    id: "4",
    tipo: "projeto",
    titulo: "IoT em Automação Laboratorial",
    status: "Em andamento",
    data: "01/03/2025",
    responsavel: "Prof. Carlos Mendes",
  },
  {
    id: "5",
    tipo: "evento",
    titulo: "Workshop de IA em Saúde",
    status: "Pendente",
    data: "15/05/2025",
    responsavel: "Prof. Paulo Mendes",
  },
  {
    id: "6",
    tipo: "monitoria",
    titulo: "Bioquímica Celular",
    status: "Pendente",
    data: "15/03/2025",
    responsavel: "Profa. Ana Oliveira",
  },
  {
    id: "7",
    tipo: "projeto",
    titulo: "Inteligência Artificial na Saúde",
    status: "Concluído",
    data: "20/02/2025",
    responsavel: "Prof. Maria Oliveira",
  },
  {
    id: "8",
    tipo: "evento",
    titulo: "Palestra: Avanços em Biologia Molecular",
    status: "Aprovado",
    data: "10/05/2025",
    responsavel: "Coord. Maria Oliveira",
  },
];

// Cores para os gráficos
const COLORS = ["#6366f1", "#ec4899", "#f97316", "#10b981", "#ef4444"];

// Componente para o ícone de atividade
const ActivityIcon = ({ tipo }) => {
  switch (tipo) {
    case "projeto":
      return <FileText className="h-4 w-4 text-violet-500" />;
    case "evento":
      return <Calendar className="h-4 w-4 text-pink-700" />;
    case "monitoria":
      return <BookOpen className="h-4 w-4 text-orange-500" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

// Componente para o status
const StatusBadge = ({ status }) => {
  const getColor = () => {
    switch (status.toLowerCase()) {
      case "pendente":
        return "bg-yellow-500";
      case "aprovado":
        return "bg-green-500";
      case "em andamento":
        return "bg-blue-500";
      case "concluído":
        return "bg-purple-500";
      case "rejeitado":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return <Badge className={getColor()}>{status}</Badge>;
};

export default function RelatoriosPage() {
  const [tipoAtividade, setTipoAtividade] = useState("todos");
  const [periodoFiltro, setPeriodoFiltro] = useState("2025");
  const [tipoGrafico, setTipoGrafico] = useState("barras");

  // Filtrar atividades pelo tipo
  const filteredAtividades =
    tipoAtividade === "todos"
      ? atividadesRecentes
      : atividadesRecentes.filter(
          (atividade) => atividade.tipo === tipoAtividade
        );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">
            Visualize dados e estatísticas das atividades acadêmicas
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar Dados
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <Select value={periodoFiltro} onValueChange={setPeriodoFiltro}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="trimestre">Último Trimestre</SelectItem>
            <SelectItem value="semestre">Último Semestre</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex space-x-2">
          <Button
            variant={tipoGrafico === "barras" ? "default" : "outline"}
            size="icon"
            onClick={() => setTipoGrafico("barras")}
          >
            <BarChart className="h-4 w-4" />
          </Button>
          <Button
            variant={tipoGrafico === "linhas" ? "default" : "outline"}
            size="icon"
            onClick={() => setTipoGrafico("linhas")}
          >
            <TrendingUp className="h-4 w-4" />
          </Button>
          <Button
            variant={tipoGrafico === "pizza" ? "default" : "outline"}
            size="icon"
            onClick={() => setTipoGrafico("pizza")}
          >
            <PieChart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Visão Geral */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Projetos
            </CardTitle>
            <FileText className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">57</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao ano anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Eventos
            </CardTitle>
            <Calendar className="h-4 w-4 text-pink-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">
              +8% em relação ao ano anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Monitorias
            </CardTitle>
            <BookOpen className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">69</div>
            <p className="text-xs text-muted-foreground">
              +15% em relação ao ano anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participantes</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">482</div>
            <p className="text-xs text-muted-foreground">
              +23% em relação ao ano anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <Tabs defaultValue="atividades" className="space-y-4">
        <TabsList>
          <TabsTrigger value="atividades">Atividades por Mês</TabsTrigger>
          <TabsTrigger value="status">Distribuição por Status</TabsTrigger>
          <TabsTrigger value="areas">Distribuição por Área</TabsTrigger>
          <TabsTrigger value="participacao">
            Participação em Eventos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="atividades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividades por Mês</CardTitle>
              <CardDescription>
                Total de projetos, eventos e monitorias registrados em cada mês
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                {tipoGrafico === "barras" ? (
                  <BarChartIcon
                    data={[...Array(12)].map((_, i) => ({
                      name: projetosPorMes[i].name,
                      projetos: projetosPorMes[i].projetos,
                      eventos: eventosPorMes[i].eventos,
                      monitorias: monitoriasPorMes[i].monitorias,
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="projetos" name="Projetos" fill="#6366f1" />
                    <Bar dataKey="eventos" name="Eventos" fill="#ec4899" />
                    <Bar
                      dataKey="monitorias"
                      name="Monitorias"
                      fill="#f97316"
                    />
                  </BarChartIcon>
                ) : tipoGrafico === "linhas" ? (
                  <LineChart
                    data={[...Array(12)].map((_, i) => ({
                      name: projetosPorMes[i].name,
                      projetos: projetosPorMes[i].projetos,
                      eventos: eventosPorMes[i].eventos,
                      monitorias: monitoriasPorMes[i].monitorias,
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="projetos"
                      name="Projetos"
                      stroke="#6366f1"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="eventos"
                      name="Eventos"
                      stroke="#ec4899"
                    />
                    <Line
                      type="monotone"
                      dataKey="monitorias"
                      name="Monitorias"
                      stroke="#f97316"
                    />
                  </LineChart>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">
                      Gráfico de pizza não é adequado para esta visualização.
                    </p>
                  </div>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Status</CardTitle>
              <CardDescription>
                Proporção das atividades por status atual
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                {tipoGrafico === "pizza" ? (
                  <PieChartComponent>
                    <Pie
                      data={distribuicaoPorStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {distribuicaoPorStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChartComponent>
                ) : tipoGrafico === "barras" ? (
                  <BarChartIcon
                    data={distribuicaoPorStatus}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Quantidade" fill="#6366f1">
                      {distribuicaoPorStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChartIcon>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">
                      Gráfico de linha não é adequado para esta visualização.
                    </p>
                  </div>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="areas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Área</CardTitle>
              <CardDescription>
                Proporção das atividades por área de conhecimento
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                {tipoGrafico === "pizza" ? (
                  <PieChartComponent>
                    <Pie
                      data={distribuicaoPorArea}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {distribuicaoPorArea.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChartComponent>
                ) : tipoGrafico === "barras" ? (
                  <BarChartIcon
                    data={distribuicaoPorArea}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Quantidade" fill="#6366f1">
                      {distribuicaoPorArea.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChartIcon>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">
                      Gráfico de linha não é adequado para esta visualização.
                    </p>
                  </div>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Participação em Eventos</CardTitle>
              <CardDescription>
                Comparação entre inscritos e presentes nos eventos
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                {tipoGrafico === "barras" ? (
                  <BarChartIcon
                    data={participacaoPorEvento}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="inscritos" name="Inscritos" fill="#6366f1" />
                    <Bar dataKey="presentes" name="Presentes" fill="#10b981" />
                  </BarChartIcon>
                ) : tipoGrafico === "linhas" ? (
                  <LineChart
                    data={participacaoPorEvento}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="inscritos"
                      name="Inscritos"
                      stroke="#6366f1"
                    />
                    <Line
                      type="monotone"
                      dataKey="presentes"
                      name="Presentes"
                      stroke="#10b981"
                    />
                  </LineChart>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">
                      Gráfico de pizza não é adequado para esta visualização.
                    </p>
                  </div>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tabela de Atividades Recentes */}
      <Card>
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Lista das últimas atividades registradas
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-8 gap-1">
                  <Filter className="h-4 w-4" />
                  Filtrar
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Tipo de Atividade</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={tipoAtividade === "todos"}
                  onCheckedChange={() => setTipoAtividade("todos")}
                >
                  Todos
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={tipoAtividade === "projeto"}
                  onCheckedChange={() => setTipoAtividade("projeto")}
                >
                  Projetos
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={tipoAtividade === "evento"}
                  onCheckedChange={() => setTipoAtividade("evento")}
                >
                  Eventos
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={tipoAtividade === "monitoria"}
                  onCheckedChange={() => setTipoAtividade("monitoria")}
                >
                  Monitorias
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Responsável</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAtividades.map((atividade) => (
                <TableRow key={atividade.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <ActivityIcon tipo={atividade.tipo} />
                      <span className="ml-2 capitalize">{atividade.tipo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {atividade.titulo}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={atividade.status} />
                  </TableCell>
                  <TableCell>{atividade.data}</TableCell>
                  <TableCell>{atividade.responsavel}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredAtividades.length} de {atividadesRecentes.length}{" "}
            atividades
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm">
              Próximo
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
