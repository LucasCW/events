import {
    AfterViewInit,
    Component,
    Inject,
    OnInit,
    ViewChild,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {
    MatAutocomplete,
    MatAutocompleteModule,
} from '@angular/material/autocomplete';
import {
    MatDialog,
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose,
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';
import {
    MatFormFieldModule,
    MatFormFieldAppearance,
    MatFormFieldControl,
    MatFormField,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, JsonPipe } from '@angular/common';
import {
    BehaviorSubject,
    Observable,
    Subject,
    bindCallback,
    debounceTime,
    filter,
    first,
    from,
    map,
    of,
    pipe,
    startWith,
} from 'rxjs';
import { stat } from 'fs';
import { State as AppState } from '../store/index';
import { Store } from '@ngrx/store';
import { app } from '../../../server';
import {
    createEvent,
    saveEvent,
    updateEvent,
} from '../store/event/events.actions';
import { EventData } from '../core/models/event';

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
        AsyncPipe,
        JsonPipe,
    ],
    templateUrl: './event-dialog.component.html',
    styleUrl: './event-dialog.component.css',
})
export class EventDialogComponent implements OnInit, AfterViewInit {
    isEditMode = false;
    form = this.fb.group({
        address: this.fb.control<PlaceResult | string>(''),
        title: '',
    });

    @ViewChild(MatAutocomplete)
    addressAutocomplete!: MatAutocomplete;

    searchResult = new BehaviorSubject<PlaceResult[]>([]);

    searchResultObs = this.searchResult.asObservable().pipe(debounceTime(200));

    constructor(
        public dialogRef: MatDialogRef<EventDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: { event: EventData },
        private fb: FormBuilder,
        private store: Store<AppState>
    ) {
        this.isEditMode = this.data.event ? true : false;
    }

    get address() {
        return this.form.controls.address as FormControl;
    }

    get title() {
        return this.form.controls.title as FormControl;
    }

    ngOnInit(): void {
        if (this.data.event) {
            console.log('Pre set data', this.data);

            this.address.setValue(this.data.event);
            this.title.setValue(this.data.event.title);

            console.log(this.form.value);
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

                    // const test = results;

                    // console.log('emitting from map', test.length);
                    // console.log('finished emmting');
                })
            )
            .subscribe();
    }

    submit() {
        // Is there an elegant way to do this?
        // Error handling logic needed.

        console.log('submitted');
        console.log(this.form.value);

        let event: EventData | null = null;
        if (
            this.form.value.title &&
            this.form.value.address &&
            typeof this.form.value.address !== 'string'
        ) {
            if (this.form.value.address && this.form.value.address.position) {
                event = new EventData(
                    this.form.value.title,
                    this.form.value.address.position,
                    this.form.value.address.formattedAddress ?? ''
                );
                if (this.isEditMode) event.id = this.data.event.id;
            }
        }

        if (event) {
            if (this.isEditMode) {
                this.store.dispatch(updateEvent({ payload: event }));
            } else {
                this.store.dispatch(saveEvent({ payload: event }));
            }
        }

        this.dialogRef.close();
    }

    // private buildEventData(): EventData {
    //     if (typeof this.form.value.address === 'string') {
    //         return new EventData(this.form.value.title!, this.form.value.ad);
    //     }

    //     if (
    //         this.form.value.title &&
    //         this.form.value.address &&
    //         typeof this.form.value.address !== 'string'
    //     ) {
    //         if (
    //             this.form.value.address &&
    //             this.form.value.address.geometry &&
    //             this.form.value.address.geometry.location
    //         ) {
    //             const newEvent = new EventData(
    //                 this.form.value.title,
    //                 this.form.value.address!.geometry!.location!,
    //                 this.form.value.address.formatted_address ?? ''
    //             );
    //             return newEvent;
    //         }
    //     }
    // }
}
