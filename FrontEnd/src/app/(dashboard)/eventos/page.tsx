// app/(dashboard)/eventos/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Calendar,
  MoreVertical,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  CalendarDays,
  Filter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dados fictícios de eventos para demonstração
const mockEvents = [
  {
    id: "1",
    title: "Simpósio de Biotecnologia",
    description:
      "Apresentações e discussões sobre os avanços recentes em biotecnologia aplicada à saúde e agricultura.",
    location: "Auditório Principal - Bloco A",
    status: "EM_ANDAMENTO",
    startDate: "2025-04-30T09:00:00",
    endDate: "2025-04-30T17:00:00",
    createdBy: "Prof. Ana Silva",
    participantsCount: 45,
    maxParticipants: 60,
  },
  {
    id: "2",
    title: "Workshop de IA em Saúde",
    description:
      "Workshop prático sobre implementação de soluções de IA para diagnósticos médicos.",
    location: "Laboratório de Informática - Bloco C",
    status: "PENDENTE",
    startDate: "2025-05-15T13:30:00",
    endDate: "2025-05-16T17:30:00",
    createdBy: "Prof. Paulo Mendes",
    participantsCount: 12,
    maxParticipants: 25,
  },
  {
    id: "3",
    title: "Palestra: Avanços em Biologia Molecular",
    description:
      "Palestra com o Dr. Roberto Santos sobre as últimas descobertas em biologia molecular.",
    location: "Sala de Conferências - Bloco B",
    status: "APROVADO",
    startDate: "2025-05-10T19:00:00",
    endDate: "2025-05-10T21:30:00",
    createdBy: "Coord. Maria Oliveira",
    participantsCount: 30,
    maxParticipants: 50,
  },
  {
    id: "4",
    title: "Hackathon de Soluções Sustentáveis",
    description:
      "Desafio de programação para desenvolver tecnologias voltadas à sustentabilidade.",
    location: "Centro de Inovação",
    status: "APROVADO",
    startDate: "2025-06-05T08:00:00",
    endDate: "2025-06-07T18:00:00",
    createdBy: "Prof. Carlos Souza",
    participantsCount: 40,
    maxParticipants: 60,
  },
  {
    id: "5",
    title: "Feira de Carreiras em Biotecnologia",
    description:
      "Evento para conectar alunos a oportunidades profissionais na área de biotecnologia.",
    location: "Pavilhão Central",
    status: "APROVADO",
    startDate: "2025-05-25T10:00:00",
    endDate: "2025-05-25T16:00:00",
    createdBy: "Depto. de Carreiras",
    participantsCount: 120,
    maxParticipants: 200,
  },
  {
    id: "6",
    title: "Mesa Redonda: Ética em Pesquisa",
    description:
      "Discussão sobre aspectos éticos na pesquisa científica com profissionais de diversas áreas.",
    location: "Auditório Secundário - Bloco A",
    status: "REJEITADO",
    startDate: "2025-05-20T14:00:00",
    endDate: "2025-05-20T17:00:00",
    createdBy: "Prof. Luciana Costa",
    participantsCount: 0,
    maxParticipants: 40,
  },
];

// Componente para exibir o status do evento com cores adequadas
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
      icon: <Calendar className="mr-1 h-3 w-3" />,
    },
    CONCLUIDO: {
      bg: "bg-purple-500",
      icon: <CheckCircle className="mr-1 h-3 w-3" />,
    },
    CANCELADO: {
      bg: "bg-gray-500",
      icon: <XCircle className="mr-1 h-3 w-3" />,
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

export default function EventosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [view, setView] = useState("cards");
  const [periodFilter, setPeriodFilter] = useState("");

  // Filtrar eventos com base nos critérios
  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      !statusFilter || statusFilter === "all" || event.status === statusFilter;

    // Filtrar por período (próximos 7 dias, 30 dias, etc.)
    let matchesPeriod = !periodFilter || periodFilter === "all";
    if (periodFilter && periodFilter !== "all") {
      const today = new Date();
      const eventDate = new Date(event.startDate);
      const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

      if (periodFilter === "7days" && (diffDays < 0 || diffDays > 7)) {
        matchesPeriod = false;
      } else if (periodFilter === "30days" && (diffDays < 0 || diffDays > 30)) {
        matchesPeriod = false;
      } else if (periodFilter === "past" && diffDays >= 0) {
        matchesPeriod = false;
      }
    }

    return matchesSearch && matchesStatus && matchesPeriod;
  });

  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return "Não definida";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Eventos</h1>
          <p className="text-muted-foreground">
            Gerencie eventos institucionais e inscrições
          </p>
        </div>
        <Link href="/eventos/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Evento
          </Button>
        </Link>
      </div>

      {/* Filtros e Pesquisa */}
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar eventos..."
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
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="PENDENTE">Pendente</SelectItem>
            <SelectItem value="APROVADO">Aprovado</SelectItem>
            <SelectItem value="REJEITADO">Rejeitado</SelectItem>
            <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
            <SelectItem value="CONCLUIDO">Concluído</SelectItem>
            <SelectItem value="CANCELADO">Cancelado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="7days">Próximos 7 dias</SelectItem>
            <SelectItem value="30days">Próximos 30 dias</SelectItem>
            <SelectItem value="past">Eventos passados</SelectItem>
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
            variant={view === "calendar" ? "default" : "ghost"}
            size="sm"
            className="rounded-l-none"
            onClick={() => setView("calendar")}
          >
            Calendário
          </Button>
        </div>
      </div>

      {/* Visualização por Cards */}
      {view === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
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
                          href={`/eventos/${event.id}`}
                          className="flex w-full"
                        >
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Inscrever-se</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Cancelar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="mt-1">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={event.status} />
                    <Badge variant="outline">
                      {event.participantsCount}/{event.maxParticipants}{" "}
                      participantes
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>
                      {formatDate(event.startDate)}
                      {event.endDate &&
                      event.startDate.split("T")[0] ===
                        event.endDate.split("T")[0]
                        ? ` - ${new Date(event.endDate).toLocaleTimeString(
                            "pt-BR",
                            { hour: "2-digit", minute: "2-digit" }
                          )}`
                        : event.endDate
                        ? ` até ${formatDate(event.endDate)}`
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm text-muted-foreground">
                    Criado por: {event.createdBy}
                  </span>
                  <Link href={`/eventos/${event.id}`}>
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

      {/* Visualização de Calendário (Simplificada) */}
      {view === "calendar" && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-slate-50 p-4 flex justify-between items-center border-b">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <h2 className="text-lg font-semibold">Maio 2025</h2>
            <Button variant="outline" size="sm">
              Próximo
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-px bg-slate-200">
            {/* Cabeçalho dos dias da semana */}
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
              <div
                key={day}
                className="bg-slate-50 p-2 text-center font-medium"
              >
                {day}
              </div>
            ))}

            {/* Dias do mês (exemplo simplificado) */}
            {Array(35)
              .fill(null)
              .map((_, index) => {
                const day = index - 2; // Ajuste para começar no dia correto da semana
                const isCurrentMonth = day > 0 && day <= 31;
                const dateStr = isCurrentMonth
                  ? `2025-05-${String(day).padStart(2, "0")}`
                  : "";

                // Encontrar eventos para este dia
                const dayEvents = mockEvents.filter((event) => {
                  if (!isCurrentMonth) return false;
                  const eventDate = new Date(event.startDate);
                  return (
                    eventDate.getDate() === day && eventDate.getMonth() === 4
                  ); // Maio é mês 4 (0-indexado)
                });

                return (
                  <div
                    key={index}
                    className={`bg-white p-1 min-h-[100px] ${
                      !isCurrentMonth ? "text-slate-300" : ""
                    }`}
                  >
                    <div className="p-1 font-medium">
                      {isCurrentMonth ? day : ""}
                    </div>
                    {dayEvents.map((event) => (
                      <Link href={`/eventos/${event.id}`} key={event.id}>
                        <div className="text-xs p-1 mb-1 rounded bg-blue-100 text-blue-800 truncate hover:bg-blue-200">
                          {new Date(event.startDate).toLocaleTimeString(
                            "pt-BR",
                            { hour: "2-digit", minute: "2-digit" }
                          )}{" "}
                          - {event.title}
                        </div>
                      </Link>
                    ))}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Mensagem quando não há eventos */}
      {filteredEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Nenhum evento encontrado</h3>
          <p className="text-muted-foreground mt-1">
            Não encontramos eventos que correspondam aos seus critérios de
            busca.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
              setPeriodFilter("");
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}

// Ícones adicionais para a visualização de calendário
const ChevronLeft = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
