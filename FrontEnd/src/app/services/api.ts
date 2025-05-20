import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Participante {
  id: number;
  nome: string;
  email: string;
  evento: string; // Campo que relaciona o participante com o evento
}

export interface Recurso {
  id: number;
  recurso: string;
  descricao: string;
  qtd: number;
  valorUnit: number;
  valorAprovado: number;
  evento: string; // Campo que relaciona o recurso com o evento
  totalSolicitado: number;
}

export interface EventoPayload {
  id: number; // Enviar 0 para criar um novo evento
  participantes: Participante[];
  titulo: string;
  curso?: string;
  dataInicio: string; // Formato: YYYY-MM-DD
  dataTermino: string; // Formato: YYYY-MM-DD
  local: string;
  justificativa: string;
  vlTotalAprovado: number;
  vlTotalSolicitado: number;
  recurso: Recurso[];
}

export interface EventoResponse extends EventoPayload {
  id: number;
  recurso?: Recurso[];
  participantes?: Participante[];
}

const EventoService = {
  // Listar todos os eventos
  listarEventos: async (): Promise<EventoResponse[]> => {
    try {
      const response = await api.get('/evento');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar eventos:', error);
      throw error;
    }
  },

  // Buscar evento por ID
  buscarEvento: async (id: number): Promise<EventoResponse> => {
    try {
      const response = await api.get(`/evento/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar evento ${id}:`, error);
      throw error;
    }
  },

  // Criar novo evento
  criarEvento: async (eventoData: EventoPayload): Promise<EventoResponse> => {
    try {
      // Envio dos dados para criar um novo evento
      const response = await api.post('/evento', eventoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw error;
    }
  },

  // Atualizar evento existente
  atualizarEvento: async (id: number, eventoData: EventoPayload): Promise<EventoResponse> => {
    try {
      const response = await api.put(`/evento/${id}`, eventoData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar evento ${id}:`, error);
      throw error;
    }
  },

  // Adicionar participantes a um evento
  adicionarParticipantes: async (eventoId: number, participantes: Participante[]): Promise<EventoResponse> => {
    try {
      const response = await api.post(`/evento/${eventoId}/participantes`, { participantes });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar participantes:', error);
      throw error;
    }
  },

  // Listar participantes de um evento
  listarParticipantes: async (eventoId: number): Promise<Participante[]> => {
    try {
      const response = await api.get(`/evento/${eventoId}/participantes`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar participantes:', error);
      throw error;
    }
  },

  // Deletar evento
  deletarEvento: async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/evento/${id}`);
      return true;
    } catch (error) {
      console.error(`Erro ao deletar evento ${id}:`, error);
      throw error;
    }
  },
};

export default EventoService;
