import { Directive, HostBinding, HostListener, Input } from '@angular/core';

import { Livro } from '../models/livro';
import { FavoritosService } from '../services/favoritos.service';

@Directive({ selector: '[appFavorito]' })
export class FavoritoDirective {
  @Input({ required: true }) appFavorito!: Livro;

  constructor(private favoritos: FavoritosService) {}

  @HostBinding('class.ativo') get ativo(): boolean {
    return this.favoritos.ehFavorito(this.appFavorito.id);
  }

  @HostBinding('attr.aria-pressed') get pressionado(): string {
    return String(this.ativo);
  }

  @HostListener('click', ['$event']) alternar(evento: Event): void {
    evento.preventDefault();
    evento.stopPropagation();
    this.favoritos.alternar(this.appFavorito);
  }
}
