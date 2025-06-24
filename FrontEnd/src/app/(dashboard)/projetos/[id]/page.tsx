"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useProjetos } from "@/contexts/AppContext";
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
  Target,
  BookOpen,
  Mail,
  Globe,
  AlertCircle,
  Loader2,
  CheckCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { format, isAfter, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ProjetoViewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { projetos, deleteProjeto, fetchProjetos } = useProjetos();

  const [projeto, setProjeto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const projetoId = parseInt(params.id as string);

  useEffect(() => {
    loadProjeto();
  }, [projetoId, projetos]);

  const loadProjeto = async () => {
    try {
      setLoading(true);

      // Primeiro tentar encontrar nos dados já carregados
      const projetoEncontrado = projetos.find((p) => p.id === projetoId);

      if (projetoEncontrado) {
        setProjeto(projetoEncontrado);
        setLoading(false);
        return;
      }

      // Se não encontrado, buscar todos os projetos
      await fetchProjetos();

      // Tentar novamente após fetch
      const projetoAposFetch = projetos.find((p) => p.id === projetoId);

      if (projetoAposFetch) {
        setProjeto(projetoAposFetch);
      } else {
        toast.error("Projeto não encontrado");
        router.push("/projetos");
      }
    } catch (error: any) {
      console.error("Erro ao carregar projeto:", error);
      toast.error("Erro ao carregar projeto", {
        description: error.message || "Tente novamente.",
      });
      router.push("/projetos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!projeto) return;

    try {
      setDeleting(true);
      await deleteProjeto(projeto.id);
      router.push("/projetos");
    } catch (error: any) {
      console.error("Erro ao excluir projeto:", error);
      toast.error("Erro ao excluir projeto", {
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
          <Clock className="w-3 h-3 mr-1" />
          Aguardando
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
          <Target className="w-3 h-3 mr-1" />
          Em Andamento
        </Badge>
      );
    }
  };

  const canEdit = () => {
    if (!user || !projeto) return false;

    // Admin pode editar qualquer projeto
    if (user.tipo === "ADMIN") return true;

    // Criador do projeto pode editar
    return projeto.usuario?.id === user.id;
  };

  const canDelete = () => {
    if (!user || !projeto) return false;

    // Apenas admin pode excluir
    return user.tipo === "ADMIN";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
          <p className="mt-2 text-muted-foreground">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (!projeto) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Projeto não encontrado</h3>
          <p className="text-muted-foreground mb-4">
            O projeto que você está procurando não existe ou foi removido.
          </p>
          <Link href="/projetos">
            <Button>Voltar para Projetos</Button>
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
          <Link href="/projetos">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {projeto.titulo}
            </h1>
            <p className="text-muted-foreground">
              Criado em{" "}
              {format(
                new Date(projeto.dataCriacao || new Date()),
                "dd/MM/yyyy",
                { locale: ptBR }
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {getStatusBadge(projeto.dataInicio, projeto.dataTermino)}

          {canEdit() && (
            <Link href={`/projetos/${projeto.id}/edit`}>
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
                    Tem certeza que deseja excluir o projeto "{projeto.titulo}"?
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
          {/* Descrição */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Descrição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {projeto.descricao}
              </p>
            </CardContent>
          </Card>

          {/* Objetivos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Objetivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {projeto.objetivos}
              </p>
            </CardContent>
          </Card>

          {/* Justificativa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Justificativa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {projeto.justificativa}
              </p>
            </CardContent>
          </Card>

          {/* Metodologia */}
          {projeto.metodologia && (
            <Card>
              <CardHeader>
                <CardTitle>Metodologia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {projeto.metodologia}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Resultados Esperados */}
          {projeto.resultadosEsperados && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados Esperados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {projeto.resultadosEsperados}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar com informações */}
        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Período</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(projeto.dataInicio), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}{" "}
                    -{" "}
                    {format(new Date(projeto.dataTermino), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Área de Conhecimento</p>
                  <p className="text-sm text-muted-foreground">
                    {projeto.areaConhecimento}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Limite de Participantes</p>
                  <p className="text-sm text-muted-foreground">
                    {projeto.limiteParticipantes} pessoas
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tipo de Projeto</p>
                  <p className="text-sm text-muted-foreground">
                    {projeto.tipoProjeto}
                  </p>
                </div>
              </div>

              {projeto.possuiOrcamento && (
                <>
                  <Separator />
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Orçamento</p>
                      <p className="text-sm text-muted-foreground">
                        R${" "}
                        {projeto.orcamento?.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        }) || "0,00"}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {projeto.urlEdital && (
                <>
                  <Separator />
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Edital</p>
                      <a
                        href={projeto.urlEdital}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Acessar edital
                      </a>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Público Alvo */}
          {projeto.publicoAlvo && (
            <Card>
              <CardHeader>
                <CardTitle>Público Alvo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700">{projeto.publicoAlvo}</p>
              </CardContent>
            </Card>
          )}

          {/* Palavras-chave */}
          {projeto.palavrasChave && (
            <Card>
              <CardHeader>
                <CardTitle>Palavras-chave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {projeto.palavrasChave
                    .split(",")
                    .map((palavra: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {palavra.trim()}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Participantes */}
          {projeto.emailsParticipantes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Participantes
                </CardTitle>
                <CardDescription>
                  {Array.isArray(projeto.emailsParticipantes)
                    ? projeto.emailsParticipantes.length
                    : projeto.emailsParticipantes
                        .split(";")
                        .filter((email: string) => email.trim()).length}{" "}
                  participante(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(Array.isArray(projeto.emailsParticipantes)
                    ? projeto.emailsParticipantes
                    : projeto.emailsParticipantes
                        .split(";")
                        .map((email: string) => email.trim())
                        .filter((email: any) => email)
                  ).map((email: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg"
                    >
                      <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm break-all">{email}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Criador */}
          {projeto.usuario && (
            <Card>
              <CardHeader>
                <CardTitle>Criado por</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{projeto.usuario.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {projeto.usuario.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
