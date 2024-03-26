import { Injectable } from '@angular/core';
import { Database, get, push, ref, set } from '@angular/fire/database';
import { EventData } from '../models/event';

@Injectable({ providedIn: 'root' })
export class EventsService {
    constructor(private db: Database) {}

    addEvent(event: EventData) {
        return push(ref(this.db, 'events'), JSON.parse(JSON.stringify(event)));
    }

    getEventsDb() {
        return get(ref(this.db, 'events'));
    }

    updateEvent(event: EventData) {
        if (event.id) {
            const { id, ...eventWithNoId } = event;

            return set(
                ref(this.db, 'events/' + id),
                JSON.parse(JSON.stringify(eventWithNoId))
            );
        } else {
            throw new Error("Event ID shouldn't be undefined here!");
        }
    }
}
