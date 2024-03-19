import { createReducer, on } from '@ngrx/store';
import { User } from '../../core/models/login-info';
import * as AuthActions from './auth.actions';

export interface State {
    isLoggedIn: boolean;
    loggedInUser?: User;
    error?: string;
}

const initialState: State = {
    isLoggedIn: false,
    loggedInUser: undefined,
    error: undefined,
};

export const authReducer = createReducer(
    initialState,
    on(AuthActions.AuthenticateSuccess, (state, action) => {
        const user = new User(
            action.payload.idToken,
            action.payload.email,
            action.payload.refreshToken,
            action.payload.expiresIn,
            action.payload.localId,
            action.payload.registered
        );
        return {
            ...state,
            isLoggedIn: true,
            loggedInUser: user,
            error: undefined,
        };
    }),
    on(AuthActions.LoginStart, (state, action) => {
        return {
            ...state,
            loggedInUser: undefined,
            isLoggedIn: false,
            error: undefined,
        };
    }),
    on(AuthActions.AuthenticateFail, (state, action) => {
        return {
            ...state,
            loggedInUser: undefined,
            error: action.payload,
        };
    }),
    on(AuthActions.Reset, AuthActions.Logout, (state, _) => {
        return {
            ...state,
            loggedInUser: undefined,
            error: undefined,
            isLoggedIn: false,
        };
    })
);
