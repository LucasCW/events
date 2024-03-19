import { createAction, props } from '@ngrx/store';
import { User } from '../../core/models/login-info';

export const LOGIN_START = '[Auth] Login Start';
export const AUTHENTICATE_SUCCESS = '[Auth] Authenticate Success';
export const AUTHENTICATE_FAIL = '[Auth] Authenticate Fail';
export const RESET = '[Auth] Reset';
export const LOG_OUT = '[Auth] Log Out';

export const AuthenticateSuccess = createAction(
    AUTHENTICATE_SUCCESS,
    props<{ payload: User }>()
);

export const LoginStart = createAction(
    LOGIN_START,
    props<{ payload: { email: string; password: string } }>()
);

export const AuthenticateFail = createAction(
    AUTHENTICATE_FAIL,
    props<{ payload: string }>()
);

export const Reset = createAction(RESET);

export const Logout = createAction(LOG_OUT);
