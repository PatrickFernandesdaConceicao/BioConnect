// app/(dashboard)/projetos/new/page.tsx
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
  Users,
  FileText,
  DollarSign,
} from "lucide-react";

// Esquema de validação do formulário
const projetoSchema = z.object({
  title: z.string().min(5, {
    message: "O título deve ter pelo menos 5 caracteres",
  }),
  description: z.string().min(20, {
    message: "A descrição deve ter pelo menos 20 caracteres",
  }),
  objetivos: z.string().min(20, {
    message: "Os objetivos devem ter pelo menos 20 caracteres",
  }),
  justificativa: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  area: z.string({
    required_error: "Selecione uma área de conhecimento",
  }),
  hasBudget: z.boolean().default(false),
  budget: z.string().optional(),
  editalUrl: z.string().optional(),
  hasTerms: z.boolean().default(false),
  participantEmails: z.string().optional(),
  tipoProjetoId: z.string({
    required_error: "Selecione o tipo de projeto",
  }),
  limiteParticipantes: z.string().optional(),
  publicoAlvo: z.string().optional(),
  metodologia: z.string().optional(),
  resultadosEsperados: z.string().optional(),
  palavrasChave: z.string().optional(),
});

type ProjetoFormValues = z.infer<typeof projetoSchema>;

export default function NewProjetoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [files, setFiles] = useState<File[]>([]);

  // Valores padrão para o formulário
  const defaultValues: Partial<ProjetoFormValues> = {
    title: "",
    description: "",
    objetivos: "",
    justificativa: "",
    area: "",
    hasBudget: false,
    budget: "",
    hasTerms: false,
    participantEmails: "",
    tipoProjetoId: "",
    limiteParticipantes: "",
    publicoAlvo: "",
    metodologia: "",
    resultadosEsperados: "",
    palavrasChave: "",
  };

  // Configuração do formulário
  const form = useForm<ProjetoFormValues>({
    resolver: zodResolver(projetoSchema),
    defaultValues,
  });

  // Observe se o projeto tem orçamento para controlar a exibição do campo
  const watchHasBudget = form.watch("hasBudget");

  // Função para lidar com o upload de arquivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Função para remover um arquivo da lista
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Função para lidar com o envio do formulário
  async function onSubmit(values: ProjetoFormValues) {
    setIsSubmitting(true);

    try {
      // Verificar se a data de término é posterior à de início
      if (
        values.startDate &&
        values.endDate &&
        new Date(values.endDate) <= new Date(values.startDate)
      ) {
        Sonner({
          title: "Erro de validação",
          description: "A data de término deve ser posterior à data de início.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Tratar os valores, como converter budget para número se necessário
      const processedValues = {
        ...values,
        budget:
          values.hasBudget && values.budget
            ? parseFloat(
                values.budget.replace(/[^\d.,]/g, "").replace(",", ".")
              )
            : null,
        limiteParticipantes: values.limiteParticipantes
          ? parseInt(values.limiteParticipantes)
          : null,
      };

      // Simulação de envio com arquivos (seria substituído pela chamada real à API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Dados do projeto:", processedValues);
      console.log("Arquivos anexados:", files);

      // Exibir mensagem de sucesso
      Sonner({
        title: "Projeto cadastrado com sucesso!",
        description: "O projeto foi enviado para aprovação.",
      });

      // Redirecionar para a lista de projetos
      router.push("/projetos");
    } catch (error) {
      console.error("Erro ao cadastrar projeto:", error);
      Sonner({
        title: "Erro ao cadastrar projeto",
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
          <Link href="/projetos">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Novo Projeto</h1>
            <p className="text-muted-foreground">
              Cadastre um novo projeto de pesquisa ou extensão
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulário de Cadastro de Projeto</CardTitle>
          <CardDescription>
            Preencha as informações do projeto. Os campos marcados com * são
            obrigatórios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info">Informações Básicas</TabsTrigger>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="participants">Participantes</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form
                id="projeto-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 mt-4"
              >
                <TabsContent value="info" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título do Projeto *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Análise de técnicas de bioinformática aplicadas à genômica"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          O título deve ser claro e representar o objetivo
                          principal do projeto.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tipoProjetoId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Projeto *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de projeto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pesquisa">Pesquisa</SelectItem>
                            <SelectItem value="extensao">Extensão</SelectItem>
                            <SelectItem value="iniciacao">
                              Iniciação Científica
                            </SelectItem>
                            <SelectItem value="inovacao">
                              Inovação e Tecnologia
                            </SelectItem>
                          </SelectContent>
                        </Select>
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
                            placeholder="Descreva brevemente o projeto, seu escopo e resultados esperados"
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
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área de Conhecimento *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma área" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Biotecnologia">
                              Biotecnologia
                            </SelectItem>
                            <SelectItem value="Saúde">Saúde</SelectItem>
                            <SelectItem value="Informação">
                              Informação
                            </SelectItem>
                            <SelectItem value="Educação">Educação</SelectItem>
                            <SelectItem value="Administração">
                              Administração
                            </SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="palavrasChave"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Palavras-chave</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: bioinformática, genômica, análise de dados (separadas por vírgula)"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Palavras-chave para identificar seu projeto (3 a 5
                          recomendadas)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Início</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="date" className="pl-8" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Data estimada para início do projeto
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Término</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="date" className="pl-8" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Data estimada para conclusão do projeto
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                  <FormField
                    control={form.control}
                    name="objetivos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objetivos *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva os objetivos gerais e específicos do projeto"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Informe o objetivo geral e os objetivos específicos do
                          projeto
                        </FormDescription>
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
                          <Textarea
                            placeholder="Justifique a relevância do projeto e seu impacto esperado"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Explique por que este projeto é importante e qual seu
                          impacto esperado
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metodologia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Metodologia</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva a metodologia que será utilizada no projeto"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Explique como o projeto será desenvolvido, métodos e
                          técnicas utilizadas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="resultadosEsperados"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resultados Esperados</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva os resultados esperados do projeto"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Informe quais resultados você espera alcançar com o
                          projeto
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="publicoAlvo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Público-alvo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Estudantes de graduação, pesquisadores"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A quem se destina este projeto
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="limiteParticipantes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Limite de Participantes</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                placeholder="Ex: 10"
                                className="pl-8"
                                min="1"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Número máximo de participantes no projeto
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                      onClick={() => setActiveTab("documents")}
                    >
                      Próximo
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="hasBudget"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Orçamento</FormLabel>
                          <FormDescription>
                            O projeto necessita de recursos financeiros?
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

                  {watchHasBudget && (
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor do Orçamento (R$)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="text"
                                placeholder="Ex: 5000,00"
                                className="pl-8"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Informe o valor total estimado do projeto
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="editalUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link do Edital</FormLabel>
                        <FormControl>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="URL do edital relacionado ao projeto"
                              {...field}
                            />
                            <Button type="button" variant="outline" size="icon">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Informe o link ou faça upload do edital (se aplicável)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel>Documentos do Projeto</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        id="projectFiles"
                        className="hidden"
                        multiple
                        onChange={handleFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("projectFiles")?.click()
                        }
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Anexar arquivos
                      </Button>
                      <FormDescription>
                        Anexe documentos relevantes para o projeto (PDF, DOC,
                        DOCX, etc.)
                      </FormDescription>
                    </div>

                    {files.length > 0 && (
                      <div className="mt-4 border rounded-md p-4">
                        <h4 className="text-sm font-medium mb-2">
                          Arquivos anexados:
                        </h4>
                        <ul className="space-y-2">
                          {files.map((file, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                <span>{file.name}</span>
                                <span className="ml-2 text-muted-foreground">
                                  ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                              >
                                Remover
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("details")}
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
                        <FormLabel>Emails dos Participantes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Digite os emails separados por vírgula ou linha"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Informe os emails dos participantes que serão
                          convidados para o projeto
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
                            verdadeiras e que o projeto está de acordo com as
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
                      onClick={() => setActiveTab("documents")}
                    >
                      Voltar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !form.formState.isValid}
                    >
                      {isSubmitting ? "Enviando..." : "Cadastrar Projeto"}
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
            <Link href="/projetos">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button form="projeto-form" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Salvar Projeto"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
