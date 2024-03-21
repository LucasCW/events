import { AsyncPipe } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    inject,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    faPlus,
    faSignOut,
    faUserLarge,
} from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Observable, first, map, startWith } from 'rxjs';
import { EventData } from '../app/core/models/event';
import { State as AppState } from '../app/store/index';
import { User } from './core/models/user';
import { EventsComponent } from './events/events.component';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthenticateSuccess, Logout } from './store/auth/auth.actions';
import { fetchEvents, saveEvent } from './store/event/events.actions';
import { MatDialog } from '@angular/material/dialog';
import { EventDialogComponent } from './event-dialog/event-dialog.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        GoogleMapsModule,
        SidebarComponent,
        LoginComponent,
        FontAwesomeModule,
        EventsComponent,
        AsyncPipe,
        ReactiveFormsModule,
        FormsModule,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit {
    position = { lat: -33.77112988424452, lng: 151.01235799780886 };

    events$ = this.store.select('events', 'events');

    @ViewChild(GoogleMap)
    map!: GoogleMap;

    private matDialog = inject(MatDialog);

    @ViewChild(LoginComponent)
    private loginCmp!: LoginComponent;

    @ViewChild(EventsComponent)
    private eventsCmp!: EventsComponent;

    faUserLarge = faUserLarge;
    faSignOut = faSignOut;
    faPlus = faPlus;

    isLoggedIn$ = this.store.select('auth', 'isLoggedIn');

    title = 'events';

    zoom = 120;
    center: google.maps.LatLngLiteral = { lat: 1, lng: 1 };

    @ViewChild('autocomplete') autocomplete!: ElementRef;

    ngAfterViewInit(): void {
        this.isLoggedIn$
            .pipe(
                first(),
                map((isLoggedIn: boolean) => {
                    if (!isLoggedIn) this.loginCmp.openModal();
                })
            )
            .subscribe();

        this.map.mapDblclick.subscribe((event: google.maps.MapMouseEvent) => {
            // console.log('dbClick', event);
            // console.log('latLng', event.latLng?.lat(), event.latLng?.lng());
            if (event.latLng) {
                const eventLatLng = {
                    lat: event.latLng!.lat(),
                    lng: event.latLng!.lng(),
                };
                const newEvent = new EventData('test event', eventLatLng);
                this.store.dispatch(saveEvent({ payload: newEvent }));
            }
        });
    }

    // async addMarker() {
    //     const { AdvancedMarkerElement } = (await google.maps.importLibrary(
    //         'marker'
    //     )) as google.maps.MarkerLibrary;
    //     const marker = new AdvancedMarkerElement({
    //         map: this.map.googleMap,
    //         position: this.position,
    //         title: 'Test',
    //     });
    // }

    mapOptions: google.maps.MapOptions = {
        mapTypeId: 'roadmap',
        zoomControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        maxZoom: 15,
        minZoom: 8,
        mapId: 'DEMO_MAP_ID',
    };

    constructor(private store: Store<AppState>) {
        const savedUser = localStorage.getItem('userData');
        if (savedUser) {
            const userObject = JSON.parse(savedUser) as User;
            this.store.dispatch(AuthenticateSuccess({ payload: userObject }));
        }
    }

    ngOnInit() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    this.center = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                }
            );
        } else {
            console.log("navigator.geolocation doesn't exists");
        }

        this.store.dispatch(fetchEvents());
    }

    zoomIn() {
        if (this.zoom < this.mapOptions.maxZoom!) this.zoom++;
    }

    zoomOut() {
        if (this.zoom > this.mapOptions.minZoom!) this.zoom--;
    }

    currentLocation() {
        (navigator.geolocation as Geolocation).getCurrentPosition(
            (position: GeolocationPosition) => {
                this.center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
            }
        );
    }

    event: google.maps.places.PlaceAutocompletePlaceSelectEvent | undefined;

    googleAutocomplete!: google.maps.places.Autocomplete | undefined;

    getInfo() {
        if (this.googleAutocomplete) {
            console.log('event', this.event?.place);
        }
    }

    initGoogle() {
        if (google) {
            this.googleAutocomplete = new google.maps.places.Autocomplete(
                this.autocomplete.nativeElement
            );
            this.googleAutocomplete.addListener(
                'place_changed',
                (event: any) => {
                    console.log(event);
                    if (this.googleAutocomplete)
                        console.log(this.googleAutocomplete.getPlace());
                }
            );
        }
    }

    onChange(str: any) {
        if (this.googleAutocomplete) {
            console.log(this.googleAutocomplete.getPlace());
        }
    }

    logout() {
        this.store.dispatch(Logout());
    }

    openModal() {
        this.loginCmp.openModal();
    }
    addEvent() {
        console.log('div', this.map.googleMap?.getDiv());
        this.matDialog.open(EventDialogComponent, {
            data: { map: this.map.googleMap?.getDiv().firstElementChild },
            autoFocus: false,
        });
    }
}
