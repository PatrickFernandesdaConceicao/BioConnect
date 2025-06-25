"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useEventos } from "@/contexts/AppContext";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const eventoSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  curso: z.string().min(1, "Curso é obrigatório"),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
  dataTermino: z.string().min(1, "Data de término é obrigatória"),
  local: z.string().min(1, "Local é obrigatório"),
  justificativa: z.string().min(1, "Justificativa é obrigatória"),
  vlTotalSolicitado: z.number().min(0, "Valor deve ser positivo"),
  vlTotalAprovado: z.number().min(0, "Valor deve ser positivo"),
});

type EventoFormValues = z.infer<typeof eventoSchema>;

export default function EditEventoPage() {
  const params = useParams();
  const router = useRouter();
  const { hasPermission } = useAuth();
  const { eventos, updateEvento } = useEventos();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const eventoId = params.id as string;
  const evento = eventos.find((e) => e.id.toString() === eventoId);

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

  useEffect(() => {
    if (evento) {
      form.reset({
        titulo: evento.titulo,
        curso: evento.curso,
        dataInicio: evento.dataInicio,
        dataTermino: evento.dataTermino,
        local: evento.local,
        justificativa: evento.justificativa,
        vlTotalSolicitado: evento.vlTotalSolicitado,
        vlTotalAprovado: evento.vlTotalAprovado,
      });
    }
  }, [evento, form]);

  if (!hasPermission("ADMIN")) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Acesso Negado</h1>
        <p className="text-muted-foreground">
          Você não tem permissão para editar eventos.
        </p>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Evento não encontrado</h1>
        <Link href="/eventos">
          <Button className="mt-4">Voltar para Eventos</Button>
        </Link>
      </div>
    );
  }

  async function onSubmit(values: EventoFormValues) {
    setIsSubmitting(true);
    try {
      if (!evento) {
        toast.error("Evento não encontrado para atualizar.");
        setIsSubmitting(false);
        return;
      }
      await updateEvento(evento.id, values);
      toast.success("Evento atualizado com sucesso!");
      router.push(`/eventos/${evento.id}`);
    } catch (error) {
      toast.error("Erro ao atualizar evento");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/eventos/${evento.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Evento</h1>
          <p className="text-muted-foreground">{evento.titulo}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Evento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="dataInicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Início</FormLabel>
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
                      <FormLabel>Data de Término</FormLabel>
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
                    <FormLabel>Local</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Justificativa</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="vlTotalSolicitado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Solicitado</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
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
                      <FormLabel>Valor Aprovado</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Link href={`/eventos/${evento.id}`}>
              <Button variant="outline" disabled={isSubmitting}>
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
