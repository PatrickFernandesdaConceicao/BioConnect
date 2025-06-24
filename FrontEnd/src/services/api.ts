import { authFetch } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ===================================================================
// INTERFACES E TIPOS
// ===================================================================

// Projeto
export interface ProjetoData {
  titulo: string;
  descricao: string;
  objetivos: string;
  justificativa: string;
  dataInicio: string;
  dataTermino: string;
  areaConhecimento: string;
  possuiOrcamento: boolean;
  orcamento: number;
  urlEdital: string;
  aceitouTermos: boolean;
  tipoProjeto: string;
  limiteParticipantes: number;
  publicoAlvo: string;
  metodologia: string;
  resultadosEsperados: string;
  palavrasChave: string;
  emailsParticipantes: string[];
}

export interface Projeto extends ProjetoData {
  id: number;
  status?: string;
  dataCriacao?: string;
  usuario?: {
    id: string;
    nome: string;
    email: string;
  };
}

// Monitoria
export interface MonitoriaData {
  disciplinaId: number;
  cursoId: number;
  semestre: string;
  cargaHoraria: number;
  dataInicio: string;
  dataTermino: string;
  diasSemana: string[];
  horarioInicio: string;
  horarioTermino: string;
  sala?: string;
  bolsa: boolean;
  valorBolsa?: number;
  requisitos?: string;
  atividades?: string;
  alunoPreSelecionado?: string;
  termosAceitos: boolean;
}

export interface Monitoria extends MonitoriaData {
  id: number;
  disciplinaNome?: string;
  cursoNome?: string;
  status?: string;
  dataCriacao?: string;
}

// Evento
export interface ParticipanteEvento {
  nome: string;
  email: string;
}

export interface EventoData {
  titulo: string;
  curso: string;
  dataInicio: string;
  dataTermino: string;
  local: string;
  justificativa: string;
  vlTotalSolicitado: number;
  vlTotalAprovado: number;
  participantes?: ParticipanteEvento[];
}

export interface Evento extends EventoData {
  id: number;
  status?: string;
  dataCriacao?: string;
}

// Usuário
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  login: string;
  role: "USER" | "ADMIN";
  ativo: boolean;
  dataCriacao?: string;
}

// Master Data
export interface Disciplina {
  id: number;
  nome: string;
  codigo: string;
  cargaHoraria: number;
}

export interface Curso {
  id: number;
  nome: string;
  codigo: string;
  tipo: string;
}

// Relatórios
export interface RelatorioData {
  totalProjetos: number;
  totalEventos: number;
  totalMonitorias: number;
  projetosPorStatus: { status: string; count: number }[];
  eventosPorMes: { mes: string; total: number }[];
  monitoriasPorCurso: { curso: string; total: number }[];
}

// ===================================================================
// SERVIÇOS
// ===================================================================

class ProjetoService {
  async list(): Promise<Projeto[]> {
    const response = await authFetch(`${API_URL}/api/projetos`);
    if (!response.ok) throw new Error("Erro ao buscar projetos");
    return response.json();
  }

  async getById(id: number): Promise<Projeto> {
    const response = await authFetch(`${API_URL}/api/projetos/${id}`);
    if (!response.ok) throw new Error("Projeto não encontrado");
    return response.json();
  }

  async create(data: ProjetoData): Promise<Projeto> {
    const response = await authFetch(`${API_URL}/api/projetos`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar projeto");
    return response.json();
  }

  async update(id: number, data: Partial<ProjetoData>): Promise<Projeto> {
    const response = await authFetch(`${API_URL}/api/projetos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao atualizar projeto");
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await authFetch(`${API_URL}/api/projetos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar projeto");
  }
}

class MonitoriaService {
  async list(): Promise<Monitoria[]> {
    const response = await authFetch(`${API_URL}/api/monitoria`);
    if (!response.ok) throw new Error("Erro ao buscar monitorias");
    return response.json();
  }

  async getById(id: number): Promise<Monitoria> {
    const response = await authFetch(`${API_URL}/api/monitoria/${id}`);
    if (!response.ok) throw new Error("Monitoria não encontrada");
    return response.json();
  }

  async create(data: MonitoriaData): Promise<Monitoria> {
    const response = await authFetch(`${API_URL}/api/monitoria`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar monitoria");
    return response.json();
  }

  async update(id: number, data: Partial<MonitoriaData>): Promise<Monitoria> {
    const response = await authFetch(`${API_URL}/api/monitoria/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao atualizar monitoria");
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await authFetch(`${API_URL}/api/monitoria/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar monitoria");
  }
}

class EventoService {
  async list(): Promise<Evento[]> {
    try {
      console.log("Buscando eventos em:", `${API_URL}/api/evento`);

      const response = await authFetch(`${API_URL}/api/evento`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na resposta:", response.status, errorText);
        throw new Error(
          `Erro ao buscar eventos: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Eventos recebidos:", data);

      return data;
    } catch (error) {
      console.error("Erro detalhado ao buscar eventos:", error);
      throw error;
    }
  }

  async getById(id: number): Promise<Evento> {
    try {
      const response = await authFetch(`${API_URL}/api/evento/${id}`);
      if (!response.ok) throw new Error("Evento não encontrado");
      return response.json();
    } catch (error) {
      console.error(`Erro ao buscar evento ${id}:`, error);
      throw error;
    }
  }

  async create(data: EventoData): Promise<Evento> {
    const response = await authFetch(`${API_URL}/api/evento`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar evento");
    return response.json();
  }

  async update(id: number, data: Partial<EventoData>): Promise<Evento> {
    const response = await authFetch(`${API_URL}/api/evento/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao atualizar evento");
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await authFetch(`${API_URL}/api/evento/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar evento");
  }
}

class UsuarioService {
  async list(): Promise<Usuario[]> {
    const response = await authFetch(`${API_URL}/usuarios`);
    if (!response.ok) throw new Error("Erro ao buscar usuários");
    return response.json();
  }

  async getById(id: string): Promise<Usuario> {
    const response = await authFetch(`${API_URL}/usuarios/${id}`);
    if (!response.ok) throw new Error("Usuário não encontrado");
    return response.json();
  }

  async update(id: string, data: Partial<Usuario>): Promise<Usuario> {
    const response = await authFetch(`${API_URL}/usuarios/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao atualizar usuário");
    return response.json();
  }

  async delete(id: string): Promise<void> {
    const response = await authFetch(`${API_URL}/usuarios/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar usuário");
  }

  async toggleStatus(id: string, ativo: boolean): Promise<Usuario> {
    return this.update(id, { ativo });
  }
}

class RelatorioService {
  async getDashboard(): Promise<RelatorioData> {
    const response = await authFetch(`${API_URL}/api/relatorios/dashboard`);
    if (!response.ok) throw new Error("Erro ao buscar dados do relatório");
    return response.json();
  }

  async exportarPDF(
    tipo: "projetos" | "eventos" | "monitorias"
  ): Promise<Blob> {
    const response = await authFetch(
      `${API_URL}/api/relatorios/export/${tipo}`,
      {
        headers: {
          Accept: "application/pdf",
        },
      }
    );
    if (!response.ok) throw new Error("Erro ao exportar relatório");
    return response.blob();
  }
}

class MasterDataService {
  async getDisciplinas(): Promise<Disciplina[]> {
    const response = await authFetch(`${API_URL}/api/disciplinas`);
    if (!response.ok) throw new Error("Erro ao buscar disciplinas");
    return response.json();
  }

  async getCursos(): Promise<Curso[]> {
    const response = await authFetch(`${API_URL}/api/cursos`);
    if (!response.ok) throw new Error("Erro ao buscar cursos");
    return response.json();
  }
}

// ===================================================================
// INSTÂNCIAS DOS SERVIÇOS (SINGLETON)
// ===================================================================
export const projetoService = new ProjetoService();
export const monitoriaService = new MonitoriaService();
export const eventoService = new EventoService();
export const usuarioService = new UsuarioService();
export const relatorioService = new RelatorioService();
export const masterDataService = new MasterDataService();
