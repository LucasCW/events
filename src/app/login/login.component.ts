import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
    FormControl,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Modal } from 'bootstrap';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../core/services/authentication.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    providers: [AuthenticationService],
})
export class LoginComponent implements OnInit {
    errorSubject = new BehaviorSubject<string>('');
    errors$ = this.errorSubject.asObservable();

    private modal?: Modal;

    loginForm = this.fb.group({
        email: this.fb.control<string>('lucaschiwang@gmail.com', [
            Validators.email,
            Validators.required,
        ]),
        password: this.fb.control<string>(
            'iasdflk1@sakdjfB',
            Validators.required
        ),
    });

    @ViewChild('loginModal', { static: true })
    loginModal!: ElementRef<HTMLDivElement>;

    constructor(
        private fb: NonNullableFormBuilder,
        private authService: AuthenticationService
    ) {
        this.modal;
    }

    ngOnInit(): void {
        this.modal = new Modal(this.loginModal.nativeElement);
        this.loginModal.nativeElement.addEventListener(
            'hidden.bs.modal',
            () => {
                this.errorSubject.next('');
            }
        );
    }

    openModal() {
        this.modal?.show();
    }

    closeModal() {
        this.modal?.hide();
        this.loginForm.reset();
    }

    onSubmit() {
        this.authService
            .loginWithAuth(
                this.loginForm.value.email!,
                this.loginForm.value.password!
            )
            .then(() => this.modal?.hide())
            .catch((reason) => {
                // TODO this needs to be improved.
                this.errorSubject.next('Please check your email/password');
            });
    }

    get email() {
        return this.loginForm.controls['email'] as FormControl;
    }

    get password() {
        return this.loginForm.controls['password'] as FormControl;
    }
}
