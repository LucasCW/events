import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    faPlus,
    faSignOut,
    faUserLarge,
} from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { first, map } from 'rxjs';
import { State as AppState } from '../app/store/index';
import { User } from './core/models/user';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthenticateSuccess, Logout } from './store/auth/auth.actions';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        GoogleMapsModule,
        SidebarComponent,
        LoginComponent,
        CommonModule,
        FontAwesomeModule,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild(LoginComponent)
    private loginCmp!: LoginComponent;

    openModal() {
        this.loginCmp.openModal();
    }
    addEvent() {
        throw new Error('Method not implemented.');
    }
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
    }

    options: google.maps.MapOptions = {
        mapTypeId: 'roadmap',
        zoomControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        maxZoom: 15,
        minZoom: 8,
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
    }

    zoomIn() {
        if (this.zoom < this.options.maxZoom!) this.zoom++;
    }

    zoomOut() {
        if (this.zoom > this.options.minZoom!) this.zoom--;
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

    initGoogle() {
        if (google) {
            new google.maps.places.Autocomplete(
                this.autocomplete.nativeElement
            );
        }
    }

    logout() {
        this.store.dispatch(Logout());
    }
}
