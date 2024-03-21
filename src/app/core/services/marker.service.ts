import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventData } from '../models/event';

@Injectable({ providedIn: 'root' })
export class EventsService {
    private _eventsUrl =
        'https://events-7fd3a-default-rtdb.firebaseio.com/events.json';

    constructor(private http: HttpClient) {}

    addEvent(event: EventData) {
        return this.http.post<{ name: string }>(this._eventsUrl, event);
    }

    getEvents() {
        return this.http.get<{ [key: string]: EventData }>(this._eventsUrl);
    }
}
