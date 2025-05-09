// app/(dashboard)/eventos/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Sonner } from "@/components/ui/sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Save,
  Upload,
  Calendar,
  MapPin,
  Clock,
  Users,
} from "lucide-react";

// Esquema de validação do formulário
const eventoSchema = z.object({
  title: z.string().min(5, {
    message: "O título deve ter pelo menos 5 caracteres",
  }),
  description: z.string().min(20, {
    message: "A descrição deve ter pelo menos 20 caracteres",
  }),
  location: z.string().min(3, {
    message: "A localização deve ter pelo menos 3 caracteres",
  }),
  startDate: z.string({
    required_error: "A data de início é obrigatória",
  }),
  startTime: z.string({
    required_error: "O horário de início é obrigatório",
  }),
  endDate: z.string({
    required_error: "A data de término é obrigatória",
  }),
  endTime: z.string({
    required_error: "O horário de término é obrigatório",
  }),
  maxParticipants: z.string().optional(),
  eventType: z.string({
    required_error: "Selecione um tipo de evento",
  }),
  isPublic: z.boolean().default(true),
  requiresRegistration: z.boolean().default(true),
  hasAttendanceCertificate: z.boolean().default(false),
  targetAudience: z.string().optional(),
  contactEmail: z
    .string()
    .email({
      message: "Digite um email válido",
    })
    .optional(),
  contactPhone: z.string().optional(),
  additionalInfo: z.string().optional(),
  participantEmails: z.string().optional(),
  hasTerms: z.boolean().default(false),
});

type EventoFormValues = z.infer<typeof eventoSchema>;

export default function NewEventoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  // Valores padrão para o formulário
  const defaultValues: Partial<EventoFormValues> = {
    title: "",
    description: "",
    location: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    maxParticipants: "",
    eventType: "",
    isPublic: true,
    requiresRegistration: true,
    hasAttendanceCertificate: false,
    targetAudience: "",
    contactEmail: "",
    contactPhone: "",
    additionalInfo: "",
    participantEmails: "",
    hasTerms: false,
  };

  // Configuração do formulário
  const form = useForm<EventoFormValues>({
    resolver: zodResolver(eventoSchema),
    defaultValues,
  });

  // Observar campos para lógica condicional
  const requiresRegistration = form.watch("requiresRegistration");

  // Função para lidar com o envio do formulário
  async function onSubmit(values: EventoFormValues) {
    setIsSubmitting(true);

    try {
      // Combinação de data e hora
      const startDateTime = `${values.startDate}T${values.startTime}:00`;
      const endDateTime = `${values.endDate}T${values.endTime}:00`;

      // Verificar se a data/hora de término é posterior à de início
      if (new Date(endDateTime) <= new Date(startDateTime)) {
        Sonner({
          title: "Erro de validação",
          description:
            "A data/hora de término deve ser posterior à data/hora de início.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Dados processados do evento
      const eventData = {
        ...values,
        startDateTime,
        endDateTime,
        maxParticipants: values.maxParticipants
          ? parseInt(values.maxParticipants)
          : null,
      };

      // Simulação de envio (seria substituído pela chamada real à API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Dados do evento:", eventData);

      // Exibir mensagem de sucesso
      Sonner({
        title: "Evento cadastrado com sucesso!",
        description: "O evento foi enviado para aprovação.",
      });

      // Redirecionar para a lista de eventos
      router.push("/eventos");
    } catch (error) {
      console.error("Erro ao cadastrar evento:", error);
      Sonner({
        title: "Erro ao cadastrar evento",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/eventos">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Novo Evento</h1>
            <p className="text-muted-foreground">
              Cadastre um novo evento institucional
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulário de Cadastro de Evento</CardTitle>
          <CardDescription>
            Preencha as informações do evento. Os campos marcados com * são
            obrigatórios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Informações Básicas</TabsTrigger>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="participants">Participantes</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form
                id="evento-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 mt-4"
              >
                <TabsContent value="info" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título do Evento *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Workshop de Biotecnologia Aplicada"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          O título deve ser claro e representar o tema principal
                          do evento.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva o evento, seus objetivos e público-alvo"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eventType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Evento *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="palestra">Palestra</SelectItem>
                            <SelectItem value="seminario">Seminário</SelectItem>
                            <SelectItem value="congresso">Congresso</SelectItem>
                            <SelectItem value="feira">Feira</SelectItem>
                            <SelectItem value="hackathon">Hackathon</SelectItem>
                            <SelectItem value="curso">Curso</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local *</FormLabel>
                        <FormControl>
                          <div className="flex space-x-2">
                            <div className="relative flex-1">
                              <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Ex: Auditório Principal - Bloco A"
                                className="pl-8"
                                {...field}
                              />
                            </div>
                            <Button type="button" variant="outline" size="icon">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Informe o local onde o evento será realizado
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Início *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="date"
                                  className="pl-8"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Horário de Início *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="time"
                                  className="pl-8"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Término *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="date"
                                  className="pl-8"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Horário de Término *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="time"
                                  className="pl-8"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("details")}
                    >
                      Próximo
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="maxParticipants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número Máximo de Participantes</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                placeholder="Ex: 50"
                                className="pl-8"
                                min="1"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Deixe em branco para capacidade ilimitada
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="targetAudience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Público-Alvo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Estudantes de biotecnologia, pesquisadores"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email de Contato</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="contato@exemplo.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone de Contato</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Evento Público
                          </FormLabel>
                          <FormDescription>
                            Se habilitado, o evento será visível para todos os
                            usuários.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requiresRegistration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Requer Inscrição
                          </FormLabel>
                          <FormDescription>
                            Se habilitado, os participantes precisarão se
                            inscrever previamente.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {requiresRegistration && (
                    <FormField
                      control={form.control}
                      name="hasAttendanceCertificate"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Emitir Certificado
                            </FormLabel>
                            <FormDescription>
                              Se habilitado, certificados de participação serão
                              emitidos automaticamente.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Informações Adicionais</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Informações extras sobre o evento, como programação, palestrantes, etc."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("info")}
                    >
                      Voltar
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab("participants")}
                    >
                      Próximo
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="participants" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="participantEmails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Convidar Participantes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Digite os emails separados por vírgula ou linha"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Opcionalmente, você pode convidar participantes
                          diretamente
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Termos e Condições</FormLabel>
                          <FormDescription>
                            Declaro que as informações fornecidas são
                            verdadeiras e que o evento está de acordo com as
                            normas da instituição.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("details")}
                    >
                      Voltar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !form.formState.isValid}
                    >
                      {isSubmitting ? "Enviando..." : "Cadastrar Evento"}
                      <Save className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-between">
          <p className="text-sm text-muted-foreground">* Campos obrigatórios</p>
          <div className="flex space-x-2">
            <Link href="/eventos">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button form="evento-form" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Salvar Evento"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
