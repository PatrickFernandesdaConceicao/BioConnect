// contexts/BioConnectContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { authFetch } from "@/lib/auth";

// =============================================================================
// INTERFACES E TIPOS
// =============================================================================

// Projeto
export interface Documento {
  id: number;
  nomeArquivo: string;
  tipoArquivo: string;
  tamanho: number;
  caminhoArquivo: string;
}

export interface Projeto {
  id: number;
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
  documentos: Documento[];
}

export interface CreateProjetoData {
  titulo: string;
  descricao: string;
  objetivos: string;
  justificativa: string;
  dataInicio: string;
  dataTermino: string;
  areaConhecimento: string;
  possuiOrcamento: boolean;
  orcamento: string;
  urlEdital: string;
  aceitouTermos: boolean;
  tipoProjeto: string;
  limiteParticipantes: string;
  publicoAlvo: string;
  metodologia: string;
  resultadosEsperados: string;
  palavrasChave: string;
  emailsParticipantes: string;
}

// Monitoria
export type DiaSemana =
  | "DOMINGO"
  | "SEGUNDA"
  | "TERCA"
  | "QUARTA"
  | "QUINTA"
  | "SEXTA"
  | "SABADO";
export type StatusMonitoria =
  | "PENDENTE"
  | "APROVADA"
  | "REJEITADA"
  | "ATIVA"
  | "FINALIZADA";

export interface HorarioTime {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface Monitoria {
  id: number;
  disciplinaId: number;
  cursoId: number;
  semestre: string;
  cargaHoraria: number;
  dataInicio: string;
  dataTermino: string;
  diasSemana: DiaSemana[];
  horarioInicio: HorarioTime;
  horarioTermino: HorarioTime;
  sala: string;
  bolsa: boolean;
  valorBolsa: number;
  requisitos: string;
  atividades: string;
  alunoPreSelecionado: string;
  termosAceitos: boolean;
  disciplinaNome: string;
  cursoNome: string;
  status: StatusMonitoria;
}

export interface CreateMonitoriaData {
  disciplinaId: number;
  cursoId: number;
  semestre: string;
  cargaHoraria: number;
  dataInicio: string;
  dataTermino: string;
  diasSemana: DiaSemana[];
  horarioInicio: HorarioTime;
  horarioTermino: HorarioTime;
  sala: string;
  bolsa: boolean;
  valorBolsa: number;
  requisitos: string;
  atividades: string;
  alunoPreSelecionado: string;
  termosAceitos: boolean;
}

// Evento
export interface Participante {
  id: number;
  nome: string;
  email: string;
}

export interface Evento {
  eventoId: number;
  titulo: string;
  curso: string;
  dataInicio: string;
  dataTermino: string;
  local: string;
  justificativa: string;
  vlTotalAprovado: number;
  vlTotalSolicitado: number;
}

export interface CreateEventoData {
  titulo: string;
  curso: string;
  dataInicio: string;
  dataTermino: string;
  local: string;
  justificativa: string;
  vlTotalSolicitado: number;
  vlTotalAprovado: number;
  participantes: Participante[];
}

// Estado do Context
export interface BioConnectState {
  projetos: Projeto[];
  monitorias: Monitoria[];
  eventos: Evento[];
  loading: {
    projetos: boolean;
    monitorias: boolean;
    eventos: boolean;
  };
  error: {
    projetos: string | null;
    monitorias: string | null;
    eventos: string | null;
  };
  lastFetch: {
    projetos: number | null;
    monitorias: number | null;
    eventos: number | null;
  };
}

// Actions
export type BioConnectAction =
  // Projetos
  | { type: "FETCH_PROJETOS_START" }
  | { type: "FETCH_PROJETOS_SUCCESS"; payload: Projeto[] }
  | { type: "FETCH_PROJETOS_ERROR"; payload: string }
  | { type: "ADD_PROJETO"; payload: Projeto }
  | { type: "UPDATE_PROJETO"; payload: Projeto }
  | { type: "DELETE_PROJETO"; payload: number }
  // Monitorias
  | { type: "FETCH_MONITORIAS_START" }
  | { type: "FETCH_MONITORIAS_SUCCESS"; payload: Monitoria[] }
  | { type: "FETCH_MONITORIAS_ERROR"; payload: string }
  | { type: "ADD_MONITORIA"; payload: Monitoria }
  | { type: "UPDATE_MONITORIA"; payload: Monitoria }
  | { type: "DELETE_MONITORIA"; payload: number }
  // Eventos
  | { type: "FETCH_EVENTOS_START" }
  | { type: "FETCH_EVENTOS_SUCCESS"; payload: Evento[] }
  | { type: "FETCH_EVENTOS_ERROR"; payload: string }
  | { type: "ADD_EVENTO"; payload: Evento }
  | { type: "UPDATE_EVENTO"; payload: Evento }
  | { type: "DELETE_EVENTO"; payload: number }
  // Geral
  | { type: "CLEAR_ALL_DATA" }
  | { type: "REFRESH_ALL_DATA" };

// =============================================================================
// REDUCER
// =============================================================================

const initialState: BioConnectState = {
  projetos: [],
  monitorias: [],
  eventos: [],
  loading: {
    projetos: false,
    monitorias: false,
    eventos: false,
  },
  error: {
    projetos: null,
    monitorias: null,
    eventos: null,
  },
  lastFetch: {
    projetos: null,
    monitorias: null,
    eventos: null,
  },
};

function bioConnectReducer(
  state: BioConnectState,
  action: BioConnectAction
): BioConnectState {
  switch (action.type) {
    // Projetos
    case "FETCH_PROJETOS_START":
      return {
        ...state,
        loading: { ...state.loading, projetos: true },
        error: { ...state.error, projetos: null },
      };

    case "FETCH_PROJETOS_SUCCESS":
      return {
        ...state,
        projetos: action.payload,
        loading: { ...state.loading, projetos: false },
        error: { ...state.error, projetos: null },
        lastFetch: { ...state.lastFetch, projetos: Date.now() },
      };

    case "FETCH_PROJETOS_ERROR":
      return {
        ...state,
        loading: { ...state.loading, projetos: false },
        error: { ...state.error, projetos: action.payload },
      };

    case "ADD_PROJETO":
      return {
        ...state,
        projetos: [...state.projetos, action.payload],
      };

    case "UPDATE_PROJETO":
      return {
        ...state,
        projetos: state.projetos.map((projeto) =>
          projeto.id === action.payload.id ? action.payload : projeto
        ),
      };

    case "DELETE_PROJETO":
      return {
        ...state,
        projetos: state.projetos.filter(
          (projeto) => projeto.id !== action.payload
        ),
      };

    // Monitorias
    case "FETCH_MONITORIAS_START":
      return {
        ...state,
        loading: { ...state.loading, monitorias: true },
        error: { ...state.error, monitorias: null },
      };

    case "FETCH_MONITORIAS_SUCCESS":
      return {
        ...state,
        monitorias: action.payload,
        loading: { ...state.loading, monitorias: false },
        error: { ...state.error, monitorias: null },
        lastFetch: { ...state.lastFetch, monitorias: Date.now() },
      };

    case "FETCH_MONITORIAS_ERROR":
      return {
        ...state,
        loading: { ...state.loading, monitorias: false },
        error: { ...state.error, monitorias: action.payload },
      };

    case "ADD_MONITORIA":
      return {
        ...state,
        monitorias: [...state.monitorias, action.payload],
      };

    case "UPDATE_MONITORIA":
      return {
        ...state,
        monitorias: state.monitorias.map((monitoria) =>
          monitoria.id === action.payload.id ? action.payload : monitoria
        ),
      };

    case "DELETE_MONITORIA":
      return {
        ...state,
        monitorias: state.monitorias.filter(
          (monitoria) => monitoria.id !== action.payload
        ),
      };

    // Eventos
    case "FETCH_EVENTOS_START":
      return {
        ...state,
        loading: { ...state.loading, eventos: true },
        error: { ...state.error, eventos: null },
      };

    case "FETCH_EVENTOS_SUCCESS":
      return {
        ...state,
        eventos: action.payload,
        loading: { ...state.loading, eventos: false },
        error: { ...state.error, eventos: null },
        lastFetch: { ...state.lastFetch, eventos: Date.now() },
      };

    case "FETCH_EVENTOS_ERROR":
      return {
        ...state,
        loading: { ...state.loading, eventos: false },
        error: { ...state.error, eventos: action.payload },
      };

    case "ADD_EVENTO":
      return {
        ...state,
        eventos: [...state.eventos, action.payload],
      };

    case "UPDATE_EVENTO":
      return {
        ...state,
        eventos: state.eventos.map((evento) =>
          evento.eventoId === action.payload.eventoId ? action.payload : evento
        ),
      };

    case "DELETE_EVENTO":
      return {
        ...state,
        eventos: state.eventos.filter(
          (evento) => evento.eventoId !== action.payload
        ),
      };

    // Geral
    case "CLEAR_ALL_DATA":
      return initialState;

    case "REFRESH_ALL_DATA":
      return {
        ...state,
        lastFetch: {
          projetos: null,
          monitorias: null,
          eventos: null,
        },
      };

    default:
      return state;
  }
}

// =============================================================================
// CONTEXT E PROVIDER
// =============================================================================

interface BioConnectContextType {
  state: BioConnectState;

  // Ações gerais
  refreshAllData: () => Promise<void>;
  clearAllData: () => void;

  // Projetos
  fetchProjetos: (force?: boolean) => Promise<void>;
  createProjeto: (data: CreateProjetoData) => Promise<Projeto>;
  updateProjeto: (id: number, data: Partial<Projeto>) => Promise<Projeto>;
  deleteProjeto: (id: number) => Promise<void>;

  // Monitorias
  fetchMonitorias: (force?: boolean) => Promise<void>;
  createMonitoria: (data: CreateMonitoriaData) => Promise<Monitoria>;
  updateMonitoria: (id: number, data: Partial<Monitoria>) => Promise<Monitoria>;
  deleteMonitoria: (id: number) => Promise<void>;

  // Eventos
  fetchEventos: (force?: boolean) => Promise<void>;
  createEvento: (data: CreateEventoData) => Promise<Evento>;
  updateEvento: (id: number, data: Partial<Evento>) => Promise<Evento>;
  deleteEvento: (id: number) => Promise<void>;
}

const BioConnectContext = createContext<BioConnectContextType | undefined>(
  undefined
);

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

interface BioConnectProviderProps {
  children: ReactNode;
}

export function BioConnectProvider({ children }: BioConnectProviderProps) {
  const [state, dispatch] = useReducer(bioConnectReducer, initialState);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // Cache de 5 minutos
  const CACHE_DURATION = 5 * 60 * 1000;

  // =============================================================================
  // FUNÇÕES DE API
  // =============================================================================

  // Verificar se os dados estão em cache
  const isCacheValid = (lastFetch: number | null): boolean => {
    return lastFetch ? Date.now() - lastFetch < CACHE_DURATION : false;
  };

  // Projetos
  const fetchProjetos = async (force = false) => {
    if (!force && isCacheValid(state.lastFetch.projetos)) {
      return;
    }

    dispatch({ type: "FETCH_PROJETOS_START" });

    try {
      const response = await authFetch(`${apiUrl}/api/projetos`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar projetos: ${response.status}`);
      }

      const projetos: Projeto[] = await response.json();
      dispatch({ type: "FETCH_PROJETOS_SUCCESS", payload: projetos });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      dispatch({ type: "FETCH_PROJETOS_ERROR", payload: errorMessage });
      throw error;
    }
  };

  const createProjeto = async (data: CreateProjetoData): Promise<Projeto> => {
    try {
      const response = await authFetch(`${apiUrl}/api/projetos`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar projeto: ${response.status}`);
      }

      const novoProjeto: Projeto = await response.json();
      dispatch({ type: "ADD_PROJETO", payload: novoProjeto });
      return novoProjeto;
    } catch (error) {
      throw error;
    }
  };

  const updateProjeto = async (
    id: number,
    data: Partial<Projeto>
  ): Promise<Projeto> => {
    try {
      const response = await authFetch(`${apiUrl}/api/projetos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar projeto: ${response.status}`);
      }

      const projetoAtualizado: Projeto = await response.json();
      dispatch({ type: "UPDATE_PROJETO", payload: projetoAtualizado });
      return projetoAtualizado;
    } catch (error) {
      throw error;
    }
  };

  const deleteProjeto = async (id: number): Promise<void> => {
    try {
      const response = await authFetch(`${apiUrl}/api/projetos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erro ao deletar projeto: ${response.status}`);
      }

      dispatch({ type: "DELETE_PROJETO", payload: id });
    } catch (error) {
      throw error;
    }
  };

  // Monitorias
  const fetchMonitorias = async (force = false) => {
    if (!force && isCacheValid(state.lastFetch.monitorias)) {
      return;
    }

    dispatch({ type: "FETCH_MONITORIAS_START" });

    try {
      const response = await authFetch(`${apiUrl}/api/monitoria`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar monitorias: ${response.status}`);
      }

      const monitorias: Monitoria[] = await response.json();
      dispatch({ type: "FETCH_MONITORIAS_SUCCESS", payload: monitorias });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      dispatch({ type: "FETCH_MONITORIAS_ERROR", payload: errorMessage });
      throw error;
    }
  };

  const createMonitoria = async (
    data: CreateMonitoriaData
  ): Promise<Monitoria> => {
    try {
      const response = await authFetch(`${apiUrl}/api/monitoria`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar monitoria: ${response.status}`);
      }

      const novaMonitoria: Monitoria = await response.json();
      dispatch({ type: "ADD_MONITORIA", payload: novaMonitoria });
      return novaMonitoria;
    } catch (error) {
      throw error;
    }
  };

  const updateMonitoria = async (
    id: number,
    data: Partial<Monitoria>
  ): Promise<Monitoria> => {
    try {
      const response = await authFetch(`${apiUrl}/api/monitoria/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar monitoria: ${response.status}`);
      }

      const monitoriaAtualizada: Monitoria = await response.json();
      dispatch({ type: "UPDATE_MONITORIA", payload: monitoriaAtualizada });
      return monitoriaAtualizada;
    } catch (error) {
      throw error;
    }
  };

  const deleteMonitoria = async (id: number): Promise<void> => {
    try {
      const response = await authFetch(`${apiUrl}/api/monitoria/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erro ao deletar monitoria: ${response.status}`);
      }

      dispatch({ type: "DELETE_MONITORIA", payload: id });
    } catch (error) {
      throw error;
    }
  };

  // Eventos
  const fetchEventos = async (force = false) => {
    if (!force && isCacheValid(state.lastFetch.eventos)) {
      return;
    }

    dispatch({ type: "FETCH_EVENTOS_START" });

    try {
      const response = await authFetch(`${apiUrl}/api/evento`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar eventos: ${response.status}`);
      }

      const eventos: Evento[] = await response.json();
      dispatch({ type: "FETCH_EVENTOS_SUCCESS", payload: eventos });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      dispatch({ type: "FETCH_EVENTOS_ERROR", payload: errorMessage });
      throw error;
    }
  };

  const createEvento = async (data: CreateEventoData): Promise<Evento> => {
    try {
      const response = await authFetch(`${apiUrl}/api/evento`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar evento: ${response.status}`);
      }

      const novoEvento: Evento = await response.json();
      dispatch({ type: "ADD_EVENTO", payload: novoEvento });
      return novoEvento;
    } catch (error) {
      throw error;
    }
  };

  const updateEvento = async (
    id: number,
    data: Partial<Evento>
  ): Promise<Evento> => {
    try {
      const response = await authFetch(`${apiUrl}/api/evento/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar evento: ${response.status}`);
      }

      const eventoAtualizado: Evento = await response.json();
      dispatch({ type: "UPDATE_EVENTO", payload: eventoAtualizado });
      return eventoAtualizado;
    } catch (error) {
      throw error;
    }
  };

  const deleteEvento = async (id: number): Promise<void> => {
    try {
      const response = await authFetch(`${apiUrl}/api/evento/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erro ao deletar evento: ${response.status}`);
      }

      dispatch({ type: "DELETE_EVENTO", payload: id });
    } catch (error) {
      throw error;
    }
  };

  // Funções gerais
  const refreshAllData = async () => {
    dispatch({ type: "REFRESH_ALL_DATA" });
    await Promise.allSettled([
      fetchProjetos(true),
      fetchMonitorias(true),
      fetchEventos(true),
    ]);
  };

  const clearAllData = () => {
    dispatch({ type: "CLEAR_ALL_DATA" });
  };

  // Carregar dados iniciais quando o provider é montado
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.allSettled([
          fetchProjetos(),
          fetchMonitorias(),
          fetchEventos(),
        ]);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      }
    };

    loadInitialData();
  }, []);

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================

  const contextValue: BioConnectContextType = {
    state,

    // Ações gerais
    refreshAllData,
    clearAllData,

    // Projetos
    fetchProjetos,
    createProjeto,
    updateProjeto,
    deleteProjeto,

    // Monitorias
    fetchMonitorias,
    createMonitoria,
    updateMonitoria,
    deleteMonitoria,

    // Eventos
    fetchEventos,
    createEvento,
    updateEvento,
    deleteEvento,
  };

  return (
    <BioConnectContext.Provider value={contextValue}>
      {children}
    </BioConnectContext.Provider>
  );
}

// =============================================================================
// HOOK CUSTOMIZADO
// =============================================================================

export function useBioConnect() {
  const context = useContext(BioConnectContext);

  if (context === undefined) {
    throw new Error(
      "useBioConnect deve ser usado dentro de um BioConnectProvider"
    );
  }

  return context;
}

// =============================================================================
// HOOKS ESPECÍFICOS PARA CADA ENTIDADE
// =============================================================================

export function useProjetos() {
  const { state, fetchProjetos, createProjeto, updateProjeto, deleteProjeto } =
    useBioConnect();

  return {
    projetos: state.projetos,
    loading: state.loading.projetos,
    error: state.error.projetos,
    fetchProjetos,
    createProjeto,
    updateProjeto,
    deleteProjeto,
  };
}

export function useMonitorias() {
  const {
    state,
    fetchMonitorias,
    createMonitoria,
    updateMonitoria,
    deleteMonitoria,
  } = useBioConnect();

  return {
    monitorias: state.monitorias,
    loading: state.loading.monitorias,
    error: state.error.monitorias,
    fetchMonitorias,
    createMonitoria,
    updateMonitoria,
    deleteMonitoria,
  };
}

export function useEventos() {
  const { state, fetchEventos, createEvento, updateEvento, deleteEvento } =
    useBioConnect();

  return {
    eventos: state.eventos,
    loading: state.loading.eventos,
    error: state.error.eventos,
    fetchEventos,
    createEvento,
    updateEvento,
    deleteEvento,
  };
}
