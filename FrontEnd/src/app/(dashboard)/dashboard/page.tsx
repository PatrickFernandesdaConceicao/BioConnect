// src/app/(dashboard)/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  FileText,
  Calendar,
  BookOpen,
  Users,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  format,
  isAfter,
  isBefore,
  subDays,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DashboardPage() {
  const { user, hasPermission } = useAuth();
  const {
    projetos,
    eventos,
    monitorias,
    fetchProjetos,
    fetchEventos,
    fetchMonitorias,
  } = useApp();

  useEffect(() => {
    // Carregar dados iniciais
    fetchProjetos();
    fetchEventos();
    fetchMonitorias();
  }, []);

  // Cálculos de estatísticas
  const today = new Date();
  const last30Days = subDays(today, 30);

  // Projetos
  const projetosAtivos = projetos.filter((p) => p.status === "EM_ANDAMENTO");
  const projetosConcluidos = projetos.filter((p) => p.status === "CONCLUIDO");
  const projetosPendentes = projetos.filter((p) => p.status === "PENDENTE");

  // Eventos
  const eventosProximos = eventos.filter((e) =>
    isAfter(new Date(e.dataInicio), today)
  );
  const eventosEmAndamento = eventos.filter(
    (e) =>
      isBefore(new Date(e.dataInicio), today) &&
      isAfter(new Date(e.dataTermino), today)
  );

  // Monitorias
  const monitoriasAbertas = monitorias.filter((m) =>
    isAfter(new Date(m.dataInicio), today)
  );
  const monitoriasComBolsa = monitorias.filter((m) => m.bolsa);

  // Dados para gráficos
  const atividadesPorMes = [
    { mes: "Jan", projetos: 4, eventos: 2, monitorias: 3 },
    { mes: "Fev", projetos: 3, eventos: 4, monitorias: 5 },
    { mes: "Mar", projetos: 5, eventos: 3, monitorias: 2 },
    {
      mes: "Abr",
      projetos: projetos.length,
      eventos: eventos.length,
      monitorias: monitorias.length,
    },
  ];

  const distribuicaoStatus = [
    { name: "Ativos", value: projetosAtivos.length, color: "#10b981" },
    { name: "Concluídos", value: projetosConcluidos.length, color: "#3b82f6" },
    { name: "Pendentes", value: projetosPendentes.length, color: "#f59e0b" },
  ];

  // Atividades recentes
  const atividadesRecentes = [
    ...projetos.slice(0, 3).map((p) => ({
      id: p.id,
      tipo: "projeto",
      titulo: p.titulo,
      status: p.status || "PENDENTE",
      data: p.dataInicio,
      url: `/projetos/${p.id}`,
    })),
    ...eventos.slice(0, 3).map((e) => ({
      id: e.id,
      tipo: "evento",
      titulo: e.titulo,
      status: "EM_ANDAMENTO",
      data: e.dataInicio,
      url: `/eventos/${e.id}`,
    })),
    ...monitorias.slice(0, 2).map((m) => ({
      id: m.id,
      tipo: "monitoria",
      titulo: m.disciplinaNome || "Monitoria",
      status: "ABERTA",
      data: m.dataInicio,
      url: `/monitorias/${m.id}`,
    })),
  ]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 8);

  const getStatusBadge = (status: string, tipo: string) => {
    const configs = {
      projeto: {
        PENDENTE: { label: "Pendente", variant: "secondary" as const },
        EM_ANDAMENTO: { label: "Em Andamento", variant: "default" as const },
        CONCLUIDO: { label: "Concluído", variant: "secondary" as const },
      },
      evento: {
        EM_ANDAMENTO: { label: "Em Andamento", variant: "default" as const },
      },
      monitoria: {
        ABERTA: { label: "Aberta", variant: "secondary" as const },
      },
    } as const;

    type ConfigType = typeof configs;
    type TipoKey = keyof ConfigType;
    type StatusKey<T extends TipoKey> = keyof ConfigType[T];

    const tipoConfig = configs[tipo as TipoKey];
    const config = tipoConfig?.[status as StatusKey<TipoKey>] || {
      label: status,
      variant: "outline" as const,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTipoIcon = (tipo: string) => {
    const icons = {
      projeto: <FileText className="h-4 w-4" />,
      evento: <Calendar className="h-4 w-4" />,
      monitoria: <BookOpen className="h-4 w-4" />,
    };
    return (
      icons[tipo as keyof typeof icons] || <FileText className="h-4 w-4" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {user?.nome}! Aqui está um resumo das suas atividades.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link href="/projetos/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Projeto
            </Button>
          </Link>
          {hasPermission("ADMIN") && (
            <Link href="/eventos/new">
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Novo Evento
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Cards de estatísticas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projetos Ativos
            </CardTitle>
            <FileText className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projetosAtivos.length}</div>
            <p className="text-xs text-muted-foreground">
              {projetos.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Eventos Próximos
            </CardTitle>
            <Calendar className="h-4 w-4 text-pink-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventosProximos.length}</div>
            <p className="text-xs text-muted-foreground">
              {eventosEmAndamento.length} em andamento
            </p>
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
            <div className="text-2xl font-bold">{monitoriasAbertas.length}</div>
            <p className="text-xs text-muted-foreground">
              {monitoriasComBolsa.length} com bolsa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Atividades Totais
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projetos.length + eventos.length + monitorias.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Projetos, eventos e monitorias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com conteúdo */}
      <Tabs defaultValue="visao-geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="atividades">Atividades Recentes</TabsTrigger>
          <TabsTrigger value="graficos">Gráficos</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Projetos pendentes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-orange-500" />
                  Projetos Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {projetosPendentes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum projeto pendente
                  </p>
                ) : (
                  <div className="space-y-2">
                    {projetosPendentes.slice(0, 3).map((projeto) => (
                      <div
                        key={projeto.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {projeto.titulo}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {projeto.areaConhecimento}
                          </p>
                        </div>
                        <Link href={`/projetos/${projeto.id}`}>
                          <Button variant="ghost" size="sm">
                            Ver
                          </Button>
                        </Link>
                      </div>
                    ))}
                    {projetosPendentes.length > 3 && (
                      <Link href="/projetos">
                        <Button variant="outline" size="sm" className="w-full">
                          Ver todos ({projetosPendentes.length})
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Eventos próximos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-500" />
                  Próximos Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {eventosProximos.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum evento próximo
                  </p>
                ) : (
                  <div className="space-y-2">
                    {eventosProximos.slice(0, 3).map((evento) => (
                      <div
                        key={evento.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {evento.titulo}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(evento.dataInicio), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </p>
                        </div>
                        <Link href={`/eventos/${evento.id}`}>
                          <Button variant="ghost" size="sm">
                            Ver
                          </Button>
                        </Link>
                      </div>
                    ))}
                    {eventosProximos.length > 3 && (
                      <Link href="/eventos">
                        <Button variant="outline" size="sm" className="w-full">
                          Ver todos ({eventosProximos.length})
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Monitorias com bolsa */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Monitorias com Bolsa
                </CardTitle>
              </CardHeader>
              <CardContent>
                {monitoriasComBolsa.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma monitoria com bolsa
                  </p>
                ) : (
                  <div className="space-y-2">
                    {monitoriasComBolsa.slice(0, 3).map((monitoria) => (
                      <div
                        key={monitoria.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {monitoria.disciplinaNome}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            R$ {monitoria.valorBolsa?.toLocaleString() || "0"}
                          </p>
                        </div>
                        <Link href={`/monitorias/${monitoria.id}`}>
                          <Button variant="ghost" size="sm">
                            Ver
                          </Button>
                        </Link>
                      </div>
                    ))}
                    {monitoriasComBolsa.length > 3 && (
                      <Link href="/monitorias">
                        <Button variant="outline" size="sm" className="w-full">
                          Ver todas ({monitoriasComBolsa.length})
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="atividades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>
                Últimas atualizações em projetos, eventos e monitorias
              </CardDescription>
            </CardHeader>
            <CardContent>
              {atividadesRecentes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nenhuma atividade recente encontrada
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="w-[100px]">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {atividadesRecentes.map((atividade) => (
                        <TableRow key={`${atividade.tipo}-${atividade.id}`}>
                          <TableCell>
                            <div className="flex items-center">
                              {getTipoIcon(atividade.tipo)}
                              <span className="ml-2 capitalize">
                                {atividade.tipo}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {atividade.titulo}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(atividade.status, atividade.tipo)}
                          </TableCell>
                          <TableCell>
                            {format(new Date(atividade.data), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </TableCell>
                          <TableCell>
                            <Link href={atividade.url}>
                              <Button variant="ghost" size="sm">
                                Ver
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graficos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Gráfico de atividades por mês */}
            <Card>
              <CardHeader>
                <CardTitle>Atividades por Mês</CardTitle>
                <CardDescription>
                  Distribuição de projetos, eventos e monitorias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={atividadesPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
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
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de distribuição de status */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
                <CardDescription>Status atual dos projetos</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={distribuicaoStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {distribuicaoStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de linha - Tendência */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Atividades</CardTitle>
              <CardDescription>
                Evolução das atividades ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={atividadesPorMes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="projetos"
                    stroke="#6366f1"
                    name="Projetos"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="eventos"
                    stroke="#ec4899"
                    name="Eventos"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="monitorias"
                    stroke="#f97316"
                    name="Monitorias"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Cards de ação rápida */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/projetos">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="mr-2 h-5 w-5 text-violet-500" />
                Gerenciar Projetos
              </CardTitle>
              <CardDescription>
                Visualize e gerencie todos os seus projetos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{projetos.length}</span>
                <Button variant="ghost" size="sm">
                  Acessar →
                </Button>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/eventos">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Calendar className="mr-2 h-5 w-5 text-pink-700" />
                Gerenciar Eventos
              </CardTitle>
              <CardDescription>
                Organize e acompanhe eventos acadêmicos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{eventos.length}</span>
                <Button variant="ghost" size="sm">
                  Acessar →
                </Button>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/monitorias">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BookOpen className="mr-2 h-5 w-5 text-orange-500" />
                Gerenciar Monitorias
              </CardTitle>
              <CardDescription>
                Administre oportunidades de monitoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{monitorias.length}</span>
                <Button variant="ghost" size="sm">
                  Acessar →
                </Button>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
