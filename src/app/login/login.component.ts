import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
    FormControl,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Modal } from 'bootstrap';
import { State as AppState } from '../../app/store/index';
import { AuthenticationService } from '../core/services/authentication.service';
import { LoginStart, Reset } from '../store/auth/auth.actions';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    providers: [AuthenticationService],
})
export class LoginComponent implements OnInit {
    errors$ = this.store.select('auth', 'error');

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

    @ViewChild('loginModal', { static: true }) loginModal!: ElementRef;

    constructor(
        private store: Store<AppState>,
        private fb: NonNullableFormBuilder
    ) {}

    ngOnInit(): void {
        this.modal = new Modal(this.loginModal.nativeElement);
    }

    openModal() {
        this.modal?.show();
    }

    closeModal() {
        this.modal?.hide();
        this.loginForm.reset();
        this.store.dispatch(Reset());
    }

    onSubmit() {
        this.store.dispatch(
            LoginStart({
                payload: {
                    email: this.loginForm.value.email!,
                    password: this.loginForm.value.password!,
                },
            })
        );

        this.store.select('auth', 'loggedInUser').subscribe({
            next: (result) => {
                if (result) this.modal?.hide();
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    get email() {
        return this.loginForm.controls['email'] as FormControl;
    }

    get password() {
        return this.loginForm.controls['password'] as FormControl;
    }
}
