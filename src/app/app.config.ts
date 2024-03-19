import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { AuthInterceptor } from './core/services/auth.interceptor.service';
import { authInterceptor } from './core/services/test.interceptor.service';
import { reducers } from './store';
import { AuthEffects } from './store/auth/auth.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideStore(reducers),
    provideEffects(AuthEffects),
    provideStoreDevtools({ maxAge: 25 }),
    provideHttpClient(withInterceptors([authInterceptor, AuthInterceptor])),
  ],
};
