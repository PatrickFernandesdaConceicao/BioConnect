// ===================================================================
// Correção Completa do AppContext
// ===================================================================

// FrontEnd/src/contexts/AppContext.tsx

"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { authFetch } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ===================================================================
// INTERFACES
// ===================================================================
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

export interface EventoData {
  titulo: string;
  curso: string;
  dataInicio: string;
  dataTermino: string;
  local: string;
  justificativa: string;
  vlTotalSolicitado: number;
  vlTotalAprovado: number;
  participantes?: Array<{ nome: string; email: string }>;
}

export interface Evento extends EventoData {
  id: number;
  status?: string;
  dataCriacao?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  login: string;
  role: "USER" | "ADMIN";
  ativo: boolean;
  dataCriacao?: string;
}

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

// ===================================================================
// STATE E ACTIONS
// ===================================================================
interface AppState {
  projetos: Projeto[];
  monitorias: Monitoria[];
  eventos: Evento[];
  usuarios: Usuario[];
  disciplinas: Disciplina[];
  cursos: Curso[];
  loading: {
    projetos: boolean;
    monitorias: boolean;
    eventos: boolean;
    usuarios: boolean;
    masterData: boolean;
  };
  error: {
    projetos: string | null;
    monitorias: string | null;
    eventos: string | null;
    usuarios: string | null;
    masterData: string | null;
  };
}

type AppAction =
  | {
      type: "SET_LOADING";
      payload: { key: keyof AppState["loading"]; value: boolean };
    }
  | {
      type: "SET_ERROR";
      payload: { key: keyof AppState["error"]; value: string | null };
    }
  | { type: "SET_PROJETOS"; payload: Projeto[] }
  | { type: "SET_MONITORIAS"; payload: Monitoria[] }
  | { type: "SET_EVENTOS"; payload: Evento[] }
  | { type: "SET_USUARIOS"; payload: Usuario[] }
  | { type: "SET_DISCIPLINAS"; payload: Disciplina[] }
  | { type: "SET_CURSOS"; payload: Curso[] }
  | { type: "ADD_PROJETO"; payload: Projeto }
  | { type: "UPDATE_PROJETO"; payload: Projeto }
  | { type: "DELETE_PROJETO"; payload: number }
  | { type: "ADD_MONITORIA"; payload: Monitoria }
  | { type: "UPDATE_MONITORIA"; payload: Monitoria }
  | { type: "DELETE_MONITORIA"; payload: number }
  | { type: "ADD_EVENTO"; payload: Evento }
  | { type: "UPDATE_EVENTO"; payload: Evento }
  | { type: "DELETE_EVENTO"; payload: number };

const initialState: AppState = {
  projetos: [],
  monitorias: [],
  eventos: [],
  usuarios: [],
  disciplinas: [],
  cursos: [],
  loading: {
    projetos: false,
    monitorias: false,
    eventos: false,
    usuarios: false,
    masterData: false,
  },
  error: {
    projetos: null,
    monitorias: null,
    eventos: null,
    usuarios: null,
    masterData: null,
  },
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };

    case "SET_ERROR":
      return {
        ...state,
        error: { ...state.error, [action.payload.key]: action.payload.value },
      };

    case "SET_PROJETOS":
      return { ...state, projetos: action.payload || [] };

    case "SET_MONITORIAS":
      return { ...state, monitorias: action.payload || [] };

    case "SET_EVENTOS":
      return { ...state, eventos: action.payload || [] };

    case "SET_USUARIOS":
      return { ...state, usuarios: action.payload || [] };

    case "SET_DISCIPLINAS":
      return { ...state, disciplinas: action.payload || [] };

    case "SET_CURSOS":
      return { ...state, cursos: action.payload || [] };

    case "ADD_PROJETO":
      return { ...state, projetos: [...state.projetos, action.payload] };

    case "UPDATE_PROJETO":
      return {
        ...state,
        projetos: state.projetos.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };

    case "DELETE_PROJETO":
      return {
        ...state,
        projetos: state.projetos.filter((p) => p.id !== action.payload),
      };

    case "ADD_MONITORIA":
      return { ...state, monitorias: [...state.monitorias, action.payload] };

    case "UPDATE_MONITORIA":
      return {
        ...state,
        monitorias: state.monitorias.map((m) =>
          m.id === action.payload.id ? action.payload : m
        ),
      };

    case "DELETE_MONITORIA":
      return {
        ...state,
        monitorias: state.monitorias.filter((m) => m.id !== action.payload),
      };

    case "ADD_EVENTO":
      return { ...state, eventos: [...state.eventos, action.payload] };

    case "UPDATE_EVENTO":
      return {
        ...state,
        eventos: state.eventos.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      };

    case "DELETE_EVENTO":
      return {
        ...state,
        eventos: state.eventos.filter((e) => e.id !== action.payload),
      };

    default:
      return state;
  }
}

// ===================================================================
// CONTEXT
// ===================================================================
interface AppContextType extends AppState {
  fetchProjetos: () => Promise<void>;
  createProjeto: (data: ProjetoData) => Promise<void>;
  updateProjeto: (id: number, data: Partial<ProjetoData>) => Promise<void>;
  deleteProjeto: (id: number) => Promise<void>;

  fetchMonitorias: () => Promise<void>;
  createMonitoria: (data: MonitoriaData) => Promise<void>;
  updateMonitoria: (id: number, data: Partial<MonitoriaData>) => Promise<void>;
  deleteMonitoria: (id: number) => Promise<void>;

  fetchEventos: () => Promise<void>;
  createEvento: (data: EventoData) => Promise<void>;
  updateEvento: (id: number, data: Partial<EventoData>) => Promise<void>;
  deleteEvento: (id: number) => Promise<void>;

  fetchUsuarios: () => Promise<void>;
  updateUsuario: (id: string, data: Partial<Usuario>) => Promise<void>;
  deleteUsuario: (id: string) => Promise<void>;
  toggleUsuarioStatus: (id: string, ativo: boolean) => Promise<void>;

  fetchMasterData: () => Promise<void>;
  fetchDisciplinas: () => Promise<void>;
  fetchCursos: () => Promise<void>;
}

// CORREÇÃO: Inicializar o contexto com um valor padrão em vez de undefined
const defaultContextValue: AppContextType = {
  ...initialState,
  fetchProjetos: async () => {},
  createProjeto: async () => {},
  updateProjeto: async () => {},
  deleteProjeto: async () => {},
  fetchMonitorias: async () => {},
  createMonitoria: async () => {},
  updateMonitoria: async () => {},
  deleteMonitoria: async () => {},
  fetchEventos: async () => {},
  createEvento: async () => {},
  updateEvento: async () => {},
  deleteEvento: async () => {},
  fetchUsuarios: async () => {},
  updateUsuario: async () => {},
  deleteUsuario: async () => {},
  toggleUsuarioStatus: async () => {},
  fetchMasterData: async () => {},
  fetchDisciplinas: async () => {},
  fetchCursos: async () => {},
};

const AppContext = createContext<AppContextType>(defaultContextValue);

// ===================================================================
// PROVIDER
// ===================================================================
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper para operações async com melhor tratamento de erros
  const handleAsync = async <T,>(
    action: () => Promise<T>,
    loadingKey: keyof AppState["loading"],
    errorKey: keyof AppState["error"]
  ): Promise<T | void> => {
    try {
      dispatch({
        type: "SET_LOADING",
        payload: { key: loadingKey, value: true },
      });
      dispatch({ type: "SET_ERROR", payload: { key: errorKey, value: null } });

      const result = await action();
      return result;
    } catch (error) {
      console.error(`Erro em ${loadingKey}:`, error);

      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      dispatch({
        type: "SET_ERROR",
        payload: { key: errorKey, value: message },
      });

      throw error;
    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: { key: loadingKey, value: false },
      });
    }
  };

  // ===================================================================
  // PROJETOS
  // ===================================================================
  const fetchProjetos = async () => {
    await handleAsync(
      async () => {
        const response = await authFetch(`${API_URL}/api/projetos`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar projetos: ${response.status}`);
        }
        const projetos = await response.json();
        dispatch({
          type: "SET_PROJETOS",
          payload: Array.isArray(projetos) ? projetos : [],
        });
      },
      "projetos",
      "projetos"
    );
  };

  const createProjeto = async (data: ProjetoData) => {
    await handleAsync(
      async () => {
        const response = await authFetch(`${API_URL}/api/projetos`, {
          method: "POST",
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Erro ao criar projeto");
        const projeto = await response.json();
        dispatch({ type: "ADD_PROJETO", payload: projeto });
      },
      "projetos",
      "projetos"
    );
  };

  const updateProjeto = async (id: number, data: Partial<ProjetoData>) => {
    await handleAsync(
      async () => {
        const response = await authFetch(`${API_URL}/api/projetos/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Erro ao atualizar projeto");
        const projeto = await response.json();
        dispatch({ type: "UPDATE_PROJETO", payload: projeto });
      },
      "projetos",
      "projetos"
    );
  };

  const deleteProjeto = async (id: number) => {
    await handleAsync(
      async () => {
        const response = await authFetch(`${API_URL}/api/projetos/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Erro ao deletar projeto");
        dispatch({ type: "DELETE_PROJETO", payload: id });
      },
      "projetos",
      "projetos"
    );
  };

  // ===================================================================
  // EVENTOS
  // ===================================================================
  const fetchEventos = async () => {
    await handleAsync(
      async () => {
        console.log("Buscando eventos...");
        const response = await authFetch(`${API_URL}/api/evento`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar eventos: ${response.status}`);
        }
        const eventos = await response.json();
        console.log("Eventos recebidos:", eventos);
        dispatch({
          type: "SET_EVENTOS",
          payload: Array.isArray(eventos) ? eventos : [],
        });
      },
      "eventos",
      "eventos"
    );
  };

  const createEvento = async (data: EventoData) => {
    await handleAsync(
      async () => {
        const response = await authFetch(`${API_URL}/api/evento`, {
          method: "POST",
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Erro ao criar evento");
        const evento = await response.json();
        dispatch({ type: "ADD_EVENTO", payload: evento });
      },
      "eventos",
      "eventos"
    );
  };

  const updateEvento = async (id: number, data: Partial<EventoData>) => {
    await handleAsync(
      async () => {
        const response = await authFetch(`${API_URL}/api/evento/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Erro ao atualizar evento");
        const evento = await response.json();
        dispatch({ type: "UPDATE_EVENTO", payload: evento });
      },
      "eventos",
      "eventos"
    );
  };

  const deleteEvento = async (id: number) => {
    await handleAsync(
      async () => {
        const response = await authFetch(`${API_URL}/api/evento/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Erro ao deletar evento");
        dispatch({ type: "DELETE_EVENTO", payload: id });
      },
      "eventos",
      "eventos"
    );
  };

  // ===================================================================
  // MONITORIAS
  // ===================================================================
  const fetchMonitorias = async () => {
    await handleAsync(
      async () => {
        const response = await authFetch(`${API_URL}/api/monitoria`);
        if (!response.ok) throw new Error("Erro ao buscar monitorias");
        const monitorias = await response.json();
        dispatch({
          type: "SET_MONITORIAS",
          payload: Array.isArray(monitorias) ? monitorias : [],
        });
      },
      "monitorias",
      "monitorias"
    );
  };

  const createMonitoria = async (data: MonitoriaData) => {
    await handleAsync(
      async () => {
        const response = await authFetch(`${API_URL}/api/monitoria`, {
          method: "POST",
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Erro ao criar monitoria");
        const monitoria = await response.json();
        dispatch({ type: "ADD_MONITORIA", payload: monitoria });
      },
      "monitorias",
      "monitorias"
    );
  };

  const updateMonitoria = async (id: number, data: Partial<MonitoriaData>) => {
    await handleAsync(
      async () => {
        const response = await authFetch(`${API_URL}/api/monitoria/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Erro ao atualizar monitoria");
        const monitoria = await response.json();
        dispatch({ type: "UPDATE_MONITORIA", payload: monitoria });
      },
      "monitorias",
      "monitorias"
    );
  };

  const deleteMonitoria = async (id: number) => {
    await handleAsync(
      async () => {
        const response = await authFetch(`${API_URL}/api/monitoria/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Erro ao deletar monitoria");
        dispatch({ type: "DELETE_MONITORIA", payload: id });
      },
      "monitorias",
      "monitorias"
    );
  };

  // ===================================================================
  // USUÁRIOS (ADMIN)
  // ===================================================================
  const fetchUsuarios = async () => {
    await handleAsync(
      async () => {
        const response = await authFetch(`${API_URL}/api/usuarios`);
        if (!response.ok) throw new Error("Erro ao buscar usuários");
        const usuarios = await response.json();
        dispatch({
          type: "SET_USUARIOS",
          payload: Array.isArray(usuarios) ? usuarios : [],
        });
      },
      "usuarios",
      "usuarios"
    );
  };

  const updateUsuario = async (id: string, data: Partial<Usuario>) => {
    await handleAsync(
      async () => {
        const response = await authFetch(`${API_URL}/api/usuarios/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Erro ao atualizar usuário");
        const usuario = await response.json();
        dispatch({
          type: "SET_USUARIOS",
          payload: state.usuarios.map((u) =>
            u.id === id ? { ...u, ...data } : u
          ),
        });
      },
      "usuarios",
      "usuarios"
    );
  };

  const deleteUsuario = async (id: string) => {
    await handleAsync(
      async () => {
        const response = await authFetch(`${API_URL}/api/usuarios/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Erro ao deletar usuário");
        dispatch({
          type: "SET_USUARIOS",
          payload: state.usuarios.filter((u) => u.id !== id),
        });
      },
      "usuarios",
      "usuarios"
    );
  };

  const toggleUsuarioStatus = async (id: string, ativo: boolean) => {
    await updateUsuario(id, { ativo });
  };

  // ===================================================================
  // MASTER DATA
  // ===================================================================
  const fetchDisciplinas = async () => {
    try {
      const response = await authFetch(`${API_URL}/api/catalogo/disciplinas`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar disciplinas: ${response.status}`);
      }
      const disciplinas = await response.json();
      dispatch({
        type: "SET_DISCIPLINAS",
        payload: Array.isArray(disciplinas) ? disciplinas : [],
      });
    } catch (error) {
      console.error("Erro ao buscar disciplinas:", error);
      dispatch({ type: "SET_DISCIPLINAS", payload: [] });
      throw error;
    }
  };

  const fetchCursos = async () => {
    try {
      const response = await authFetch(`${API_URL}/api/catalogo/cursos`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar cursos: ${response.status}`);
      }
      const cursos = await response.json();
      dispatch({
        type: "SET_CURSOS",
        payload: Array.isArray(cursos) ? cursos : [],
      });
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
      dispatch({ type: "SET_CURSOS", payload: [] });
      throw error;
    }
  };

  const fetchMasterData = async () => {
    await handleAsync(
      async () => {
        const promises = [
          fetchDisciplinas().catch(() => null),
          fetchCursos().catch(() => null),
        ];
        await Promise.allSettled(promises);
      },
      "masterData",
      "masterData"
    );
  };

  // ===================================================================
  // CONTEXT VALUE
  // ===================================================================
  const contextValue: AppContextType = {
    ...state,
    fetchProjetos,
    createProjeto,
    updateProjeto,
    deleteProjeto,
    fetchMonitorias,
    createMonitoria,
    updateMonitoria,
    deleteMonitoria,
    fetchEventos,
    createEvento,
    updateEvento,
    deleteEvento,
    fetchUsuarios,
    updateUsuario,
    deleteUsuario,
    toggleUsuarioStatus,
    fetchMasterData,
    fetchDisciplinas,
    fetchCursos,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

// ===================================================================
// HOOKS COM VALIDAÇÃO SEGURA
// ===================================================================
export function useApp() {
  const context = useContext(AppContext);

  // CORREÇÃO: Remover verificação de undefined pois agora temos valor padrão
  if (!context) {
    console.error("useApp deve ser usado dentro de um AppProvider");
    return defaultContextValue;
  }

  return context;
}

export function useProjetos() {
  const context = useApp();

  return {
    projetos: context.projetos || [],
    loading: context.loading?.projetos || false,
    error: context.error?.projetos || null,
    fetchProjetos: context.fetchProjetos,
    createProjeto: context.createProjeto,
    updateProjeto: context.updateProjeto,
    deleteProjeto: context.deleteProjeto,
  };
}

export function useMonitorias() {
  const context = useApp();

  return {
    monitorias: context.monitorias || [],
    loading: context.loading?.monitorias || false,
    error: context.error?.monitorias || null,
    fetchMonitorias: context.fetchMonitorias,
    createMonitoria: context.createMonitoria,
    updateMonitoria: context.updateMonitoria,
    deleteMonitoria: context.deleteMonitoria,
  };
}

export function useEventos() {
  const context = useApp();

  return {
    eventos: context.eventos || [],
    loading: context.loading?.eventos || false,
    error: context.error?.eventos || null,
    fetchEventos: context.fetchEventos,
    createEvento: context.createEvento,
    updateEvento: context.updateEvento,
    deleteEvento: context.deleteEvento,
  };
}

export function useAdmin() {
  const context = useApp();

  return {
    usuarios: context.usuarios || [],
    loading: context.loading?.usuarios || false,
    error: context.error?.usuarios || null,
    fetchUsuarios: context.fetchUsuarios,
    updateUsuario: context.updateUsuario,
    deleteUsuario: context.deleteUsuario,
    toggleUsuarioStatus: context.toggleUsuarioStatus,
  };
}

export function useMasterData() {
  const context = useApp();

  return {
    disciplinas: context.disciplinas || [],
    cursos: context.cursos || [],
    loading: context.loading?.masterData || false,
    error: context.error?.masterData || null,
    fetchMasterData: context.fetchMasterData,
    fetchDisciplinas: context.fetchDisciplinas,
    fetchCursos: context.fetchCursos,
  };
}
