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
            // dashboard
            { path:'alergias', loadComponent:()=> import('./mantenimiento/alergias/alergias.component').then((c)=>c.AlergiasComponent)},
        ],
    },

    {
        path: 'login',
        component: AuthLayout,
        children: [],
    },
];
