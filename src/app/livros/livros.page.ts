import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonChip,
  IonContent,
  IonHeader,
  IonList,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';

import { LivroItemComponent } from '../components/livro-item/livro-item.component';
import { ASSUNTOS, Livro, Resultado, nomeAssunto } from '../models/livro';
import { LivrosService } from '../services/livros.service';

@Component({
  selector: 'app-livros',
  templateUrl: 'livros.page.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonButton,
    IonChip,
    IonList,
    IonSpinner,
    RouterLink,
    TitleCasePipe,
    DecimalPipe,
    NgxPaginationModule,
    LivroItemComponent,
  ],
})
export class LivrosPage implements OnInit {
  assuntos = ASSUNTOS;
  nome = nomeAssunto;
  porPagina = 12;
  texto = '';

  termo = signal('');
  assuntoAtivo = signal('');
  livros = signal<Livro[]>([]);
  total = signal(0);
  pagina = signal(1);
  carregando = signal(false);
  erro = signal(false);
  totalPaginas = computed(() => Math.max(1, Math.ceil(this.livros().length / this.porPagina)));
  private requisicao?: Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private livrosService: LivrosService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const q = String(params['q'] ?? '').trim();
      const assunto = String(params['assunto'] ?? '').trim() || 'fantasy';
      this.texto = q;
      this.termo.set(q);
      this.assuntoAtivo.set(q ? '' : assunto);
      this.carregar(q ? this.livrosService.buscar(q) : this.livrosService.getPorAssunto(assunto));
    });
  }

  buscar(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: this.texto.trim() || null },
    });
  }

  recarregar(): void {
    const q = this.termo();
    this.carregar(
      q ? this.livrosService.buscar(q) : this.livrosService.getPorAssunto(this.assuntoAtivo()),
    );
  }

  private carregar(origem: Observable<Resultado>): void {
    this.carregando.set(true);
    this.erro.set(false);
    this.requisicao?.unsubscribe();
    this.requisicao = origem.subscribe({
      next: (resultado) => {
        this.livros.set(resultado.livros);
        this.total.set(resultado.total);
        this.pagina.set(1);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
      },
    });
  }
}
