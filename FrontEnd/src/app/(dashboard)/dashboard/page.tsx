"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  FileText,
  Calendar,
  BookOpen,
  Users,
  AlertTriangle,
  Check,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Dados fictícios para o gráfico de atividades
const activityData = [
  { month: "Jan", projetos: 4, eventos: 2, monitorias: 3 },
  { month: "Fev", projetos: 3, eventos: 4, monitorias: 5 },
  { month: "Mar", projetos: 5, eventos: 3, monitorias: 2 },
  { month: "Abr", projetos: 6, eventos: 2, monitorias: 4 },
  { month: "Mai", projetos: 4, eventos: 5, monitorias: 3 },
  { month: "Jun", projetos: 7, eventos: 3, monitorias: 5 },
];

// Dados fictícios para o gráfico de distribuição
const distributionData = [
  { name: "Pesquisa", value: 45 },
  { name: "Extensão", value: 35 },
  { name: "Monitoria", value: 20 },
];

const COLORS = ["#6366f1", "#ec4899", "#f97316"];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao BioConnect. Visualize seus projetos, eventos e
            monitorias.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link href="/projetos/new">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Novo Projeto
            </Button>
          </Link>
          <Link href="/eventos/new">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Novo Evento
            </Button>
          </Link>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projetos Ativos
            </CardTitle>
            <FileText className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 no último mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Eventos Planejados
            </CardTitle>
            <Calendar className="h-4 w-4 text-pink-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Próximos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monitorias Abertas
            </CardTitle>
            <BookOpen className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Pendentes de aprovação: 1
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participantes</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              Em todos os projetos e eventos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atividades por Mês</CardTitle>
            <CardDescription>
              Distribuição de projetos, eventos e monitorias
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activityData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="projetos"
                  stroke="#6366f1"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="eventos" stroke="#ec4899" />
                <Line type="monotone" dataKey="monitorias" stroke="#f97316" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo</CardTitle>
            <CardDescription>
              Proporção entre atividades de pesquisa, extensão e monitoria
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Abas para Atividades Recentes e Pendentes */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Atividades Recentes</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>
                Últimas atualizações nos seus projetos e eventos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Projeto Bioinformática
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-violet-50">
                        <FileText className="h-3 w-3 mr-1" />
                        Projeto
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">Aprovado</Badge>
                    </TableCell>
                    <TableCell>Hoje, 10:42</TableCell>
                    <TableCell>
                      <Link href="/projetos/1">
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Simpósio de Biotecnologia
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-pink-50">
                        <Calendar className="h-3 w-3 mr-1" />
                        Evento
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500">Em andamento</Badge>
                    </TableCell>
                    <TableCell>Hoje, 09:15</TableCell>
                    <TableCell>
                      <Link href="/eventos/1">
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Monitoria Algoritmos
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-orange-50">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Monitoria
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-500">Pendente</Badge>
                    </TableCell>
                    <TableCell>Ontem, 14:30</TableCell>
                    <TableCell>
                      <Link href="/monitorias/1">
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Workshop de Programação
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-pink-50">
                        <Calendar className="h-3 w-3 mr-1" />
                        Evento
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">Concluído</Badge>
                    </TableCell>
                    <TableCell>Há 2 dias</TableCell>
                    <TableCell>
                      <Link href="/eventos/2">
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="mt-4 text-right">
                <Link href="/relatorios">
                  <Button variant="outline" size="sm">
                    Ver todas as atividades
                    <TrendingUp className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Pendentes</CardTitle>
              <CardDescription>Ações que requerem sua atenção</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead>Prioridade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Relatório de Pesquisa
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-violet-50">
                        <FileText className="h-3 w-3 mr-1" />
                        Projeto
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-700"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Enviar
                      </Badge>
                    </TableCell>
                    <TableCell>Em 5 dias</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-500">Média</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Workshop de IA
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-pink-50">
                        <Calendar className="h-3 w-3 mr-1" />
                        Evento
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-red-100 text-red-700"
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Confirmar
                      </Badge>
                    </TableCell>
                    <TableCell>Em 2 dias</TableCell>
                    <TableCell>
                      <Badge className="bg-red-500">Alta</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Projeto IoT</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-violet-50">
                        <FileText className="h-3 w-3 mr-1" />
                        Projeto
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-700"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Revisar
                      </Badge>
                    </TableCell>
                    <TableCell>Em 7 dias</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">Baixa</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="mt-4 text-right">
                <Link href="/dashboard/pendencias">
                  <Button variant="outline" size="sm">
                    Ver todas as pendências
                    <AlertTriangle className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Cards do Próximo Evento e Projetos Recentes */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximo Evento</CardTitle>
            <CardDescription>
              Detalhes do evento mais próximo na agenda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <h3 className="text-xl font-semibold">
                Simpósio de Biotecnologia
              </h3>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>30 de abril de 2025, 09:00 - 17:00</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Apresentações e discussões sobre os avanços recentes em
                biotecnologia aplicada à saúde e agricultura.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-500">Confirmado</Badge>
                <Badge variant="outline">20 Participantes</Badge>
              </div>
              <div className="pt-2">
                <Link href="/eventos/3">
                  <Button variant="outline" size="sm">
                    Ver detalhes
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projetos Recentes</CardTitle>
            <CardDescription>Seus projetos mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Bioinformática Aplicada</h3>
                  <p className="text-sm text-muted-foreground">
                    Iniciado: 15/03/2025
                  </p>
                </div>
                <Badge className="bg-blue-500">Em andamento</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">IoT em Automação Laboratorial</h3>
                  <p className="text-sm text-muted-foreground">
                    Iniciado: 01/03/2025
                  </p>
                </div>
                <Badge className="bg-blue-500">Em andamento</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">
                    Inteligência Artificial na Saúde
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Iniciado: 20/02/2025
                  </p>
                </div>
                <Badge className="bg-green-500">Concluído</Badge>
              </div>
              <div className="pt-2">
                <Link href="/projetos">
                  <Button variant="outline" size="sm">
                    Ver todos os projetos
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
