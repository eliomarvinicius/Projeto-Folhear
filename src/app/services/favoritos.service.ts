import { Injectable, signal } from '@angular/core';

import { Livro } from '../models/livro';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private readonly chave = 'folhear.favoritos';

  readonly favoritos = signal<Livro[]>(this.ler());

  ehFavorito(id: string): boolean {
    return this.favoritos().some((livro) => livro.id === id);
  }

  alternar(livro: Livro): void {
    const atuais = this.favoritos();
    const novos = this.ehFavorito(livro.id)
      ? atuais.filter((item) => item.id !== livro.id)
      : [
          ...atuais,
          {
            id: livro.id,
            titulo: livro.titulo,
            autores: livro.autores,
            ano: livro.ano,
            capaId: livro.capaId,
          },
        ];
    this.favoritos.set(novos);
    try {
      localStorage.setItem(this.chave, JSON.stringify(novos));
    } catch {
      // sem espaço ou armazenamento bloqueado: a lista segue só em memória
    }
  }

  private ler(): Livro[] {
    try {
      const dados: unknown = JSON.parse(localStorage.getItem(this.chave) ?? '[]');
      return Array.isArray(dados) ? dados.filter(ehLivro) : [];
    } catch {
      return [];
    }
  }
}

function ehLivro(dado: unknown): dado is Livro {
  if (typeof dado !== 'object' || dado === null) {
    return false;
  }
  const livro = dado as Partial<Livro>;
  return (
    typeof livro.id === 'string' &&
    typeof livro.titulo === 'string' &&
    Array.isArray(livro.autores) &&
    livro.autores.every((autor) => typeof autor === 'string')
  );
}
