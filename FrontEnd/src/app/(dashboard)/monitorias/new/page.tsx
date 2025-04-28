// app/(dashboard)/monitorias/new/page.tsx
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
  Calendar,
  Clock,
  GraduationCap,
  Book,
  School,
} from "lucide-react";

// Esquema de validação do formulário
const monitoriaSchema = z.object({
  disciplinaId: z.string({
    required_error: "Selecione uma disciplina",
  }),
  cursoId: z.string({
    required_error: "Selecione um curso",
  }),
  semestre: z.string({
    required_error: "Selecione o semestre",
  }),
  cargaHoraria: z.string().min(1, {
    message: "A carga horária é obrigatória",
  }),
  startDate: z.string({
    required_error: "A data de início é obrigatória",
  }),
  endDate: z.string({
    required_error: "A data de término é obrigatória",
  }),
  diasSemana: z.array(z.string()).min(1, {
    message: "Selecione pelo menos um dia da semana",
  }),
  horarioInicio: z.string({
    required_error: "O horário de início é obrigatório",
  }),
  horarioFim: z.string({
    required_error: "O horário de término é obrigatório",
  }),
  sala: z.string().optional(),
  bolsa: z.boolean().default(false),
  valorBolsa: z.string().optional(),
  requisitos: z.string().optional(),
  atividades: z.string().optional(),
  alunoPreSelecionado: z.string().optional(),
  hasTerms: z.boolean().default(false),
});

type MonitoriaFormValues = z.infer<typeof monitoriaSchema>;

// Dados fictícios para os selects
const mockDisciplinas = [
  { id: "1", nome: "Algoritmos e Estruturas de Dados" },
  { id: "2", nome: "Cálculo I" },
  { id: "3", nome: "Bioquímica Celular" },
  { id: "4", nome: "Anatomia Humana" },
  { id: "5", nome: "Programação Web" },
  { id: "6", nome: "Microbiologia" },
];

const mockCursos = [
  { id: "1", nome: "Análise e Desenvolvimento de Sistemas" },
  { id: "2", nome: "Engenharia de Software" },
  { id: "3", nome: "Biotecnologia" },
  { id: "4", nome: "Enfermagem" },
  { id: "5", nome: "Engenharia" },
];

const diasSemana = [
  { id: "dom", label: "Domingo" },
  { id: "seg", label: "Segunda-feira" },
  { id: "ter", label: "Terça-feira" },
  { id: "qua", label: "Quarta-feira" },
  { id: "qui", label: "Quinta-feira" },
  { id: "sex", label: "Sexta-feira" },
  { id: "sab", label: "Sábado" },
];

export default function NewMonitoriaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  // Valores padrão para o formulário
  const defaultValues: Partial<MonitoriaFormValues> = {
    disciplinaId: "",
    cursoId: "",
    semestre: "",
    cargaHoraria: "",
    startDate: "",
    endDate: "",
    diasSemana: [],
    horarioInicio: "",
    horarioFim: "",
    sala: "",
    bolsa: false,
    valorBolsa: "",
    requisitos: "",
    atividades: "",
    alunoPreSelecionado: "",
    hasTerms: false,
  };

  // Configuração do formulário
  const form = useForm<MonitoriaFormValues>({
    resolver: zodResolver(monitoriaSchema),
    defaultValues,
  });

  // Observar campos para lógica condicional
  const watchBolsa = form.watch("bolsa");

  // Função para lidar com o envio do formulário
  async function onSubmit(values: MonitoriaFormValues) {
    setIsSubmitting(true);

    try {
      // Verificar se a data de término é posterior à de início
      if (new Date(values.endDate) <= new Date(values.startDate)) {
        Sonner({
          title: "Erro de validação",
          description: "A data de término deve ser posterior à data de início.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Verificar se o horário de término é posterior ao de início
      const [horaInicio, minInicio] = values.horarioInicio
        .split(":")
        .map(Number);
      const [horaFim, minFim] = values.horarioFim.split(":").map(Number);

      if (
        horaFim < horaInicio ||
        (horaFim === horaInicio && minFim <= minInicio)
      ) {
        Sonner({
          title: "Erro de validação",
          description:
            "O horário de término deve ser posterior ao horário de início.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Dados processados da monitoria
      const monitoriaData = {
        ...values,
        cargaHoraria: parseInt(values.cargaHoraria),
        valorBolsa:
          values.bolsa && values.valorBolsa
            ? parseFloat(
                values.valorBolsa.replace(/[^\d.,]/g, "").replace(",", ".")
              )
            : null,
      };

      // Simulação de envio (seria substituído pela chamada real à API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Dados da monitoria:", monitoriaData);

      // Exibir mensagem de sucesso
      Sonner({
        title: "Monitoria cadastrada com sucesso!",
        description: "A monitoria foi enviada para aprovação.",
      });

      // Redirecionar para a lista de monitorias
      router.push("/monitorias");
    } catch (error) {
      console.error("Erro ao cadastrar monitoria:", error);
      Sonner({
        title: "Erro ao cadastrar monitoria",
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
          <Link href="/monitorias">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Nova Monitoria</h1>
            <p className="text-muted-foreground">
              Cadastre uma nova monitoria acadêmica
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulário de Cadastro de Monitoria</CardTitle>
          <CardDescription>
            Preencha as informações da monitoria. Os campos marcados com * são
            obrigatórios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Informações Básicas</TabsTrigger>
              <TabsTrigger value="horarios">Horários</TabsTrigger>
              <TabsTrigger value="extras">Informações Adicionais</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form
                id="monitoria-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 mt-4"
              >
                <TabsContent value="info" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="disciplinaId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Disciplina *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma disciplina" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockDisciplinas.map((disciplina) => (
                                <SelectItem
                                  key={disciplina.id}
                                  value={disciplina.id}
                                >
                                  {disciplina.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cursoId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Curso *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um curso" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockCursos.map((curso) => (
                                <SelectItem key={curso.id} value={curso.id}>
                                  {curso.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="semestre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Semestre *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um semestre" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="2025/1">2025/1</SelectItem>
                              <SelectItem value="2025/2">2025/2</SelectItem>
                              <SelectItem value="2026/1">2026/1</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cargaHoraria"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carga Horária Semanal (horas) *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                placeholder="Ex: 20"
                                className="pl-8"
                                min="1"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Início *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="date" className="pl-8" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Término *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="date" className="pl-8" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("horarios")}
                    >
                      Próximo
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="horarios" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="diasSemana"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">
                            Dias da Semana *
                          </FormLabel>
                          <FormDescription>
                            Selecione os dias em que a monitoria será oferecida
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {diasSemana.map((dia) => (
                            <FormField
                              key={dia.id}
                              control={form.control}
                              name="diasSemana"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={dia.id}
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(dia.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                dia.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== dia.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {dia.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="horarioInicio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário de Início *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="time" className="pl-8" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="horarioFim"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário de Término *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="time" className="pl-8" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="sala"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sala/Local</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <School className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Ex: Laboratório de Informática - Bloco A"
                              className="pl-8"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Informe o local onde a monitoria será realizada
                          (opcional)
                        </FormDescription>
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
                      onClick={() => setActiveTab("extras")}
                    >
                      Próximo
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="extras" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="bolsa"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-base">
                            Monitoria com Bolsa
                          </FormLabel>
                          <FormDescription>
                            Marque esta opção se a monitoria oferece bolsa de
                            auxílio
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {watchBolsa && (
                    <FormField
                      control={form.control}
                      name="valorBolsa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor da Bolsa (R$)</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Ex: 400,00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="requisitos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requisitos para o Monitor</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ex: Ter cursado a disciplina com nota maior que 8,0; Conhecimentos em..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Descreva os requisitos necessários para candidatura à
                          vaga
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="atividades"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Atividades do Monitor</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ex: Auxiliar alunos com dúvidas; Preparar material de apoio..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Descreva as atividades que serão realizadas pelo
                          monitor
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alunoPreSelecionado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aluno Pré-selecionado</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <GraduationCap className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Nome ou Matrícula do Aluno"
                              className="pl-8"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Se houver um aluno já indicado para a monitoria,
                          informe aqui
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
                            verdadeiras e que a monitoria está de acordo com as
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
                      onClick={() => setActiveTab("horarios")}
                    >
                      Voltar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !form.formState.isValid}
                    >
                      {isSubmitting ? "Enviando..." : "Cadastrar Monitoria"}
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
            <Link href="/monitorias">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button form="monitoria-form" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Salvar Monitoria"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
