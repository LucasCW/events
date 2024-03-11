import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthenticationService } from '../core/services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [AuthenticationService],
})
export class LoginComponent {
  email: string = 'test@test.com';
  password: string = 'abc123';

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  login(form: NgForm) {
    this.authenticationService
      .login(form.value.email, form.value.password)
      .subscribe((result) => {
        localStorage.setItem('user', JSON.stringify(result));
      });
  }
}
