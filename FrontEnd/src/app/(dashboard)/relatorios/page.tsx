"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth, authFetch } from "@/lib/auth";
import { useApp } from "@/contexts/AppContext";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  LineChart,
  PieChart,
  Download,
  Calendar,
  Users,
  FileText,
  TrendingUp,
  AlertCircle,
  Loader2,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  Bar,
  Line,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface RelatoryData {
  totalProjetos: number;
  totalEventos: number;
  totalMonitorias: number;
  totalUsuarios: number;
  projetosAtivos: number;
  eventosProximos: number;
  monitoriasAbertas: number;
  usuariosAtivos: number;
}

interface ChartData {
  name: string;
  projetos: number;
  eventos: number;
  monitorias: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function RelatoriosPage() {
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  const appContext = useApp();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RelatoryData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("3m");
  const [selectedType, setSelectedType] = useState("all");

  // Verificar permissão de admin
  useEffect(() => {
    if (!hasPermission("ADMIN")) {
      router.push("/dashboard");
      return;
    }
  }, [hasPermission, router]);

  const fetchRelatoryData = useCallback(async () => {
    try {
      setLoading(true);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await authFetch(
        `${apiUrl}/api/relatorios?periodo=${selectedPeriod}&tipo=${selectedType}`
      );

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const reportData = await response.json();
      setData(reportData.summary);
      setChartData(reportData.chartData);
    } catch (error: any) {
      console.error("Erro ao carregar relatórios:", error);

      // Dados mockados para demonstração
      const mockData: RelatoryData = {
        totalProjetos: 45,
        totalEventos: 23,
        totalMonitorias: 18,
        totalUsuarios: 156,
        projetosAtivos: 32,
        eventosProximos: 8,
        monitoriasAbertas: 12,
        usuariosAtivos: 142,
      };

      const mockChartData: ChartData[] = [
        { name: "Jan", projetos: 12, eventos: 8, monitorias: 5 },
        { name: "Fev", projetos: 15, eventos: 6, monitorias: 7 },
        { name: "Mar", projetos: 18, eventos: 9, monitorias: 6 },
      ];

      setData(mockData);
      setChartData(mockChartData);

      toast.error("Erro ao carregar dados", {
        description: "Usando dados de demonstração.",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod, selectedType]);

  useEffect(() => {
    fetchRelatoryData();
  }, [fetchRelatoryData]);

  const exportReport = async (format: "pdf" | "excel") => {
    try {
      toast.loading(`Gerando relatório em ${format.toUpperCase()}...`);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await authFetch(
        `${apiUrl}/api/relatorios/export?formato=${format}&periodo=${selectedPeriod}&tipo=${selectedType}`
      );

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio-bioconnect-${
        new Date().toISOString().split("T")[0]
      }.${format === "pdf" ? "pdf" : "xlsx"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Relatório ${format.toUpperCase()} gerado com sucesso!`);
    } catch (error: any) {
      console.error("Erro ao exportar relatório:", error);
      toast.error("Erro ao exportar relatório", {
        description: error.message || "Tente novamente.",
      });
    }
  };

  const pieData = data
    ? [
        { name: "Projetos", value: data.totalProjetos, color: COLORS[0] },
        { name: "Eventos", value: data.totalEventos, color: COLORS[1] },
        { name: "Monitorias", value: data.totalMonitorias, color: COLORS[2] },
      ]
    : [];

  if (!hasPermission("ADMIN")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <p className="text-muted-foreground">
              Você não tem permissão para acessar os relatórios.
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Relatórios</h1>
          <p className="text-muted-foreground mt-2">
            Análise completa das atividades do sistema
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 mês</SelectItem>
              <SelectItem value="3m">3 meses</SelectItem>
              <SelectItem value="6m">6 meses</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="projetos">Projetos</SelectItem>
              <SelectItem value="eventos">Eventos</SelectItem>
              <SelectItem value="monitorias">Monitorias</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => exportReport("pdf")} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>

          <Button onClick={() => exportReport("excel")} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Excel
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
            <p className="mt-2 text-muted-foreground">
              Carregando relatórios...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Cards de Estatísticas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Projetos
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.totalProjetos || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {data?.projetosAtivos || 0} ativos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Eventos
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.totalEventos || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {data?.eventosProximos || 0} próximos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Monitorias
                </CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.totalMonitorias || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {data?.monitoriasAbertas || 0} abertas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Usuários
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.totalUsuarios || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {data?.usuariosAtivos || 0} ativos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs de Gráficos */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="trends">Tendências</TabsTrigger>
              <TabsTrigger value="distribution">Distribuição</TabsTrigger>
            </TabsList>

            {/* Tab: Visão Geral */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Atividades por Mês</CardTitle>
                    <CardDescription>
                      Comparativo de projetos, eventos e monitorias
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsBarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="projetos"
                          name="Projetos"
                          fill="#6366f1"
                        />
                        <Bar dataKey="eventos" name="Eventos" fill="#ec4899" />
                        <Bar
                          dataKey="monitorias"
                          name="Monitorias"
                          fill="#f97316"
                        />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição de Atividades</CardTitle>
                    <CardDescription>
                      Percentual de cada tipo de atividade
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={pieData}
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
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab: Tendências */}
            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução Temporal</CardTitle>
                  <CardDescription>
                    Crescimento das atividades ao longo do tempo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RechartsLineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
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
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Distribuição */}
            <TabsContent value="distribution" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Status dos Projetos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Ativos</span>
                      <Badge variant="default">
                        {data?.projetosAtivos || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Inativos</span>
                      <Badge variant="secondary">
                        {(data?.totalProjetos || 0) -
                          (data?.projetosAtivos || 0)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Status dos Eventos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Próximos</span>
                      <Badge variant="default">
                        {data?.eventosProximos || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Finalizados</span>
                      <Badge variant="secondary">
                        {(data?.totalEventos || 0) -
                          (data?.eventosProximos || 0)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Status das Monitorias
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Abertas</span>
                      <Badge variant="default">
                        {data?.monitoriasAbertas || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fechadas</span>
                      <Badge variant="secondary">
                        {(data?.totalMonitorias || 0) -
                          (data?.monitoriasAbertas || 0)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
