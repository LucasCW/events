import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    Inject,
    OnInit,
    PLATFORM_ID,
    ViewChild,
} from '@angular/core';
import {
    FormControl,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    faPlus,
    faSignOut,
    faUserLarge,
} from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Modal } from 'bootstrap';
import { first, map } from 'rxjs';
import { State as AppState } from '../../app/store/index';
import { AuthenticationService } from '../core/services/authentication.service';
import { LoginStart, Logout, Reset } from '../store/auth/auth.actions';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, FontAwesomeModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    providers: [AuthenticationService],
})
export class LoginComponent implements OnInit, AfterViewInit {
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

    private modal?: Modal;

    faUserLarge = faUserLarge;
    faSignOut = faSignOut;
    faPlus = faPlus;

    errors$ = this.store.select('auth', 'error');
    isLoggedIn$ = this.store.select('auth', 'isLoggedIn');

    @ViewChild('loginModal', { static: true }) loginModal!: ElementRef;
    isBrowser: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private store: Store<AppState>,
        private fb: NonNullableFormBuilder
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    ngAfterViewInit(): void {
        this.isLoggedIn$
            .pipe(
                first(),
                map((isLoggedIn: boolean) => {
                    if (!isLoggedIn) this.modal?.show();
                })
            )
            .subscribe();
    }

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

    logout() {
        this.store.dispatch(Logout());
    }
}
