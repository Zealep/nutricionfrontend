import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'datos-personales',
        loadComponent: () => import('./datos-personales/datos-personales.component').then(m => m.DatosPersonalesComponent),
      },
      {
        path: 'estilo-vida',
        loadComponent: () => import('./estilo-vida/estilo-vida.component').then(m => m.EstiloVidaComponent),
      },
      {
        path: 'condicion-salud',
        loadComponent: () => import('./condicion-salud/condicion-salud.component').then(m => m.CondicionSaludComponent),
      },
      {
        path: 'evaluacion',
        loadComponent: () => import('./evaluacion-nutricional/evaluacion-nutricional.component').then(m => m.EvaluacionNutricionalComponent),
      },
      { path: '', redirectTo: 'datos-personales', pathMatch: 'full' }
    ]
  }
];
