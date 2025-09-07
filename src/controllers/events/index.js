import * as getAllEvents from './get-all.js';
import * as createEvent from './create.js';
import * as getEventById from './get-by-id.js';
import * as updateEvent from './update.js';
import * as deleteEvent from './delete.js';

export const eventController = {
  ...getAllEvents,
  ...createEvent,
  ...getEventById,
  ...updateEvent,
  ...deleteEvent
};