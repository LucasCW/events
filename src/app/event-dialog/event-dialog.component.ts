import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
    MatDialog,
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose,
    MAT_DIALOG_DATA,
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
    first,
    from,
    map,
    of,
    pipe,
    startWith,
} from 'rxjs';
import { stat } from 'fs';

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
export class EventDialogComponent implements OnInit {
    searchResult = new BehaviorSubject<google.maps.places.PlaceResult[]>([]);

    locationControl = new FormControl('');

    searchResultObs = this.searchResult.asObservable();
    filteredLocations!: Observable<string[]>;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: { map: HTMLDivElement }
    ) {}

    ngOnInit(): void {
        console.log(this.locationControl);
        startWith(''),
            this.locationControl.valueChanges
                .pipe(
                    debounceTime(2000),
                    map((value) => {
                        this.search(value || 'a');
                    })
                )
                .subscribe();
    }

    async search(value: string) {
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
                    const results: google.maps.places.PlaceResult[] = [];

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
                                    results.push(place);
                                }
                            }
                        );
                    }

                    this.searchResult.next(results);
                })
            )
            .subscribe();
    }
}
