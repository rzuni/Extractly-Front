import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const handleErrorsInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: any): Observable<any> => {
      console.error('HTTP error', error);

      if ((error.status === 401 || error.status === 403) && !req.url.includes('auth')) {
        authService.logout();
        router.navigateByUrl('/login');
        return of({ status: false });
      }

      if (error.status === 422) return throwError(() => error.error);
      if (error.status === 404) return throwError(() => ({ status: false }));

      return of({ status: false });
    })
  );
};
