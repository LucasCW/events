import { HttpClientModule } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthenticationService } from '../core/services/authentication.service';
import { isPlatformBrowser } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserLarge, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [AuthenticationService],
})
export class LoginComponent implements OnInit, AfterViewInit {
  email: string = 'test@test.com';
  password: string = 'abc123';

  modal?: Modal;

  faUserLarge = faUserLarge;
  faPlus = faPlus;

  @ViewChild('loginModal', { static: true }) loginModal!: ElementRef;
  isBrowser: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    @Inject(PLATFORM_ID) private platformId: any,
    private render: Renderer2
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    this.getLoggedInUser();
  }

  getLoggedInUser() {
    if (this.isBrowser) {
      const loggedInUser = localStorage.getItem('user');
      if (loggedInUser) {
        // TODO Already logged in.
        console.log('already loggedIn', loggedInUser);
      } else {
        this.modal?.show();
      }
    }
  }

  ngOnInit(): void {
    this.modal = new Modal(this.loginModal.nativeElement);
  }

  openModal() {
    this.modal?.show();
  }

  closeModal() {
    this.modal?.hide();
  }

  login(form: NgForm) {
    this.authenticationService
      .login(form.value.email, form.value.password)
      .subscribe({
        next: (result) => {
          localStorage.setItem('user', JSON.stringify(result));
          this.modal?.hide();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
