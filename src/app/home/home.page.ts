import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonChip,
  IonContent,
  IonHeader,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { DestaqueDirective } from '../directives/destaque.directive';
import { ASSUNTOS, Livro, nomeAssunto, urlCapa } from '../models/livro';
import { AutoresPipe } from '../pipes/autores.pipe';
import { LivrosService } from '../services/livros.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonChip,
    IonSpinner,
    IonButton,
    RouterLink,
    TitleCasePipe,
    AutoresPipe,
    DestaqueDirective,
  ],
})
export class HomePage implements OnInit {
  assuntos = ASSUNTOS;
  destaque = 'fantasy';
  nomeDestaque = nomeAssunto(this.destaque);
  texto = '';

  livros = signal<Livro[]>([]);
  carregando = signal(true);
  erro = signal(false);

  constructor(
    private livrosService: LivrosService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  capa(livro: Livro): string {
    return urlCapa(livro.capaId ?? 0, 'M');
  }

  buscar(): void {
    const q = this.texto.trim();
    if (q) {
      this.router.navigate(['/tabs/livros'], { queryParams: { q } });
    }
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set(false);
    this.livrosService.getPorAssunto(this.destaque, 12).subscribe({
      next: (resultado) => {
        this.livros.set(resultado.livros);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
      },
    });
  }
}
