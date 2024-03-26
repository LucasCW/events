import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as fromMarker from './event/events.reducer';

export interface State {
    events: fromMarker.State;
}

export const reducers: ActionReducerMap<State> = {
    events: fromMarker.eventsReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
