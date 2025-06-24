"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEventos } from "@/contexts/AppContext";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export default function EventoPage() {
  const params = useParams();
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  const { eventos, updateEvento, loading } = useEventos();

  // CORREÇÃO PRINCIPAL: Validação segura do ID
  const rawId = params?.id;
  const eventoId = rawId ? (Array.isArray(rawId) ? rawId[0] : rawId) : null;

  console.log("Raw ID:", rawId);
  console.log("Processed ID:", eventoId);
  console.log(
    "Eventos disponíveis:",
    eventos.map((e) => ({ id: e.id, titulo: e.titulo }))
  );

  // Buscar evento com validação robusta
  const evento = eventoId
    ? eventos.find((e) => {
        const eventoIdStr = e.id?.toString();
        const paramIdStr = eventoId.toString();
        console.log(
          `Comparando evento.id: ${eventoIdStr} com param: ${paramIdStr}`
        );
        return eventoIdStr === paramIdStr;
      })
    : null;

  console.log("Evento encontrado:", evento);

  // Estados de loading
  if (loading.eventos) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Validação de ID
  if (!eventoId || eventoId === "undefined" || eventoId === "null") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">ID do evento inválido</h1>
          <p className="text-muted-foreground">
            O ID do evento não foi fornecido ou é inválido: "{rawId}"
          </p>
          <Link href="/eventos">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Eventos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Evento não encontrado
  if (!evento) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Evento não encontrado</h1>
          <p className="text-muted-foreground">
            O evento com ID "{eventoId}" não foi encontrado.
          </p>
          <div className="mt-4 space-x-2">
            <Link href="/eventos">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Eventos
              </Button>
            </Link>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Recarregar Página
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAprovarEvento = async () => {
    try {
      await updateEvento(evento.id, { status: "APROVADO" });
      toast.success("Evento aprovado com sucesso!");
    } catch (error) {
      console.error("Erro ao aprovar evento:", error);
      toast.error("Erro ao aprovar evento");
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "APROVADO":
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case "PENDENTE":
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case "REJEITADO":
        return <Badge className="bg-red-500">Rejeitado</Badge>;
      default:
        return <Badge className="bg-gray-500">Pendente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/eventos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{evento.titulo}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {evento.curso}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge(evento.status)}

          {/* Botão de Aprovação - só para coordenadores/admins */}
          {hasPermission("ADMIN") && evento.status !== "APROVADO" && (
            <Button
              onClick={handleAprovarEvento}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Aprovar
            </Button>
          )}

          {hasPermission("ADMIN") && (
            <Link href={`/eventos/${evento.id}/edit`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Informações do Evento */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Período</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {evento.dataInicio
                ? format(new Date(evento.dataInicio), "dd/MM/yyyy", {
                    locale: ptBR,
                  })
                : "Não informado"}
            </div>
            <p className="text-xs text-muted-foreground">
              {evento.dataTermino
                ? `até ${format(new Date(evento.dataTermino), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}`
                : "Data de término não informada"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Local</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {evento.local || "Não informado"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {evento.participantes?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalhes Financeiros */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Financeiras</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Valor Solicitado
              </label>
              <p className="text-2xl font-bold">
                R$ {evento.vlTotalSolicitado?.toLocaleString() || "0"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Valor Aprovado
              </label>
              <p className="text-2xl font-bold">
                R$ {evento.vlTotalAprovado?.toLocaleString() || "0"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Justificativa */}
      <Card>
        <CardHeader>
          <CardTitle>Justificativa</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{evento.justificativa}</p>
        </CardContent>
      </Card>

      {/* Participantes */}
      {evento.participantes && evento.participantes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Participantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {evento.participantes.map((participante, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <div>
                    <p className="font-medium">{participante.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {participante.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
