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

export interface Assunto {
  slug: string;
  nome: string;
}

// slug vai para a API (em inglês); nome aparece na tela
export const ASSUNTOS: Assunto[] = [
  { slug: 'fantasy', nome: 'fantasia' },
  { slug: 'romance', nome: 'romance' },
  { slug: 'mystery', nome: 'mistério' },
  { slug: 'history', nome: 'história' },
  { slug: 'poetry', nome: 'poesia' },
  { slug: 'adventure', nome: 'aventura' },
  { slug: 'science_fiction', nome: 'ficção científica' },
  { slug: 'horror', nome: 'terror' },
];

export function nomeAssunto(slug: string): string {
  return ASSUNTOS.find((a) => a.slug === slug)?.nome ?? slug.replace(/_/g, ' ');
}

export function urlCapa(capaId: number, tamanho: 'S' | 'M' | 'L' = 'M'): string {
  return `https://covers.openlibrary.org/b/id/${capaId}-${tamanho}.jpg`;
}
