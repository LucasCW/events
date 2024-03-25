import { createAction, props } from '@ngrx/store';
import { EventData } from '../../core/models/event';

export const CREATE_EVENT = '[Event] Create Event';
export const LOAD_EVENTS = '[Event] Load Events';
export const SAVE_EVENT = '[Event] Save Event';
export const FETCH_EVENTS = '[Event] Fetch Events';
export const UPDATE_EVENT = '[Event] Update Event';
export const UPDATE_EVENT_STORE = '[Event] Update Event Store';

export const fetchEvents = createAction(FETCH_EVENTS);

export const loadEvents = createAction(
    LOAD_EVENTS,
    props<{ payload: EventData[] }>()
);

export const createEvent = createAction(
    CREATE_EVENT,
    props<{ payload: EventData }>()
);

export const saveEvent = createAction(
    SAVE_EVENT,
    props<{ payload: EventData }>()
);

export const updateEvent = createAction(
    UPDATE_EVENT,
    props<{ payload: EventData }>()
);

export const updateEventStore = createAction(
    UPDATE_EVENT_STORE,
    props<{ payload: EventData }>()
);
