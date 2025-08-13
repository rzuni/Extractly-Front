import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const base = environment.apiUrl.replace(/\/+$/, ''); // quita slashes finales
  const path = req.url.replace(/^\/+/, ''); // quita slashes iniciales

  const clonedRequest = req.clone({
    url: `${base}/${path}`,
    setHeaders: {
      Accept: 'application/json',
    },
  });

  return next(clonedRequest);
};
