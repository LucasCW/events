import { AsyncPipe, JsonPipe } from '@angular/common';
import {
    AfterViewInit,
    Component,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    MatAutocomplete,
    MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import {
    BehaviorSubject,
    debounceTime,
    filter,
    first,
    from,
    map,
    startWith,
} from 'rxjs';
import { EventData } from '../core/models/event';
import { saveEvent, updateEvent } from '../store/event/events.actions';
import { State as AppState } from '../store/index';
import { Auth } from '@angular/fire/auth';

interface PlaceResult {
    placeId?: string;
    formattedAddress?: string;
    position?: google.maps.LatLngLiteral | google.maps.LatLng;
}
@Component({
    selector: 'app-event-dialog',
    standalone: true,
    imports: [
        MatAutocompleteModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDatepickerModule,
        AsyncPipe,
        JsonPipe,
        MatCheckboxModule,
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './event-dialog.component.html',
    styleUrl: './event-dialog.component.css',
})
export class EventDialogComponent implements OnInit, AfterViewInit {
    isEditMode = false;
    isCreateMode = false;
    isViewMode = false;

    form = this.fb.group({
        address: this.fb.control<PlaceResult | null>(null, {
            validators: [Validators.required],
        }),
        isMultipleDate: false,
        range: this.fb.group({
            start: this.fb.control<Date | null>(null),
            end: this.fb.control<Date | null>(null),
        }),
        date: this.fb.control<Date | null>(null, {
            validators: [Validators.required],
        }),
        title: ['Home Party', Validators.required],
    });

    @ViewChild(MatAutocomplete)
    addressAutocomplete!: MatAutocomplete;

    searchResult = new BehaviorSubject<PlaceResult[]>([]);

    searchResultObs = this.searchResult.asObservable().pipe(debounceTime(200));

    toggleMultipleDate(checked: boolean) {
        checked
            ? this.form.controls.date.reset()
            : this.form.controls.range.reset();
    }

    constructor(
        public dialogRef: MatDialogRef<EventDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: { event: EventData },
        private fb: FormBuilder,
        private store: Store<AppState>,
        private auth: Auth
    ) {
        this.isEditMode = !!(
            this.data.event &&
            this.auth.currentUser &&
            this.data.event.owner.id == this.auth.currentUser.uid
        );

        this.isCreateMode = !this.data.event;

        this.isViewMode = !this.isCreateMode && !this.isEditMode;

        console.log(this.isEditMode, this.isCreateMode, this.isViewMode);
    }

    get address() {
        return this.form.controls.address as FormControl;
    }

    get title() {
        return this.form.controls.title as FormControl;
    }

    get range() {
        return this.form.controls.range as FormGroup;
    }

    ngOnInit(): void {
        console.log('Event', this.data.event);
        if (this.data.event) {
            this.form.setValue({
                address: this.data.event,
                isMultipleDate: !!this.data.event.range,
                range: {
                    start: this.data.event.range?.start ?? null,
                    end: this.data.event.range?.end ?? null,
                },
                date: this.data.event.date ?? null,
                title: this.data.event.title,
            });
        }

        startWith(''),
            this.address.valueChanges
                .pipe(
                    debounceTime(2000),
                    filter((value) => typeof value === 'string'),
                    map((value: string) => {
                        this.search(value || 'a');
                    })
                )
                .subscribe();

        this.searchResultObs.subscribe((event) =>
            console.log('emitting:', event.length)
        );
    }

    ngAfterViewInit(): void {
        this.addressAutocomplete.optionSelected.subscribe({
            next: (selected: any) => {
                console.log(selected);
            },
        });
    }

    displayFn(placeResult: PlaceResult | string): string {
        if (typeof placeResult === 'string' && placeResult != undefined) {
            return placeResult;
        }
        return placeResult && placeResult.formattedAddress
            ? placeResult.formattedAddress
            : '';
    }

    async search(value: string) {
        console.log('searching:', value);
        if (value == '') return;

        const { AutocompleteService, PlacesService } =
            (await google.maps.importLibrary(
                'places'
            )) as google.maps.PlacesLibrary;

        const autoCompleteService = new AutocompleteService();

        // The dynamically created div is fed to PlacesService to bypass the Google
        // attribution change which somehow removes the map from UI completely.
        // However, when google map is initialised dynamically instead of using
        // <google-map> from angular google map component, this won't be necessary.
        const placesService = new PlacesService(document.createElement('div'));

        from(
            autoCompleteService.getPlacePredictions({
                input: value,
            })
        )
            .pipe(
                first(),
                map((res) => {
                    let results: PlaceResult[] = [];

                    for (const predict of res.predictions) {
                        placesService.getDetails(
                            {
                                placeId: predict.place_id,
                                fields: [
                                    'name',
                                    'formatted_address',
                                    'place_id',
                                    'geometry',
                                ],
                            },
                            (place, status) => {
                                if (
                                    status ==
                                        google.maps.places.PlacesServiceStatus
                                            .OK &&
                                    place
                                ) {
                                    const newPlace = {
                                        placeId: place.place_id,
                                        formattedAddress:
                                            place.formatted_address,
                                        position: place.geometry?.location,
                                    };
                                    results = results.concat(newPlace);
                                    this.searchResult.next(results);
                                }
                            }
                        );
                    }
                })
            )
            .subscribe();
    }

    submit() {
        // Is there an elegant way to do this?
        // Error handling logic needed.

        console.log('Form Value Submitted:', this.form.value);

        let event: EventData | null = null;
        if (
            this.form.value.title &&
            this.form.value.address &&
            typeof this.form.value.address !== 'string'
        ) {
            if (this.form.value.address && this.form.value.address.position) {
                event = new EventData(
                    this.form.value.title,
                    {
                        id: this.auth.currentUser!.uid,
                        email: this.auth.currentUser!.email!,
                    },
                    this.form.value.address.position,
                    this.form.value.address.formattedAddress ?? ''
                );
                if (this.form.value.date) {
                    event.date = this.form.value.date;
                } else {
                    event.range = {
                        start: this.form.value.range!.start!,
                        end: this.form.value.range!.end!,
                    };
                }

                if (this.isEditMode) {
                    event.id = this.data.event.id;
                }
            }
        }

        if (event) {
            if (this.isEditMode) {
                this.store.dispatch(updateEvent({ payload: event }));
            } else {
                this.store.dispatch(saveEvent({ payload: event }));
            }
        }

        this.form.reset();
        this.dialogRef.close();
    }

    close() {
        this.form.reset();
        this.dialogRef.close();
    }
}
