"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Users,
  MapPin,
  FileText,
  Clock,
  Mail,
  AlertCircle,
  Loader2,
  CheckCircle,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { format, isAfter, isBefore, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function EventoViewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { eventos, deleteEvento, fetchEventos } = useEventos();

  const [evento, setEvento] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const eventoId = parseInt(params.id as string);

  useEffect(() => {
    loadEvento();
  }, [eventoId, eventos]);

  const loadEvento = async () => {
    try {
      setLoading(true);

      // Primeiro tentar encontrar nos dados já carregados
      const eventoEncontrado = eventos.find((e) => e.id === eventoId);

      if (eventoEncontrado) {
        setEvento(eventoEncontrado);
        setLoading(false);
        return;
      }

      // Se não encontrado, buscar todos os eventos
      await fetchEventos();

      // Tentar novamente após fetch
      const eventoAposFetch = eventos.find((e) => e.id === eventoId);

      if (eventoAposFetch) {
        setEvento(eventoAposFetch);
      } else {
        toast.error("Evento não encontrado");
        router.push("/eventos");
      }
    } catch (error: any) {
      console.error("Erro ao carregar evento:", error);
      toast.error("Erro ao carregar evento", {
        description: error.message || "Tente novamente.",
      });
      router.push("/eventos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!evento) return;

    try {
      setDeleting(true);
      await deleteEvento(evento.id);
      router.push("/eventos");
    } catch (error: any) {
      console.error("Erro ao excluir evento:", error);
      toast.error("Erro ao excluir evento", {
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
    const diasParaInicio = differenceInDays(inicio, hoje);

    if (isBefore(hoje, inicio)) {
      if (diasParaInicio <= 7) {
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Em breve ({diasParaInicio} dias)
          </Badge>
        );
      }
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Calendar className="w-3 h-3 mr-1" />
          Agendado
        </Badge>
      );
    } else if (isAfter(hoje, fim)) {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Finalizado
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

  const getDuration = (dataInicio: string, dataTermino: string) => {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataTermino);
    const diffTime = Math.abs(fim.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 dia";
    if (diffDays < 7) return `${diffDays} dias`;
    if (diffDays === 7) return "1 semana";
    return `${Math.ceil(diffDays / 7)} semanas`;
  };

  const canEdit = () => {
    if (!user || !evento) return false;

    // Admin pode editar qualquer evento
    if (user.tipo === "ADMIN") return true;

    // Verificar se é o criador (implementar quando tivermos campo de criador)
    return false;
  };

  const canDelete = () => {
    if (!user || !evento) return false;

    // Apenas admin pode excluir
    return user.tipo === "ADMIN";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
          <p className="mt-2 text-muted-foreground">Carregando evento...</p>
        </div>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Evento não encontrado</h3>
          <p className="text-muted-foreground mb-4">
            O evento que você está procurando não existe ou foi removido.
          </p>
          <Link href="/eventos">
            <Button>Voltar para Eventos</Button>
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
          <Link href="/eventos">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {evento.titulo}
            </h1>
            <p className="text-muted-foreground">
              Criado em{" "}
              {format(
                new Date(evento.dataCriacao || new Date()),
                "dd/MM/yyyy",
                { locale: ptBR }
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {getStatusBadge(evento.dataInicio, evento.dataTermino)}

          {canEdit() && (
            <Link href={`/eventos/${evento.id}/edit`}>
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
                    Tem certeza que deseja excluir o evento "{evento.titulo}"?
                    Esta ação não pode ser desfeita.
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
          {/* Justificativa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Justificativa
              </CardTitle>
              <CardDescription>Motivação e objetivos do evento</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {evento.justificativa}
              </p>
            </CardContent>
          </Card>

          {/* Participantes */}
          {evento.participantes && evento.participantes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Lista de Participantes
                </CardTitle>
                <CardDescription>
                  {evento.participantes.length} participante(s) confirmado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {evento.participantes.map(
                    (participante: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {participante.nome.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {participante.nome}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {participante.email}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Orçamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Informações Orçamentárias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Valor Solicitado
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    R${" "}
                    {evento.vlTotalSolicitado?.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    }) || "0,00"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Valor Aprovado
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      evento.vlTotalAprovado === evento.vlTotalSolicitado
                        ? "text-green-600"
                        : evento.vlTotalAprovado > 0
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    R${" "}
                    {evento.vlTotalAprovado?.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    }) || "0,00"}
                  </p>
                </div>
              </div>

              {evento.vlTotalSolicitado !== evento.vlTotalAprovado && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Observação:</strong> O valor aprovado é diferente do
                    solicitado.
                    {evento.vlTotalAprovado === 0 &&
                      " O evento não foi aprovado financeiramente."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar com informações */}
        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Evento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Data de Início</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(evento.dataInicio), "EEEE, dd/MM/yyyy", {
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
                    {format(new Date(evento.dataTermino), "EEEE, dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Duração</p>
                  <p className="text-sm text-muted-foreground">
                    {getDuration(evento.dataInicio, evento.dataTermino)}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Local</p>
                  <p className="text-sm text-muted-foreground">
                    {evento.local}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Curso</p>
                  <p className="text-sm text-muted-foreground">
                    {evento.curso}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status do Orçamento */}
          <Card>
            <CardHeader>
              <CardTitle>Status Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Solicitado:</span>
                  <span className="font-medium">
                    R${" "}
                    {evento.vlTotalSolicitado?.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    }) || "0,00"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Aprovado:</span>
                  <span
                    className={`font-medium ${
                      evento.vlTotalAprovado === evento.vlTotalSolicitado
                        ? "text-green-600"
                        : evento.vlTotalAprovado > 0
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    R${" "}
                    {evento.vlTotalAprovado?.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    }) || "0,00"}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between items-center font-medium">
                  <span className="text-sm">Taxa de Aprovação:</span>
                  <span
                    className={
                      evento.vlTotalSolicitado > 0
                        ? (evento.vlTotalAprovado / evento.vlTotalSolicitado) *
                            100 ===
                          100
                          ? "text-green-600"
                          : (evento.vlTotalAprovado /
                              evento.vlTotalSolicitado) *
                              100 >
                            0
                          ? "text-yellow-600"
                          : "text-red-600"
                        : "text-gray-600"
                    }
                  >
                    {evento.vlTotalSolicitado > 0
                      ? `${Math.round(
                          (evento.vlTotalAprovado / evento.vlTotalSolicitado) *
                            100
                        )}%`
                      : "0%"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contagem Regressiva ou Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status do Evento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                {isBefore(new Date(), new Date(evento.dataInicio)) ? (
                  <>
                    <p className="text-2xl font-bold text-blue-600">
                      {differenceInDays(
                        new Date(evento.dataInicio),
                        new Date()
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      dias para o início
                    </p>
                  </>
                ) : isAfter(new Date(), new Date(evento.dataTermino)) ? (
                  <>
                    <p className="text-lg font-bold text-gray-600">
                      Evento Finalizado
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Há{" "}
                      {differenceInDays(
                        new Date(),
                        new Date(evento.dataTermino)
                      )}{" "}
                      dias
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-bold text-green-600">
                      Em Andamento
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Termina em{" "}
                      {differenceInDays(
                        new Date(evento.dataTermino),
                        new Date()
                      )}{" "}
                      dias
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
