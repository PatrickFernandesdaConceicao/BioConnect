"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Clock,
  MapPin,
  BookOpen,
  GraduationCap,
  User,
  AlertCircle,
  Loader2,
  CheckCircle,
  School,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { format, isAfter, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";

const diasSemanaMap = {
  DOMINGO: "Domingo",
  SEGUNDA: "Segunda-feira",
  TERCA: "Terça-feira",
  QUARTA: "Quarta-feira",
  QUINTA: "Quinta-feira",
  SEXTA: "Sexta-feira",
  SABADO: "Sábado",
};

export default function MonitoriaViewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { monitorias, deleteMonitoria, fetchMonitorias } = useMonitorias();
  const { disciplinas, cursos, fetchMasterData } = useMasterData();

  const [monitoria, setMonitoria] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const monitoriaId = parseInt(params.id as string);

  useEffect(() => {
    loadMonitoria();
    fetchMasterData();
  }, [monitoriaId, monitorias]);

  const loadMonitoria = async () => {
    try {
      setLoading(true);

      // Primeiro tentar encontrar nos dados já carregados
      const monitoriaEncontrada = monitorias.find((m) => m.id === monitoriaId);

      if (monitoriaEncontrada) {
        setMonitoria(monitoriaEncontrada);
        setLoading(false);
        return;
      }

      // Se não encontrado, buscar todas as monitorias
      await fetchMonitorias();

      // Tentar novamente após fetch
      const monitoriaAposFetch = monitorias.find((m) => m.id === monitoriaId);

      if (monitoriaAposFetch) {
        setMonitoria(monitoriaAposFetch);
      } else {
        toast.error("Monitoria não encontrada");
        router.push("/monitorias");
      }
    } catch (error: any) {
      console.error("Erro ao carregar monitoria:", error);
      toast.error("Erro ao carregar monitoria", {
        description: error.message || "Tente novamente.",
      });
      router.push("/monitorias");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!monitoria) return;

    try {
      setDeleting(true);
      await deleteMonitoria(monitoria.id);
      router.push("/monitorias");
    } catch (error: any) {
      console.error("Erro ao excluir monitoria:", error);
      toast.error("Erro ao excluir monitoria", {
        description: error.message || "Tente novamente.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (dataInicio: string, dataTermino: string) => {
    const hoje = new Date();
    const inicio = new Date(dataInicio);
    const fim = new Date(dataTermino);

    if (isBefore(hoje, inicio)) {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Calendar className="w-3 h-3 mr-1" />
          Não Iniciada
        </Badge>
      );
    } else if (isAfter(hoje, fim)) {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Finalizada
        </Badge>
      );
    } else {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <Clock className="w-3 h-3 mr-1" />
          Em Andamento
        </Badge>
      );
    }
  };

  const getDisciplinaNome = (disciplinaId: number) => {
    const disciplina = disciplinas.find((d) => d.id === disciplinaId);
    return disciplina ? disciplina.nome : `Disciplina ${disciplinaId}`;
  };

  const getCursoNome = (cursoId: number) => {
    const curso = cursos.find((c) => c.id === cursoId);
    return curso ? curso.nome : `Curso ${cursoId}`;
  };

  const canEdit = () => {
    if (!user || !monitoria) return false;

    // Admin pode editar qualquer monitoria
    if (user.tipo === "ADMIN") return true;

    // Professor pode editar suas próprias monitorias (implementar quando tivermos campo de criador)
    return false;
  };

  const canDelete = () => {
    if (!user || !monitoria) return false;

    // Apenas admin pode excluir
    return user.tipo === "ADMIN";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
          <p className="mt-2 text-muted-foreground">Carregando monitoria...</p>
        </div>
      </div>
    );
  }

  if (!monitoria) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Monitoria não encontrada
          </h3>
          <p className="text-muted-foreground mb-4">
            A monitoria que você está procurando não existe ou foi removida.
          </p>
          <Link href="/monitorias">
            <Button>Voltar para Monitorias</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/monitorias">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Monitoria - {getDisciplinaNome(monitoria.disciplinaId)}
            </h1>
            <p className="text-muted-foreground">
              {getCursoNome(monitoria.cursoId)} • {monitoria.semestre}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {getStatusBadge(monitoria.dataInicio, monitoria.dataTermino)}

          {monitoria.bolsa && (
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-200"
            >
              <DollarSign className="w-3 h-3 mr-1" />
              Com Bolsa
            </Badge>
          )}

          {canEdit() && (
            <Link href={`/monitorias/${monitoria.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
          )}

          {canDelete() && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir esta monitoria? Esta ação não
                    pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Excluindo...
                      </>
                    ) : (
                      "Excluir"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Conteúdo Principal */}
        <div className="md:col-span-2 space-y-6">
          {/* Informações Acadêmicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Informações Acadêmicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Disciplina
                  </p>
                  <p className="font-medium">
                    {getDisciplinaNome(monitoria.disciplinaId)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Curso
                  </p>
                  <p className="font-medium">
                    {getCursoNome(monitoria.cursoId)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Semestre
                  </p>
                  <p className="font-medium">{monitoria.semestre}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Carga Horária
                  </p>
                  <p className="font-medium">{monitoria.cargaHoraria} horas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Horários */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Horários de Funcionamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Horário de Início
                  </p>
                  <p className="font-medium text-lg">
                    {monitoria.horarioInicio}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Horário de Término
                  </p>
                  <p className="font-medium text-lg">
                    {monitoria.horarioTermino}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Dias da Semana
                </p>
                <div className="flex flex-wrap gap-2">
                  {monitoria.diasSemana.map((dia: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {diasSemanaMap[dia as keyof typeof diasSemanaMap] || dia}
                    </Badge>
                  ))}
                </div>
              </div>

              {monitoria.sala && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Local
                    </p>
                    <p className="font-medium flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      {monitoria.sala}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Requisitos */}
          {monitoria.requisitos && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Requisitos
                </CardTitle>
                <CardDescription>
                  Pré-requisitos para candidatura à monitoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {monitoria.requisitos}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Atividades */}
          {monitoria.atividades && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Atividades a Desenvolver
                </CardTitle>
                <CardDescription>
                  Descrição das atividades que o monitor irá realizar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {monitoria.atividades}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar com informações */}
        <div className="space-y-6">
          {/* Período */}
          <Card>
            <CardHeader>
              <CardTitle>Período da Monitoria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Data de Início</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(monitoria.dataInicio), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Data de Término</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(monitoria.dataTermino), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bolsa */}
          {monitoria.bolsa && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Informações da Bolsa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-green-600">
                    R${" "}
                    {monitoria.valorBolsa?.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    }) || "0,00"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Valor mensal da bolsa
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Aluno Pré-selecionado */}
          {monitoria.alunoPreSelecionado && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Candidato Indicado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="font-medium">{monitoria.alunoPreSelecionado}</p>
                  <p className="text-xs text-muted-foreground">
                    Aluno pré-selecionado pelo professor
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resumo da Monitoria */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span>Carga horária:</span>
                <span className="font-medium">{monitoria.cargaHoraria}h</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span>Dias por semana:</span>
                <span className="font-medium">
                  {monitoria.diasSemana.length}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span>Modalidade:</span>
                <span className="font-medium">
                  {monitoria.bolsa ? "Com bolsa" : "Voluntária"}
                </span>
              </div>

              {monitoria.sala && (
                <div className="flex justify-between items-center text-sm">
                  <span>Local:</span>
                  <span className="font-medium">{monitoria.sala}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Criado em:</span>
                <span>
                  {format(
                    new Date(monitoria.dataCriacao || new Date()),
                    "dd/MM/yyyy",
                    { locale: ptBR }
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Última atualização:</span>
                <span>
                  {format(new Date(), "dd/MM/yyyy", { locale: ptBR })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
