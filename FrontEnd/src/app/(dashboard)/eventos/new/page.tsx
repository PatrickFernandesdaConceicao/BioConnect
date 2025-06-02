"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import EventoService from "../../../services/api";

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
import { toast } from "sonner";
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
  User,
  Plus,
  Trash2,
} from "lucide-react";

const eventoSchema = z.object({
  titulo: z
    .string()
    .min(5, { message: "O título deve ter pelo menos 5 caracteres" }),
  curso: z.string().optional(),
  dataInicio: z.string({ required_error: "A data de início é obrigatória" }),
  dataTermino: z.string({ required_error: "A data de término é obrigatória" }),
  local: z
    .string()
    .min(3, { message: "O local deve ter pelo menos 3 caracteres" }),
  justificativa: z
    .string()
    .min(20, { message: "A justificativa deve ter pelo menos 20 caracteres" }),
  vlTotalSolicitado: z
    .string()
    .min(1)
    .refine((val) => parseFloat(val) >= 0, {
      message: "O valor não pode ser negativo",
    }),
  vlTotalAprovado: z
    .string()
    .min(1)
    .refine((val) => parseFloat(val) >= 0, {
      message: "O valor não pode ser negativo",
    }),
  participantes: z
    .array(
      z.object({
        nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
        email: z.string().email("Email inválido"),
      })
    )
    .optional(),
});

type EventoFormValues = z.infer<typeof eventoSchema>;

export default function NewEventoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [participantes, setParticipantes] = useState<
    { nome: string; email: string }[]
  >([]);
  const [novoParticipante, setNovoParticipante] = useState({
    nome: "",
    email: "",
  });

  const defaultValues: Partial<EventoFormValues> = {
    titulo: "",
    curso: "",
    dataInicio: "",
    dataTermino: "",
    local: "",
    justificativa: "",
    vlTotalSolicitado: "0",
    vlTotalAprovado: "0",
    participantes: [],
  };

  const form = useForm<EventoFormValues>({
    resolver: zodResolver(eventoSchema),
    defaultValues,
  });

  const adicionarParticipante = () => {
    if (novoParticipante.nome && novoParticipante.email) {
      setParticipantes([...participantes, novoParticipante]);
      setNovoParticipante({ nome: "", email: "" });
    }
  };

  const removerParticipante = (index: number) => {
    setParticipantes(participantes.filter((_, i) => i !== index));
  };

  async function onSubmit(values: EventoFormValues) {
    setIsSubmitting(true);

    try {
      const dataInicio = new Date(values.dataInicio);
      const dataTermino = new Date(values.dataTermino);

      if (dataTermino <= dataInicio) {
        toast.error("A data de término deve ser posterior à data de início.");
        setIsSubmitting(false);
        return;
      }

      const eventData = {
        ...values,
        vlTotalSolicitado: parseFloat(values.vlTotalSolicitado),
        vlTotalAprovado: parseFloat(values.vlTotalAprovado),
        participantes,
      };

      const response = await EventoService.criarEvento(eventData);

      toast.success(`Evento "${response.titulo}" criado com sucesso!`);
      router.push("/eventos");
    } catch (error) {
      console.error(error);
      toast.error(
        "Erro ao cadastrar evento. Verifique os dados e tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/eventos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Novo Evento</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Evento</CardTitle>
          <CardDescription>
            Preencha os dados do evento institucional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="participants">Participantes</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 mt-4"
              >
                <TabsContent value="info" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Simpósio de Robótica"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="curso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Curso</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Engenharia" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
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
                    name="local"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Auditório 1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="justificativa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Justificativa *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva a justificativa"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="vlTotalSolicitado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Solicitado *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vlTotalAprovado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Aprovado *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="participants" className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Nome"
                      value={novoParticipante.nome}
                      onChange={(e) =>
                        setNovoParticipante({
                          ...novoParticipante,
                          nome: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Email"
                      value={novoParticipante.email}
                      onChange={(e) =>
                        setNovoParticipante({
                          ...novoParticipante,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={adicionarParticipante}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Adicionar Participante
                  </Button>

                  <ul className="mt-4 space-y-2">
                    {participantes.map((p, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between border p-2 rounded"
                      >
                        <span>
                          {p.nome} - {p.email}
                        </span>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removerParticipante(idx)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="w-4 h-4 mr-2" /> Salvar Evento
                  </Button>
                </div>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
