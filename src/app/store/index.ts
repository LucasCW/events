import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as fromAuth from '../store/auth/auth.reducer';
import * as fromMarker from './event/events.reducer';

export interface State {
    auth: fromAuth.State;
    events: fromMarker.State;
}

export const reducers: ActionReducerMap<State> = {
    auth: fromAuth.authReducer,
    events: fromMarker.eventsReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
