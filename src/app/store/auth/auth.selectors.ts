import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './auth.reducer';

export const featureKey = 'auth';

export const featureSelector = createFeatureSelector<State>(featureKey);

export const isLoggedInSelector = createSelector(
    featureSelector,
    (state: State) => state.isLoggedIn
);

export const errorSelector = createSelector(
    featureSelector,
    (state: State) => state.error
);

export const loggedInUserSelector = createSelector(
    featureSelector,
    (state: State) => {
        return state.loggedInUser;
    }
);
