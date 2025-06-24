"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEventos } from "@/contexts/AppContext";
import { useAuth } from "@/lib/auth";
import { EventoData } from "@/services/api";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Save,
  Calendar,
  MapPin,
  Users,
  Plus,
  X,
  Shield,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const eventoSchema = z.object({
  titulo: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
  curso: z.string().min(1, "O curso é obrigatório"),
  dataInicio: z.string().min(1, "A data de início é obrigatória"),
  dataTermino: z.string().min(1, "A data de término é obrigatória"),
  local: z.string().min(3, "O local deve ter pelo menos 3 caracteres"),
  justificativa: z
    .string()
    .min(20, "A justificativa deve ter pelo menos 20 caracteres"),
  vlTotalSolicitado: z.number().min(0, "O valor não pode ser negativo"),
  vlTotalAprovado: z.number().min(0, "O valor não pode ser negativo"),
});

type EventoFormValues = z.infer<typeof eventoSchema>;

const cursosDisponiveis = [
  "Análise e Desenvolvimento de Sistemas",
  "Engenharia de Software",
  "Biotecnologia",
  "Enfermagem",
  "Engenharia Biomédica",
  "Ciências Biológicas",
  "Administração",
  "Todos os Cursos",
];

export default function NewEventoPage() {
  const router = useRouter();
  const { hasPermission } = useAuth();
  const { createEvento } = useEventos();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [participantes, setParticipantes] = useState<
    Array<{ nome: string; email: string }>
  >([]);
  const [nomeParticipante, setNomeParticipante] = useState("");
  const [emailParticipante, setEmailParticipante] = useState("");

  const form = useForm<EventoFormValues>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      titulo: "",
      curso: "",
      dataInicio: "",
      dataTermino: "",
      local: "",
      justificativa: "",
      vlTotalSolicitado: 0,
      vlTotalAprovado: 0,
    },
  });

  const handleAddParticipante = () => {
    if (nomeParticipante && emailParticipante) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailParticipante)) {
        toast.error("Email inválido");
        return;
      }

      const jaExiste = participantes.some((p) => p.email === emailParticipante);
      if (jaExiste) {
        toast.error("Participante já adicionado");
        return;
      }

      setParticipantes([
        ...participantes,
        { nome: nomeParticipante, email: emailParticipante },
      ]);
      setNomeParticipante("");
      setEmailParticipante("");
    }
  };

  const handleRemoveParticipante = (email: string) => {
    setParticipantes(participantes.filter((p) => p.email !== email));
  };

  async function onSubmit(values: EventoFormValues) {
    setIsSubmitting(true);

    try {
      const eventoData: EventoData = {
        ...values,
        participantes: participantes,
      };

      await createEvento(eventoData);
      toast.success("Evento criado com sucesso!");
      router.push("/eventos");
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      toast.error("Erro ao criar evento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/eventos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Novo Evento</h1>
          <p className="text-muted-foreground">Crie um novo evento acadêmico</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">
                <Calendar className="mr-2 h-4 w-4" />
                Informações
              </TabsTrigger>
              <TabsTrigger value="financeiro">
                <MapPin className="mr-2 h-4 w-4" />
                Financeiro
              </TabsTrigger>
              <TabsTrigger value="participantes">
                <Users className="mr-2 h-4 w-4" />
                Participantes
              </TabsTrigger>
            </TabsList>

            {/* Tab: Informações */}
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Evento</CardTitle>
                  <CardDescription>Dados básicos do evento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título do Evento *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o título do evento"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="curso"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Curso *</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="">Selecione o curso</option>
                              {cursosDisponiveis.map((curso) => (
                                <option key={curso} value={curso}>
                                  {curso}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="local"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Local *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Auditório Principal, Lab 01"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dataInicio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Início *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dataTermino"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Término *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="justificativa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Justificativa *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva a justificativa e objetivos do evento"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Mínimo de 20 caracteres
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Financeiro */}
            <TabsContent value="financeiro">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Financeiras</CardTitle>
                  <CardDescription>
                    Orçamento solicitado e aprovado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="vlTotalSolicitado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Total Solicitado (R$) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0,00"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Valor total solicitado para o evento
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vlTotalAprovado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Total Aprovado (R$) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0,00"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Valor aprovado pela administração
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                      <div>
                        <p className="text-yellow-800 text-sm font-medium">
                          Informação sobre Orçamento
                        </p>
                        <p className="text-yellow-700 text-sm">
                          O valor aprovado pode ser igual ou menor que o
                          solicitado, dependendo da disponibilidade
                          orçamentária.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Participantes */}
            <TabsContent value="participantes">
              <Card>
                <CardHeader>
                  <CardTitle>Participantes do Evento</CardTitle>
                  <CardDescription>
                    Adicione os participantes do evento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <FormLabel>Adicionar Participante</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <Input
                        placeholder="Nome completo"
                        value={nomeParticipante}
                        onChange={(e) => setNomeParticipante(e.target.value)}
                      />
                      <Input
                        type="email"
                        placeholder="email@exemplo.com"
                        value={emailParticipante}
                        onChange={(e) => setEmailParticipante(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddParticipante();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={handleAddParticipante}
                        disabled={!nomeParticipante || !emailParticipante}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </div>

                  {participantes.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Participantes adicionados ({participantes.length}):
                      </p>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {participantes.map((participante, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-muted p-3 rounded"
                          >
                            <div>
                              <p className="text-sm font-medium">
                                {participante.nome}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {participante.email}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveParticipante(participante.email)
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground">
                    <p>
                      <strong>Dica:</strong> Os participantes podem ser
                      adicionados agora ou editados posteriormente através da
                      página de edição do evento.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Ações */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <Link href="/eventos">
                  <Button variant="outline" disabled={isSubmitting}>
                    Cancelar
                  </Button>
                </Link>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Criar Evento
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
