export interface ProjetoResponse {
  id: number;
  titulo: string;
  descricao: string;
  objetivos: string;
  justificativa?: string;
  dataInicio?: string;
  dataTermino?: string;
  areaConhecimento: string;
  possuiOrcamento: boolean;
  orcamento?: number;
  urlEdital?: string;
  aceitouTermos: boolean;
  tipoProjeto: string;
  limiteParticipantes?: number;
  publicoAlvo?: string;
  metodologia?: string;
  resultadosEsperados?: string;
  palavrasChave?: string;
  emailsParticipantes?: string[];
  documentos?: DocumentoResponse[];
}

export interface DocumentoResponse {
  id: number;
  nomeArquivo: string;
  tipoArquivo: string;
  tamanho: number;
  caminhoArquivo: string;
}

export interface CriarProjetoRequest {
  titulo: string;
  descricao: string;
  objetivos: string;
  justificativa?: string;
  dataInicio?: string;
  dataTermino?: string;
  areaConhecimento: string;
  possuiOrcamento: boolean;
  orcamento?: string;
  urlEdital?: string;
  aceitouTermos: boolean;
  tipoProjeto: string;
  limiteParticipantes?: string;
  publicoAlvo?: string;
  metodologia?: string;
  resultadosEsperados?: string;
  palavrasChave?: string;
  emailsParticipantes?: string;
  documentos?: number[];
}