import { inject } from '@angular/core';

import { HttpInterceptorFn } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);

  console.log('spinner interceptor...');

  return next(req);
};
