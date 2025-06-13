// src/app/(dashboard)/monitorias/[id]/edit/page.tsx
"use client";

import { useParams } from "next/navigation";
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
} from "lucide-react";
import { toast } from "sonner";

// Schema de validação
const monitoriaSchema = z.object({
  disciplinaId: z.number({ required_error: "Selecione uma disciplina" }),
  cursoId: z.number({ required_error: "Selecione um curso" }),
  semestre: z.string({ required_error: "Selecione o semestre" }),
  cargaHoraria: z.number().min(1, { message: "A carga horária é obrigatória" }),
  dataInicio: z.string({ required_error: "A data de início é obrigatória" }),
  dataTermino: z.string({ required_error: "A data de término é obrigatória" }),
  diasSemana: z
    .array(z.string())
    .min(1, { message: "Selecione pelo menos um dia da semana" }),
  horarioInicio: z.string({
    required_error: "O horário de início é obrigatório",
  }),
  horarioTermino: z.string({
    required_error: "O horário de término é obrigatório",
  }),
  sala: z.string().optional(),
  bolsa: z.boolean().default(false),
  valorBolsa: z.number().optional(),
  requisitos: z.string().optional(),
  atividades: z.string().optional(),
  alunoPreSelecionado: z.string().optional(),
  termosAceitos: z.boolean(),
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

export default function EditMonitoriaPage() {
  const params = useParams();
  const router = useRouter();
  const { monitorias, updateMonitoria } = useMonitorias();
  const { disciplinas, cursos, fetchMasterData } = useMasterData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basicas");
  const [isLoading, setIsLoading] = useState(true);

  const monitoriaId = params.id as string;

  const form = useForm<MonitoriaFormValues>({
    resolver: zodResolver(monitoriaSchema),
    mode: "onChange",
    defaultValues: {
      disciplinaId: 0,
      cursoId: 0,
      semestre: "",
      cargaHoraria: 0,
      dataInicio: "",
      dataTermino: "",
      diasSemana: [],
      horarioInicio: "",
      horarioTermino: "",
      sala: "",
      bolsa: false,
      valorBolsa: 0,
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
  }, []);

  // Carregar dados da monitoria
  useEffect(() => {
    const monitoria = monitorias.find((m) => m.id.toString() === monitoriaId);
    if (monitoria) {
      form.reset({
        disciplinaId: monitoria.disciplinaId,
        cursoId: monitoria.cursoId,
        semestre: monitoria.semestre,
        cargaHoraria: monitoria.cargaHoraria,
        dataInicio: monitoria.dataInicio,
        dataTermino: monitoria.dataTermino,
        diasSemana: monitoria.diasSemana,
        horarioInicio: monitoria.horarioInicio,
        horarioTermino: monitoria.horarioTermino,
        sala: monitoria.sala || "",
        bolsa: monitoria.bolsa,
        valorBolsa: monitoria.valorBolsa || 0,
        requisitos: monitoria.requisitos || "",
        atividades: monitoria.atividades || "",
        alunoPreSelecionado: monitoria.alunoPreSelecionado || "",
        termosAceitos: monitoria.termosAceitos,
      });
      setIsLoading(false);
    }
  }, [monitoriaId, monitorias, form]);

  // Alternar seleção de dia da semana
  const toggleDiaSemana = (dia: string) => {
    const novosDias = diasSelecionados.includes(dia)
      ? diasSelecionados.filter((d) => d !== dia)
      : [...diasSelecionados, dia];

    form.setValue("diasSemana", novosDias);
  };

  // Submit do formulário
  async function onSubmit(values: MonitoriaFormValues) {
    setIsSubmitting(true);

    try {
      const monitoriaData: Partial<MonitoriaData> = {
        ...values,
        valorBolsa: values.bolsa ? values.valorBolsa : undefined,
      };

      await updateMonitoria(parseInt(monitoriaId), monitoriaData);
      toast.success("Monitoria atualizada com sucesso!");
      router.push("/monitorias");
    } catch (error) {
      toast.error("Erro ao atualizar monitoria");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">
            Carregando monitoria...
          </p>
        </div>
      </div>
    );
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
          <h1 className="text-3xl font-bold">Editar Monitoria</h1>
          <p className="text-muted-foreground">
            Atualize as informações da monitoria
          </p>
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
              <TabsTrigger value="basicas">
                <Book className="mr-2 h-4 w-4" />
                Informações Básicas
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
                          <FormLabel>Disciplina</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                            value={field.value.toString()}
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
                          <FormLabel>Curso</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                            value={field.value.toString()}
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
                          <FormLabel>Semestre</FormLabel>
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
                          <FormLabel>Carga Horária (horas)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
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
                    <FormLabel>Dias da Semana</FormLabel>
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
                          <FormLabel>Horário de Início</FormLabel>
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
                          <FormLabel>Horário de Término</FormLabel>
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
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
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
                            placeholder="Descreva os requisitos para a monitoria"
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
                            placeholder="Descreva as atividades da monitoria"
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
                            placeholder="Nome do aluno pré-selecionado"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Se houver um aluno já indicado para a monitoria
                        </FormDescription>
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
                        <FormLabel>Aceito os termos e condições</FormLabel>
                        <FormDescription>
                          Estou ciente das responsabilidades da monitoria e
                          aceito os termos do programa.
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
                        Atualizando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Atualizar Monitoria
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
