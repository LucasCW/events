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

    updateEvent(event: EventData) {
        if (event.id) {
            const body: { [key: string]: EventData } = {};
            const { id, ...eventWithNoId } = event;

            body[id] = eventWithNoId;

            debugger;
            return this.http.patch<EventData>(this._eventsUrl, body);
        } else {
            throw new Error("Event ID shouldn't be undefined here!");
        }
    }
}
