import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private _loginUrl =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAxXZQ-CyuMh_FSuslXYmFOOnHUFWF5F0g';

    constructor(private http: HttpClient) {}

    login(email: string, password: string) {
        return this.http.post(this._loginUrl, {
            email: email,
            password: password,
        });
    }

    logout() {
        localStorage.removeItem('userData');
    }
}
