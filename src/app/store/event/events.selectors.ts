import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './events.reducer';

export const featureKey = 'events';

export const featureSelector = createFeatureSelector<State>(featureKey);

export const eventsSelector = createSelector(
    featureSelector,
    (state: State) => {
        return state.events;
    }
);
