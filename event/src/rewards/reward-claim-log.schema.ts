import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardClaimLogDocument = RewardClaimLog & Document;

@Schema({ timestamps: true })
export class RewardClaimLog {
    @Prop({ required: true })
    eventId: string;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    success: boolean;

    @Prop()
    message?: string;
}

export const RewardClaimLogSchema =
    SchemaFactory.createForClass(RewardClaimLog);
