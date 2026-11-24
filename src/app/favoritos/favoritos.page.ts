import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonIcon, IonList, IonTitle, IonToolbar } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heartOutline } from 'ionicons/icons';

import { LivroItemComponent } from '../components/livro-item/livro-item.component';
import { FavoritosService } from '../services/favoritos.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: 'favoritos.page.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonButton,
    IonIcon,
    RouterLink,
    LivroItemComponent,
  ],
})
export class FavoritosPage {
  favoritos = this.servico.favoritos;

  constructor(private servico: FavoritosService) {
    addIcons({ heartOutline });
  }
}
