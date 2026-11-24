import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'detalhes/:id',
    loadComponent: () => import('./detalhes/detalhes.page').then((m) => m.DetalhesPage),
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
];
