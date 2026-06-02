import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { ConnectedLayout } from './pages/layout/connected-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Settings } from './pages/settings/settings';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
    {
        path: "",
        component: Login,
        pathMatch: 'full',
    },
    {
        path: "",
        component: ConnectedLayout,
        children: [
            { path: "dashboard", component: Dashboard },
            { path: "settings", component: Settings },
        ],
    },
    {
        path:"**",
        component:NotFound,
    }
];
