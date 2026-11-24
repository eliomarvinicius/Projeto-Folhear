export interface Livro {
  id: string;
  titulo: string;
  autores: string[];
  ano?: number;
  capaId?: number;
}

export interface LivroDetalhe extends Livro {
  descricao: string;
  assuntos: string[];
  criadoEm?: string;
  autorId?: string;
}

export interface Resultado {
  total: number;
  livros: Livro[];
}

export const ASSUNTOS = ['fantasy', 'romance', 'mystery', 'history', 'poetry', 'adventure'];

export function urlCapa(capaId: number, tamanho: 'S' | 'M' | 'L' = 'M'): string {
  return `https://covers.openlibrary.org/b/id/${capaId}-${tamanho}.jpg`;
}
