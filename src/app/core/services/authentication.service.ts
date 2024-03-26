import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    constructor(private auth: Auth) {}

    loginWithAuth(email: string, password: string) {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    logoutWithAuth() {
        return signOut(this.auth);
    }
}
