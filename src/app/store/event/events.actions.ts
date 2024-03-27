import { createAction, props } from '@ngrx/store';
import { EventData } from '../../core/models/event';
import { User } from '@angular/fire/auth';

export const CREATE_EVENT = '[Event] Create Event';
export const LOAD_EVENTS = '[Event] Load Events';
export const SAVE_EVENT = '[Event] Save Event';
export const FETCH_EVENTS = '[Event] Fetch Events';
export const UPDATE_EVENT = '[Event] Update Event';
export const UPDATE_EVENT_STORE = '[Event] Update Event Store';
export const RSVP = '[Event] RSVP';
export const UNRSVP = '[Event] UNRSVP';
export const UPDATE_RSVP_STORE = '[Event] Update RSVP Store';
export const REMOVE_RSVP_STORE = '[Event] Remove RSVP Store';

export const fetchEvents = createAction(FETCH_EVENTS);

export const rsvp = createAction(
    RSVP,
    props<{ payload: { user: User; event: EventData } }>()
);

export const unrsvp = createAction(
    UNRSVP,
    props<{ payload: { key: string; event: EventData } }>()
);

export const addRSVP = createAction(
    UPDATE_RSVP_STORE,
    props<{ payload: { user: User; event: EventData; key: string } }>()
);

export const removeRSVP = createAction(
    REMOVE_RSVP_STORE,
    props<{ payload: { event: EventData; key: string } }>()
);

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
