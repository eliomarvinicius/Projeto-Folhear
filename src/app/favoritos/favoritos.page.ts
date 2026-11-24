import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonList, IonTitle, IonToolbar } from '@ionic/angular';

import { LivroItemComponent } from '../components/livro-item/livro-item.component';
import { FavoritosService } from '../services/favoritos.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: 'favoritos.page.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonButton, RouterLink, LivroItemComponent],
})
export class FavoritosPage {
  favoritos = this.servico.favoritos;

  constructor(private servico: FavoritosService) {}
}
