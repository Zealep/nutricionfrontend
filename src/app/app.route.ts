import { TipoInseminacion } from './model/tipo-inseminacion';
import { Toro } from './model/toro';
import { ProtocoloComponent } from './mantenimiento/protocolo/protocolo.component';
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
            { path:'protocolo', loadComponent:()=> import('./mantenimiento/protocolo/protocolo.component').then((c)=>c.ProtocoloComponent)},
            { path:'tipo-raza', loadComponent:()=> import('./mantenimiento/tipo-raza/tipo-raza.component').then((c)=>c.TipoRazaComponent)},
            { path:'tipo-inseminacion', loadComponent:()=> import('./mantenimiento/tipo-inseminacion/tipo-inseminacion.component').then((c)=>c.TipoInseminacionComponent)},
            { path:'inseminador', loadComponent:()=> import('./mantenimiento/inseminador/inseminador.component').then((c)=>c.InseminadorComponent)},
            { path:'toro', loadComponent:()=> import('./mantenimiento/toro/toro.component').then((c)=>c.ToroComponent)},
        ],
    },

    {
        path: 'login',
        component: AuthLayout,
        children: [],
    },
];
