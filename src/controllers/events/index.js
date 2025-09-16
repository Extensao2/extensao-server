import { getAllEvents } from './get-all.js';
import { createEvent } from './create.js';
import { getEventById } from './get-by-id.js';
import { updateEvent } from './update.js';
import { deleteEvent } from './delete.js';

export { getAllEvents, createEvent, getEventById, updateEvent, deleteEvent };

export const eventController = {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent
};
