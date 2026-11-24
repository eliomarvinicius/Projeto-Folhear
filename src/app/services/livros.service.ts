import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';

import { LivroDetalhe, Resultado } from '../models/livro';

interface WorkAssunto {
  key: string;
  title: string;
  cover_id?: number | null;
  first_publish_year?: number | null;
  authors?: { name: string }[];
}

interface RespostaAssunto {
  work_count: number;
  works: WorkAssunto[];
}

interface DocBusca {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number | null;
  cover_i?: number | null;
}

interface RespostaBusca {
  numFound: number;
  docs: DocBusca[];
}

interface ObraApi {
  title: string;
  description?: string | { value: string };
  subjects?: string[];
  covers?: number[];
  first_publish_date?: string;
  created?: { value: string };
  authors?: { author: { key: string } }[];
}

interface AutorApi {
  name: string;
}

const ID_OBRA = /^OL\d+W$/;
const ID_AUTOR = /^OL\d+A$/;

@Injectable({ providedIn: 'root' })
export class LivrosService {
  private readonly base = 'https://openlibrary.org';

  constructor(private http: HttpClient) {}

  // GET 1: livros de um assunto
  getPorAssunto(assunto: string, limite = 36): Observable<Resultado> {
    const slug = assunto.trim().toLowerCase().replace(/\s+/g, '_');
    const params = new HttpParams().set('limit', limite);
    return this.http
      .get<RespostaAssunto>(`${this.base}/subjects/${encodeURIComponent(slug)}.json`, { params })
      .pipe(
        map((resposta) => ({
          total: resposta.work_count,
          livros: resposta.works
            .filter((w) => ID_OBRA.test(idDaChave(w.key)))
            .map((w) => ({
              id: idDaChave(w.key),
              titulo: w.title,
              autores: (w.authors ?? []).map((a) => a.name),
              ano: positivo(w.first_publish_year),
              capaId: positivo(w.cover_id),
            })),
        })),
      );
  }

  // GET 2: busca por texto
  buscar(texto: string, limite = 36): Observable<Resultado> {
    const params = new HttpParams()
      .set('q', texto)
      .set('limit', limite)
      .set('fields', 'key,title,author_name,first_publish_year,cover_i');
    return this.http.get<RespostaBusca>(`${this.base}/search.json`, { params }).pipe(
      map((resposta) => ({
        total: resposta.numFound,
        livros: resposta.docs
          .filter((d) => ID_OBRA.test(idDaChave(d.key)))
          .map((d) => ({
            id: idDaChave(d.key),
            titulo: d.title,
            autores: d.author_name ?? [],
            ano: positivo(d.first_publish_year),
            capaId: positivo(d.cover_i),
          })),
      })),
    );
  }

  // GET 3: detalhes de uma obra
  getObra(id: string): Observable<LivroDetalhe> {
    if (!ID_OBRA.test(id)) {
      return throwError(() => new Error('Identificador de obra inválido'));
    }
    return this.http.get<ObraApi>(`${this.base}/works/${id}.json`).pipe(
      map((obra) => {
        const descricao =
          typeof obra.description === 'string' ? obra.description : (obra.description?.value ?? '');
        const livro: LivroDetalhe = {
          id,
          titulo: obra.title,
          autores: [],
          ano: anoDe(obra.first_publish_date),
          capaId: (obra.covers ?? []).find((c) => c > 0),
          descricao,
          assuntos: (obra.subjects ?? []).slice(0, 8),
          criadoEm: obra.created?.value,
          autorId: obra.authors?.[0]?.author.key.replace('/authors/', ''),
        };
        return livro;
      }),
    );
  }

  // GET 4 (apoio): nome do autor
  getAutor(id: string): Observable<string> {
    if (!ID_AUTOR.test(id)) {
      return throwError(() => new Error('Identificador de autor inválido'));
    }
    return this.http.get<AutorApi>(`${this.base}/authors/${id}.json`).pipe(map((a) => a.name));
  }
}

function idDaChave(chave: string): string {
  return chave.replace('/works/', '');
}

function positivo(valor?: number | null): number | undefined {
  return valor && valor > 0 ? valor : undefined;
}

function anoDe(data?: string): number | undefined {
  const ano = data?.match(/\d{4}/)?.[0];
  return ano ? Number(ano) : undefined;
}
