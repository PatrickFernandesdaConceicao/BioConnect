"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useProjetos } from "@/contexts/AppContext";
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
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Calendar,
  DollarSign,
  Users,
  FileText,
  ExternalLink,
  Target,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ProjetoViewPage() {
  const params = useParams();
  const router = useRouter();
  const { projetos, fetchProjetos } = useProjetos();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [projeto, setProjeto] = useState<any>(null);

  const projetoId = params.id as string;

  useEffect(() => {
    const loadProjeto = async () => {
      if (projetos.length === 0) {
        await fetchProjetos();
      }

      const projetoEncontrado = projetos.find(
        (p) => p.id.toString() === projetoId
      );
      if (projetoEncontrado) {
        setProjeto(projetoEncontrado);
      }
      setIsLoading(false);
    };

    loadProjeto();
  }, [projetoId, projetos, fetchProjetos]);

  const getStatusBadge = (status?: string) => {
    const statusConfig = {
      PENDENTE: {
        label: "Pendente",
        variant: "secondary" as const,
        color: "bg-yellow-100 text-yellow-800",
      },
      APROVADO: {
        label: "Aprovado",
        variant: "default" as const,
        color: "bg-blue-100 text-blue-800",
      },
      EM_ANDAMENTO: {
        label: "Em Andamento",
        variant: "default" as const,
        color: "bg-green-100 text-green-800",
      },
      CONCLUIDO: {
        label: "Concluído",
        variant: "outline" as const,
        color: "bg-gray-100 text-gray-800",
      },
      REJEITADO: {
        label: "Rejeitado",
        variant: "destructive" as const,
        color: "bg-red-100 text-red-800",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: "Indefinido",
      variant: "secondary" as const,
      color: "bg-gray-100 text-gray-800",
    };

    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">
            Carregando projeto...
          </p>
        </div>
      </div>
    );
  }

  if (!projeto) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Projeto não encontrado</h3>
          <p className="text-muted-foreground mb-4">
            O projeto que você está procurando não existe ou foi removido.
          </p>
          <Link href="/projetos">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Projetos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/projetos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{projeto.titulo}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {projeto.tipoProjeto} • {projeto.areaConhecimento}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge(projeto.status)}
          <Link href={`/projetos/${projeto.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      {/* Informações Principais */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Período</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projeto.dataInicio && projeto.dataTermino ? (
                <>
                  {format(new Date(projeto.dataInicio), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    até{" "}
                  </span>
                  {format(new Date(projeto.dataTermino), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </>
              ) : (
                "Não definido"
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Data de início e término
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projeto.possuiOrcamento
                ? `R$ ${projeto.orcamento?.toLocaleString() || "0"}`
                : "Sem orçamento"}
            </div>
            <p className="text-xs text-muted-foreground">
              {projeto.possuiOrcamento ? "Valor total" : "Projeto sem recursos"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projeto.emailsParticipantes?.length || 0} /{" "}
              {projeto.limiteParticipantes}
            </div>
            <p className="text-xs text-muted-foreground">
              Atual / Limite máximo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Descrição e Detalhes */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Descrição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {projeto.descricao || "Nenhuma descrição fornecida."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Objetivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {projeto.objetivos || "Nenhum objetivo definido."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Metodologia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {projeto.metodologia || "Metodologia não especificada."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Informações Laterais */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Justificativa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {projeto.justificativa || "Nenhuma justificativa fornecida."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resultados Esperados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {projeto.resultadosEsperados || "Resultados não especificados."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Público-Alvo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {projeto.publicoAlvo || "Público-alvo não especificado."}
              </p>
            </CardContent>
          </Card>

          {projeto.palavrasChave && (
            <Card>
              <CardHeader>
                <CardTitle>Palavras-Chave</CardTitle>
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
        </div>
      </div>

      {/* Participantes */}
      {projeto.emailsParticipantes &&
        projeto.emailsParticipantes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Participantes ({projeto.emailsParticipantes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2">
                {projeto.emailsParticipantes.map(
                  (email: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center p-2 bg-muted rounded-lg"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{email}</p>
                        <p className="text-xs text-muted-foreground">
                          Participante
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Adicionais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Responsável</h4>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {projeto.usuario?.nome || user?.nome}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {projeto.usuario?.email || user?.email}
                  </p>
                </div>
              </div>
            </div>

            {projeto.urlEdital && (
              <div>
                <h4 className="font-medium mb-2">Edital</h4>
                <a
                  href={projeto.urlEdital}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Acessar Edital
                </a>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2">Data de Criação</h4>
              <p className="text-sm text-muted-foreground">
                {projeto.dataCriacao
                  ? format(
                      new Date(projeto.dataCriacao),
                      "dd/MM/yyyy 'às' HH:mm",
                      { locale: ptBR }
                    )
                  : "Não disponível"}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Termos Aceitos</h4>
              <Badge
                variant={projeto.aceitouTermos ? "default" : "destructive"}
              >
                {projeto.aceitouTermos ? "Sim" : "Não"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
