import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authentication } from '../services/authentication';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(Authentication);
    const router = inject(Router);

    return authService.checkAuthStatus().pipe(
        map(isAuthenticated => {
            if (isAuthenticated) {
                return true;
            }

            return router.createUrlTree(['/']);
        })
    );
};
