import mongoose, { Document } from 'mongoose';
import { Resource } from '@/types';
export interface ResourceDocument extends Resource, Document {
}
export declare const ResourceModel: mongoose.Model<ResourceDocument, {}, {}, {}, mongoose.Document<unknown, {}, ResourceDocument, {}> & ResourceDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Resource.d.ts.map