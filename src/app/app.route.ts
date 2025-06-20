import { Routes } from '@angular/router';

// dashboard
import { IndexComponent } from './index';
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';

export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'pacientes', loadComponent: () => import('./pacientes/bandeja-paciente/bandeja-paciente.component').then((c) => c.BandejaPacienteComponent) },

            // dashboard
            { path: 'alergias', loadComponent: () => import('./mantenimiento/alergias/alergias.component').then((c) => c.AlergiasComponent) },
            { path: 'patologias', loadComponent: () => import('./mantenimiento/patologias/patologias.component').then((c) => c.PatologiasComponent) },
            { path: 'medicamentos', loadComponent: () => import('./mantenimiento/medicamentos/medicamentos.component').then((c) => c.MedicamentosComponent) },
            { path: 'objetivos', loadComponent: () => import('./mantenimiento/objetivos/objetivos.component').then((c) => c.ObjetivosComponent) },
            {
                path: 'tiempo-comida',
                loadComponent: () => import('./mantenimiento/tiempo-comida/tiempo-comida.component').then((c) => c.TiempoComidaComponent),
            },
        ],
    },

    {
        path: 'login',
        component: AuthLayout,
        children: [],
    },
];
