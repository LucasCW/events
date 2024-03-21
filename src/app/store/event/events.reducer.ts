import { createReducer, on } from '@ngrx/store';
import { EventData } from '../../core/models/event';
import { createEvent, loadEvents } from './events.actions';

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
    })
);
