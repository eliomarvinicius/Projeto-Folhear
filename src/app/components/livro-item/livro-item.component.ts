import { UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonIcon, IonItem, IonLabel, IonThumbnail } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

import { DestaqueDirective } from '../../directives/destaque.directive';
import { FavoritoDirective } from '../../directives/favorito.directive';
import { Livro, urlCapa } from '../../models/livro';
import { AutoresPipe } from '../../pipes/autores.pipe';
import { SeculoPipe } from '../../pipes/seculo.pipe';

@Component({
  selector: 'app-livro-item',
  templateUrl: './livro-item.component.html',
  imports: [
    IonItem,
    IonThumbnail,
    IonLabel,
    IonButton,
    IonIcon,
    RouterLink,
    UpperCasePipe,
    AutoresPipe,
    SeculoPipe,
    DestaqueDirective,
    FavoritoDirective,
  ],
})
export class LivroItemComponent {
  @Input({ required: true }) livro!: Livro;
  @Input() numero?: number;

  constructor() {
    addIcons({ heart, heartOutline });
  }

  get capa(): string {
    return urlCapa(this.livro.capaId ?? 0, 'M');
  }
}
