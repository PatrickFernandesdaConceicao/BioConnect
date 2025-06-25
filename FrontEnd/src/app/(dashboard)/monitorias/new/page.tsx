"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMonitorias, useMasterData } from "@/contexts/AppContext";
import { MonitoriaData } from "@/services/api";

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
  Clock,
  GraduationCap,
  Book,
  School,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const monitoriaSchema = z.object({
  disciplinaId: z.string().min(1, "Selecione uma disciplina"),
  cursoId: z.string().min(1, "Selecione um curso"),
  semestre: z.string().min(1, "Selecione o semestre"),
  cargaHoraria: z.string().min(1, "A carga horária é obrigatória"),
  dataInicio: z.string().min(1, "A data de início é obrigatória"),
  dataTermino: z.string().min(1, "A data de término é obrigatória"),
  diasSemana: z
    .array(z.string())
    .min(1, "Selecione pelo menos um dia da semana"),
  horarioInicio: z.string().min(1, "O horário de início é obrigatório"),
  horarioTermino: z.string().min(1, "O horário de término é obrigatório"),
  sala: z.string().optional(),
  bolsa: z.boolean(),
  valorBolsa: z.string().optional(),
  requisitos: z.string().optional(),
  atividades: z.string().optional(),
  alunoPreSelecionado: z.string().optional(),
  termosAceitos: z
    .boolean()
    .refine((val) => val === true, "Você deve aceitar os termos"),
});

type MonitoriaFormValues = z.infer<typeof monitoriaSchema>;

const diasSemana = [
  { id: "DOMINGO", label: "Domingo" },
  { id: "SEGUNDA", label: "Segunda-feira" },
  { id: "TERCA", label: "Terça-feira" },
  { id: "QUARTA", label: "Quarta-feira" },
  { id: "QUINTA", label: "Quinta-feira" },
  { id: "SEXTA", label: "Sexta-feira" },
  { id: "SABADO", label: "Sábado" },
];

const semestres = ["2024/1", "2024/2", "2025/1", "2025/2", "2026/1", "2026/2"];

export default function NewMonitoriaPage() {
  const router = useRouter();
  const { createMonitoria } = useMonitorias();
  const {
    disciplinas,
    cursos,
    fetchMasterData,
    loading: masterDataLoading,
  } = useMasterData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basicas");

  const form = useForm<MonitoriaFormValues>({
    resolver: zodResolver(monitoriaSchema),
    defaultValues: {
      disciplinaId: "",
      cursoId: "",
      semestre: "",
      cargaHoraria: "",
      dataInicio: "",
      dataTermino: "",
      diasSemana: [],
      horarioInicio: "",
      horarioTermino: "",
      sala: "",
      bolsa: false,
      valorBolsa: "",
      requisitos: "",
      atividades: "",
      alunoPreSelecionado: "",
      termosAceitos: false,
    },
  });

  const bolsa = form.watch("bolsa");
  const diasSelecionados = form.watch("diasSemana");

  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  const toggleDiaSemana = (dia: string) => {
    const currentDias = form.getValues("diasSemana");
    const novosDias = currentDias.includes(dia)
      ? currentDias.filter((d) => d !== dia)
      : [...currentDias, dia];

    form.setValue("diasSemana", novosDias);
  };

  async function onSubmit(values: MonitoriaFormValues) {
    setIsSubmitting(true);

    try {
      const monitoriaData: MonitoriaData = {
        disciplinaId: parseInt(values.disciplinaId),
        cursoId: parseInt(values.cursoId),
        semestre: values.semestre,
        cargaHoraria: parseInt(values.cargaHoraria),
        dataInicio: values.dataInicio,
        dataTermino: values.dataTermino,
        diasSemana: values.diasSemana,
        horarioInicio: values.horarioInicio,
        horarioTermino: values.horarioTermino,
        sala: values.sala || "",
        bolsa: values.bolsa,
        valorBolsa:
          values.bolsa && values.valorBolsa
            ? parseFloat(values.valorBolsa)
            : undefined,
        requisitos: values.requisitos || "",
        atividades: values.atividades || "",
        alunoPreSelecionado: values.alunoPreSelecionado || "",
        termosAceitos: values.termosAceitos,
      };

      await createMonitoria(monitoriaData);
      toast.success("Monitoria criada com sucesso!");
      router.push("/monitorias");
    } catch (error) {
      console.error("Erro ao criar monitoria:", error);
      toast.error("Erro ao criar monitoria. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/monitorias">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Nova Monitoria</h1>
          <p className="text-muted-foreground">
            Crie uma nova oportunidade de monitoria
          </p>
        </div>
      </div>

      {/* Loading Master Data */}
      {masterDataLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <p className="text-blue-800 text-sm">
              Carregando disciplinas e cursos...
            </p>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basicas">
                <Book className="mr-2 h-4 w-4" />
                Básicas
              </TabsTrigger>
              <TabsTrigger value="horarios">
                <Clock className="mr-2 h-4 w-4" />
                Horários
              </TabsTrigger>
              <TabsTrigger value="detalhes">
                <GraduationCap className="mr-2 h-4 w-4" />
                Detalhes
              </TabsTrigger>
            </TabsList>

            {/* Tab: Informações Básicas */}
            <TabsContent value="basicas">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>
                    Dados principais da monitoria
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <SelectValue placeholder="Selecione a disciplina" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {disciplinas.map((disciplina) => (
                                <SelectItem
                                  key={disciplina.id}
                                  value={disciplina.id.toString()}
                                >
                                  {disciplina.nome} ({disciplina.codigo})
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
                                <SelectValue placeholder="Selecione o curso" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cursos.map((curso) => (
                                <SelectItem
                                  key={curso.id}
                                  value={curso.id.toString()}
                                >
                                  {curso.nome}
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
                                <SelectValue placeholder="Selecione o semestre" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {semestres.map((semestre) => (
                                <SelectItem key={semestre} value={semestre}>
                                  {semestre}
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
                      name="cargaHoraria"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carga Horária (horas) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="Ex: 60"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Horários */}
            <TabsContent value="horarios">
              <Card>
                <CardHeader>
                  <CardTitle>Horários e Local</CardTitle>
                  <CardDescription>
                    Configure os dias, horários e local da monitoria
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <FormLabel>Dias da Semana *</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {diasSemana.map((dia) => (
                        <div
                          key={dia.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={dia.id}
                            checked={diasSelecionados.includes(dia.id)}
                            onCheckedChange={() => toggleDiaSemana(dia.id)}
                          />
                          <label
                            htmlFor={dia.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {dia.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.diasSemana && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.diasSemana.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="horarioInicio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário de Início *</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="horarioTermino"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário de Término *</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sala"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sala (Opcional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Lab 01, Sala 203"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Detalhes */}
            <TabsContent value="detalhes">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes da Monitoria</CardTitle>
                  <CardDescription>
                    Informações adicionais e requisitos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="bolsa"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Monitoria com Bolsa
                          </FormLabel>
                          <FormDescription>
                            Esta monitoria oferece bolsa aos monitores?
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

                  {bolsa && (
                    <FormField
                      control={form.control}
                      name="valorBolsa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor da Bolsa (R$)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0,00"
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
                        <FormLabel>Requisitos (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ex: Ter cursado a disciplina com aproveitamento mínimo de 8.0"
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
                    name="atividades"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Atividades (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ex: Auxiliar nas aulas práticas, tirar dúvidas dos alunos"
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
                    name="alunoPreSelecionado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aluno Pré-selecionado (Opcional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome completo do aluno"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Termos e Ações */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="termosAceitos"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Aceito os termos e condições *</FormLabel>
                        <FormDescription>
                          Estou ciente das responsabilidades da monitoria.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-between pt-4">
                  <Link href="/monitorias">
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
                        Criar Monitoria
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
