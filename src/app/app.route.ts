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
            { path:'toro', loadComponent:()=> import('./mantenimiento/toro/toro.component').then((c)=>c.ToroComponent)},
        ],
    },

    {
        path: 'login',
        component: AuthLayout,
        children: [],
    },
];
