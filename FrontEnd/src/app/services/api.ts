import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // URL do seu backend Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = async (userData: {
  nome: string;
  email: string;
  senha: string;
  confirmacaoSenha: string;
  aceiteTermos: boolean;
}) => {
  try {
    const response = await api.post('/usuarios/registrar', {
      nome: userData.nome,
      email: userData.email,
      senha: userData.senha,
      confirmacaoSenha: userData.confirmacaoSenha,
      aceiteTermos: userData.aceiteTermos,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;