import { DatePipe, SlicePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

import { FavoritoDirective } from '../directives/favorito.directive';
import { LivroDetalhe, urlCapa } from '../models/livro';
import { AutoresPipe } from '../pipes/autores.pipe';
import { SeculoPipe } from '../pipes/seculo.pipe';
import { LivrosService } from '../services/livros.service';

@Component({
  selector: 'app-detalhes',
  templateUrl: 'detalhes.page.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonSpinner,
    IonButton,
    IonIcon,
    IonChip,
    DatePipe,
    SlicePipe,
    TitleCasePipe,
    UpperCasePipe,
    AutoresPipe,
    SeculoPipe,
    FavoritoDirective,
  ],
})
export class DetalhesPage implements OnInit {
  livro = signal<LivroDetalhe | null>(null);
  carregando = signal(true);
  erro = signal(false);

  constructor(
    private route: ActivatedRoute,
    private livrosService: LivrosService,
  ) {
    addIcons({ heart, heartOutline });
  }

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.carregando.set(true);
    this.erro.set(false);
    this.livrosService.getObra(id).subscribe({
      next: (obra) => {
        this.livro.set(obra);
        this.carregando.set(false);
        this.buscarAutor(obra);
      },
      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
      },
    });
  }

  capa(livro: LivroDetalhe): string {
    return urlCapa(livro.capaId ?? 0, 'L');
  }

  private buscarAutor(obra: LivroDetalhe): void {
    if (!obra.autorId) {
      return;
    }
    this.livrosService.getAutor(obra.autorId).subscribe({
      next: (nome) => this.livro.update((atual) => (atual ? { ...atual, autores: [nome] } : atual)),
    });
  }
}
