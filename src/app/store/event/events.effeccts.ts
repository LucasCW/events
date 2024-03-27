import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { EventData } from '../../core/models/event';
import { EventsService } from '../../core/services/event.service';
import {
    createEvent,
    fetchEvents,
    loadEvents,
    rsvp,
    saveEvent,
    unrsvp,
    updateEvent,
    updateEventStore,
    addRSVP,
    removeRSVP,
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

    rsvpEvent = createEffect(() => {
        return this.actions$.pipe(
            ofType(rsvp),
            switchMap((action) => {
                return from(
                    this.eventsService.rsvp(
                        action.payload.user,
                        action.payload.event
                    )
                ).pipe(
                    tap((res) => {
                        console.log(res);
                    }),
                    map((res) =>
                        addRSVP({
                            payload: {
                                user: action.payload.user,
                                event: action.payload.event,
                                key: res.key!,
                            },
                        })
                    )
                );
            })
        );
    });

    unrsvpEvent = createEffect(() => {
        return this.actions$.pipe(
            ofType(unrsvp),
            switchMap((action) => {
                return from(
                    this.eventsService.unrsvp(
                        action.payload.key,
                        action.payload.event
                    )
                ).pipe(
                    tap((res) => {
                        console.log(res);
                    }),
                    map(() =>
                        removeRSVP({
                            payload: {
                                key: action.payload.key,
                                event: action.payload.event,
                            },
                        })
                    )
                );
            })
        );
    });

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
                                        response[key].owner,
                                        response[key].rsvp,
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
