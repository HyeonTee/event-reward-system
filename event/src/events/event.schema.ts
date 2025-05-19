// src/events/event.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    eventType: string;

    @Prop({ type: Object })
    config: Record<string, any>;

    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop({ default: true })
    isActive: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);
