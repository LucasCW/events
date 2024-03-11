import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginInfo } from '../models/login-info';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private _loginUrl =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAxXZQ-CyuMh_FSuslXYmFOOnHUFWF5F0g';

  constructor(private http: HttpClient) {}

  // https://medium.com/@aayyash/authentication-in-angular-why-it-is-so-hard-to-wrap-your-head-around-it-23ea38a366de

  login(email: string, password: string) {
    return this.http.post<LoginInfo>(this._loginUrl, {
      email: email,
      password: password,
    });
  }

  logout() {
    localStorage.removeItem('user');
  }
}
