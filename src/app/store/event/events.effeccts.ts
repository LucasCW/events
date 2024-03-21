import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs/operators';
import { EventData } from '../../core/models/event';
import { EventsService } from '../../core/services/marker.service';
import {
    createEvent,
    fetchEvents,
    loadEvents,
    saveEvent,
} from './events.actions';

@Injectable()
export class EventsEffect {
    constructor(
        private eventsService: EventsService,
        private actions$: Actions
    ) {}

    createEvent = createEffect(() =>
        this.actions$.pipe(
            ofType(saveEvent),
            switchMap((action) => {
                return this.eventsService.addEvent(action.payload).pipe(
                    tap((response) => {
                        console.log(response);
                    }),
                    map((response) => {
                        return createEvent({
                            payload: { ...action.payload, id: response.name },
                        });
                    })
                );
            })
        )
    );

    fetchEvents = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchEvents),
            switchMap(() => {
                return this.eventsService.getEvents().pipe(
                    tap((response) => {
                        console.log(response);
                    }),
                    map((response) => {
                        const eventArray: EventData[] = [];
                        for (const key in response) {
                            if (response.hasOwnProperty(key)) {
                                eventArray.push(
                                    new EventData(
                                        response[key].name,
                                        response[key].position,
                                        key
                                    )
                                );
                            }
                        }
                        return loadEvents({ payload: eventArray });
                    })
                );
            })
        )
    );
}
