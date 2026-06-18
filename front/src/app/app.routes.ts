import { Routes } from '@angular/router';
import { AuthLayout } from './pages/layout/auth-layout';
import { Login } from './pages/login/login';
import { ConnectedLayout } from './pages/layout/connected-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Settings } from './pages/settings/settings';
import { NotFound } from './pages/not-found/not-found';
import { ResetPassword } from './pages/reset-password/reset-password';
import { Register } from './pages/register/register';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: "",
        component: AuthLayout,
        children: [
            { path: "", component: Login },
            { path: "reset-password", component: ResetPassword },
            { path: "register", component: Register },
        ],
    },
    {
        path: "",
        component: ConnectedLayout,
        children: [
            { path: "dashboard", canActivate: [authGuard], component: Dashboard },
            { path: "settings", canActivate: [authGuard], component: Settings },
        ],
    },
    {
        path: "**",
        component: NotFound,
    }
];
