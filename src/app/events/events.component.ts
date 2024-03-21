import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Modal } from 'bootstrap';
import { State as AppState } from '../../app/store/index';

@Component({
    selector: 'app-events',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './events.component.html',
    styleUrl: './events.component.css',
})
export class EventsComponent {
    errors$ = this.store.select('auth', 'error');

    private modal?: Modal;

    eventsForm = this.fb.group({
        email: this.fb.control<string>('lucaschiwang@gmail.com', [
            Validators.email,
            Validators.required,
        ]),
        password: this.fb.control<string>(
            'iasdflk1@sakdjfB',
            Validators.required
        ),
    });

    @ViewChild('eventsModal', { static: true }) eventsModal!: ElementRef;

    constructor(
        private store: Store<AppState>,
        private fb: NonNullableFormBuilder
    ) {}

    ngOnInit(): void {
        this.modal = new Modal(this.eventsModal.nativeElement);
    }

    openModal() {
        this.modal?.show();
    }

    closeModal() {
        this.modal?.hide();
        this.eventsForm.reset();
        // this.store.dispatch(Reset());
    }

    onSubmit() {
        // this.store.dispatch(
        //     LoginStart({
        //         payload: {
        //             email: this.eventsForm.value.email!,
        //             password: this.eventsForm.value.password!,
        //         },
        //     })
        // );
        // this.store.select('auth', 'loggedInUser').subscribe({
        //     next: (result) => {
        //         if (result) this.modal?.hide();
        //     },
        //     error: (error) => {
        //         console.log(error);
        //     },
        // });
    }

    //     get email() {
    //         return this.eventsForm.controls['email'] as FormControl;
    //     }

    //     get password() {
    //         return this.eventsForm.controls['password'] as FormControl;
    //     }
    // }
}
