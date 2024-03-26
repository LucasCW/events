import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { AuthInterceptor } from './core/services/auth.interceptor.service';
import { authInterceptor } from './core/services/test.interceptor.service';
import { reducers } from './store';
import { EventsEffect } from './store/event/events.effeccts';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideClientHydration(),
        provideHttpClient(),
        provideStore(reducers),
        provideEffects(EventsEffect),
        provideStoreDevtools({ maxAge: 25 }),
        provideHttpClient(withInterceptors([authInterceptor, AuthInterceptor])),
        provideAnimationsAsync(),
        importProvidersFrom(
            provideFirebaseApp(() =>
                initializeApp({
                    projectId: 'events-7fd3a',
                    appId: '1:489179659557:web:2837d758f2193c2d13eecc',
                    databaseURL:
                        'https://events-7fd3a-default-rtdb.firebaseio.com',
                    storageBucket: 'events-7fd3a.appspot.com',
                    apiKey: 'AIzaSyAxXZQ-CyuMh_FSuslXYmFOOnHUFWF5F0g',
                    authDomain: 'events-7fd3a.firebaseapp.com',
                    messagingSenderId: '489179659557',
                    measurementId: 'G-G5085JZ7ZP',
                })
            )
        ),
        importProvidersFrom(provideAuth(() => getAuth())),
        importProvidersFrom(provideDatabase(() => getDatabase())),
    ],
};
