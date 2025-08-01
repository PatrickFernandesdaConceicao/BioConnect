"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProjetos } from "@/contexts/AppContext";
import { ProjetoData } from "@/services/api";

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
  DollarSign,
  FileText,
  Users,
  Target,
  BookOpen,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";

const projetoSchema = z.object({
  titulo: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
  descricao: z
    .string()
    .min(20, "A descrição deve ter pelo menos 20 caracteres"),
  objetivos: z
    .string()
    .min(20, "Os objetivos devem ter pelo menos 20 caracteres"),
  justificativa: z
    .string()
    .min(20, "A justificativa deve ter pelo menos 20 caracteres"),
  dataInicio: z.string().min(1, "A data de início é obrigatória"),
  dataTermino: z.string().min(1, "A data de término é obrigatória"),
  areaConhecimento: z.string().min(1, "Selecione uma área de conhecimento"),
  tipoProjeto: z.string().min(1, "Selecione o tipo de projeto"),
  possuiOrcamento: z.boolean(),
  orcamento: z.number().min(0, "O orçamento não pode ser negativo"),
  urlEdital: z.string().optional(),
  limiteParticipantes: z.number().min(1, "Deve ter pelo menos 1 participante"),
  publicoAlvo: z
    .string()
    .min(10, "O público-alvo deve ter pelo menos 10 caracteres"),
  metodologia: z
    .string()
    .min(20, "A metodologia deve ter pelo menos 20 caracteres"),
  resultadosEsperados: z
    .string()
    .min(20, "Os resultados esperados devem ter pelo menos 20 caracteres"),
  palavrasChave: z
    .string()
    .min(5, "As palavras-chave devem ter pelo menos 5 caracteres"),
  aceitouTermos: z
    .boolean()
    .refine((val) => val === true, "Você deve aceitar os termos"),
});

type ProjetoFormValues = z.infer<typeof projetoSchema>;

const areasConhecimento = [
  "Biotecnologia",
  "Saúde",
  "Tecnologia da Informação",
  "Administração",
  "Educação",
  "Engenharia",
  "Ciências Biológicas",
  "Ciências Exatas",
  "Ciências Humanas",
  "Ciências Sociais",
];

const tiposProjeto = [
  "Pesquisa",
  "Extensão",
  "Iniciação Científica",
  "TCC",
  "Mestrado",
  "Doutorado",
  "Projeto Social",
  "Inovação Tecnológica",
];

export default function NewProjetoPage() {
  const router = useRouter();
  const { createProjeto } = useProjetos();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basicas");
  const [emailParticipante, setEmailParticipante] = useState("");
  const [participantes, setParticipantes] = useState<string[]>([]);

  const form = useForm<ProjetoFormValues>({
    resolver: zodResolver(projetoSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      objetivos: "",
      justificativa: "",
      dataInicio: "",
      dataTermino: "",
      areaConhecimento: "",
      tipoProjeto: "",
      possuiOrcamento: false,
      orcamento: 0,
      urlEdital: "",
      limiteParticipantes: 1,
      publicoAlvo: "",
      metodologia: "",
      resultadosEsperados: "",
      palavrasChave: "",
      aceitouTermos: false,
    },
  });

  const possuiOrcamento = form.watch("possuiOrcamento");

  const handleAddParticipante = () => {
    if (emailParticipante && !participantes.includes(emailParticipante)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailParticipante)) {
        toast.error("Email inválido");
        return;
      }
      setParticipantes([...participantes, emailParticipante]);
      setEmailParticipante("");
    }
  };

  const handleRemoveParticipante = (email: string) => {
    setParticipantes(participantes.filter((e) => e !== email));
  };

  async function onSubmit(values: ProjetoFormValues) {
    setIsSubmitting(true);

    try {
      const projetoData: ProjetoData = {
        ...values,
        orcamento: values.possuiOrcamento ? values.orcamento : 0,
        urlEdital: values.urlEdital || "",
        // emailsParticipantes: participantes,
      };

      await createProjeto(projetoData);
      toast.success("Projeto criado com sucesso!");
      router.push("/projetos");
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      toast.error("Erro ao criar projeto. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/projetos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Novo Projeto</h1>
          <p className="text-muted-foreground">
            Crie um novo projeto de pesquisa ou extensão
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basicas">
                <FileText className="mr-2 h-4 w-4" />
                Básicas
              </TabsTrigger>
              <TabsTrigger value="detalhes">
                <Target className="mr-2 h-4 w-4" />
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="orcamento">
                <DollarSign className="mr-2 h-4 w-4" />
                Orçamento
              </TabsTrigger>
              <TabsTrigger value="participantes">
                <Users className="mr-2 h-4 w-4" />
                Participantes
              </TabsTrigger>
            </TabsList>

            {/* Tab: Informações Básicas */}
            <TabsContent value="basicas">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>Dados principais do projeto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título do Projeto *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o título do projeto"
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
                      name="areaConhecimento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Área de Conhecimento *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a área" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {areasConhecimento.map((area) => (
                                <SelectItem key={area} value={area}>
                                  {area}
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
                      name="tipoProjeto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Projeto *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {tiposProjeto.map((tipo) => (
                                <SelectItem key={tipo} value={tipo}>
                                  {tipo}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva brevemente o projeto"
                            className="min-h-[100px]"
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

            {/* Tab: Detalhes */}
            <TabsContent value="detalhes">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Projeto</CardTitle>
                  <CardDescription>
                    Objetivos, metodologia e resultados esperados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="objetivos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objetivos *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva os objetivos do projeto"
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
                    name="justificativa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Justificativa *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Justifique a relevância do projeto"
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
                    name="metodologia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Metodologia *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva a metodologia a ser utilizada"
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
                    name="resultadosEsperados"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resultados Esperados *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva os resultados esperados"
                            className="min-h-[100px]"
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
                      name="publicoAlvo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Público-Alvo *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva o público-alvo"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="palavrasChave"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Palavras-Chave *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: biotecnologia, pesquisa, inovação"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Separe as palavras-chave com vírgulas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Orçamento */}
            <TabsContent value="orcamento">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Orçamento</CardTitle>
                  <CardDescription>
                    Dados financeiros e edital do projeto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="possuiOrcamento"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Possui Orçamento
                          </FormLabel>
                          <FormDescription>
                            Este projeto possui recursos financeiros?
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

                  {possuiOrcamento && (
                    <FormField
                      control={form.control}
                      name="orcamento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor do Orçamento (R$)</FormLabel>
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
                    name="urlEdital"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL do Edital (Opcional)</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://exemplo.com/edital"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Link para o edital relacionado ao projeto
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Participantes */}
            <TabsContent value="participantes">
              <Card>
                <CardHeader>
                  <CardTitle>Participantes do Projeto</CardTitle>
                  <CardDescription>
                    Configure os participantes e limite de vagas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="limiteParticipantes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Limite de Participantes *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 1)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Número máximo de participantes no projeto
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel>Emails dos Participantes</FormLabel>
                    <div className="flex gap-2">
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
                        disabled={!emailParticipante}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {participantes.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Participantes adicionados ({participantes.length}):
                        </p>
                        <div className="space-y-1">
                          {participantes.map((email, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-muted p-2 rounded"
                            >
                              <span className="text-sm">{email}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveParticipante(email)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
                  name="aceitouTermos"
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
                          Declaro que as informações fornecidas são verdadeiras
                          e estou ciente das responsabilidades envolvidas no
                          projeto.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-between pt-4">
                  <Link href="/projetos">
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
                        Criar Projeto
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
