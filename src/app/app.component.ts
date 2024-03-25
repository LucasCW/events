import { AsyncPipe } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren,
    inject,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    GoogleMap,
    GoogleMapsModule,
    MapAdvancedMarker,
} from '@angular/google-maps';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    faPlus,
    faSignOut,
    faUserLarge,
} from '@fortawesome/free-solid-svg-icons';
import { Store, select } from '@ngrx/store';
import { first, map } from 'rxjs';
import { EventData } from '../app/core/models/event';
import { State as AppState } from '../app/store/index';
import { User } from './core/models/user';
import { EventDialogComponent } from './event-dialog/event-dialog.component';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthenticateSuccess, Logout } from './store/auth/auth.actions';
import * as fromAuthSelector from './store/auth/auth.selectors';
import { fetchEvents } from './store/event/events.actions';
import { eventsSelector } from './store/event/events.selectors';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        GoogleMapsModule,
        SidebarComponent,
        LoginComponent,
        FontAwesomeModule,
        AsyncPipe,
        ReactiveFormsModule,
        FormsModule,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit {
    events$ = this.store.select(eventsSelector);

    @ViewChild(GoogleMap)
    map!: GoogleMap;

    @ViewChildren(MapAdvancedMarker)
    private advancedMapMarkers?: QueryList<MapAdvancedMarker>;

    private matDialog = inject(MatDialog);

    @ViewChild(LoginComponent)
    private loginCmp!: LoginComponent;

    faUserLarge = faUserLarge;
    faSignOut = faSignOut;
    faPlus = faPlus;

    isLoggedIn$ = this.store.select(fromAuthSelector.isLoggedInSelector);

    title = 'events';

    zoom = 120;
    center: google.maps.LatLngLiteral = { lat: 1, lng: 1 };

    @ViewChild('autocomplete') autocomplete!: ElementRef;

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
                // TODO
                // const newEvent = new EventData('test event', eventLatLng);
                // this.store.dispatch(saveEvent({ payload: newEvent }));
            }
        });
        this.map.mapClick.subscribe((event) => {
            console.log('map click:', event);
        });
    }

    onMarkerClick(event: any) {
        console.log(event);
    }

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

    onMarkerClicked(event: EventData) {
        console.log(event);
        this.matDialog.open(EventDialogComponent, { data: { event: event } });
    }
}
