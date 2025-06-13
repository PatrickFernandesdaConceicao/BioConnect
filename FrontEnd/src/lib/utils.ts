import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes CSS com suporte para variantes do Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata uma data para o formato local
 */
export function formatDate(date: Date | string): string {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Formata um valor monetário para Real (BRL)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Trunca um texto para um tamanho específico e adiciona "..." se necessário
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Gera um ID único
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Verifica se um objeto é vazio
 */
export function isEmptyObject(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Obtém a cor correspondente ao status do projeto/evento/monitoria
 */
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    PENDENTE: "yellow",
    APROVADO: "green",
    REJEITADO: "red",
    EM_ANDAMENTO: "blue",
    CONCLUIDO: "purple",
    CANCELADO: "gray",
  };

  return statusColors[status] || "gray";
}

/**
 * Converte uma string para camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

/**
 * Debounce para funções que são chamadas frequentemente
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
) {
  let timeout: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Valida um endereço de email
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
