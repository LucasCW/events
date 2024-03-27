import { createReducer, on } from '@ngrx/store';
import { EventData } from '../../core/models/event';
import {
    createEvent,
    loadEvents,
    updateEventStore,
    addRSVP,
    removeRSVP,
} from './events.actions';
import { stat } from 'fs';

export interface State {
    events: EventData[];
}

const initialState: State = {
    events: [],
};

export const eventsReducer = createReducer(
    initialState,
    on(createEvent, (state, action) => {
        return {
            ...state,
            events: [...state.events, action.payload],
        };
    }),
    on(loadEvents, (state, action) => {
        return {
            ...state,
            events: [...action.payload],
        };
    }),
    on(updateEventStore, (state, action) => {
        const eventsCopy = [...state.events];
        const index = eventsCopy.findIndex(
            (event) => event.id == action.payload.id
        );
        eventsCopy[index] = action.payload;
        return {
            ...state,
            events: eventsCopy,
        };
    }),
    on(addRSVP, (state, action) => {
        const eventsCopy = [...state.events];
        const index = eventsCopy.findIndex(
            (event) => event.id == action.payload.event.id
        );

        const updatedEvent: EventData = {
            ...state.events[index],

            rsvp: {
                ...state.events[index].rsvp,
                [action.payload.key]: {
                    email: action.payload.user.email!,
                    id: action.payload.user.uid,
                },
            },
        };

        eventsCopy[index] = updatedEvent;

        return {
            ...state,
            events: eventsCopy,
        };
    }),
    on(removeRSVP, (state, action) => {
        const eventsCopy = [...state.events];

        const index = eventsCopy.findIndex(
            (event) => event.id == action.payload.event.id
        );

        const updatedRSVP = { ...state.events[index].rsvp };
        delete updatedRSVP[action.payload.key];

        const updatedEvent: EventData = {
            ...state.events[index],

            rsvp: updatedRSVP,
        };
        eventsCopy[index] = updatedEvent;

        return {
            ...state,
            events: eventsCopy,
        };
    })
);
