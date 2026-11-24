import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonChip, IonContent, IonHeader, IonList, IonSpinner, IonTitle, IonToolbar } from '@ionic/angular';

import { LivroItemComponent } from '../components/livro-item/livro-item.component';
import { ASSUNTOS, Livro } from '../models/livro';
import { LivrosService } from '../services/livros.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonChip,
    IonList,
    IonSpinner,
    IonButton,
    RouterLink,
    TitleCasePipe,
    LivroItemComponent,
  ],
})
export class HomePage implements OnInit {
  assuntos = ASSUNTOS;
  destaque = 'fantasy';

  livros = signal<Livro[]>([]);
  carregando = signal(true);
  erro = signal(false);

  constructor(private livrosService: LivrosService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set(false);
    this.livrosService.getPorAssunto(this.destaque, 6).subscribe({
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
