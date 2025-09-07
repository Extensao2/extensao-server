import mongoose, { Document } from 'mongoose';
import { Event } from '@/types';
export interface EventDocument extends Event, Document {
}
export declare const EventModel: mongoose.Model<EventDocument, {}, {}, {}, mongoose.Document<unknown, {}, EventDocument, {}> & EventDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Event.d.ts.map