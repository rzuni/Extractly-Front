import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const accessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (!authService.check()) return next(req);
  if (req.url.includes('auth')) return next(req);

  const token = authService.getAccessToken()?.replace(/"/g, '');
  if (!token) return next(req);

  return next(req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }));
};
