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
    updateEvent,
    updateEventStore,
} from './events.actions';
import { from } from 'rxjs';

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
                return from(this.eventsService.addEvent(action.payload)).pipe(
                    tap((response) => {
                        console.log('createEvent res', response);
                    }),
                    map((response) => {
                        return createEvent({
                            payload: { ...action.payload, id: response.key! },
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
                return from(this.eventsService.getEventsDb()).pipe(
                    map((snapshot) => {
                        return snapshot.val();
                    }),
                    tap((response) => {
                        console.log(response);
                    }),
                    map((response) => {
                        const eventArray: EventData[] = [];
                        for (const key in response) {
                            if (response.hasOwnProperty(key)) {
                                eventArray.push(
                                    new EventData(
                                        response[key].title,
                                        response[key].position,
                                        response[key].formattedAddress,
                                        response[key].date,
                                        response[key].range,
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

    updateEvent = createEffect(() =>
        this.actions$.pipe(
            ofType(updateEvent),
            switchMap((action) => {
                return from(
                    this.eventsService.updateEvent(action.payload)
                ).pipe(
                    tap((res) => {
                        console.log('Update Event res', res);
                    }),
                    map(() => {
                        console.log({ payload: action.payload });
                        return updateEventStore({ payload: action.payload });
                    })
                );
            })
        )
    );
}
