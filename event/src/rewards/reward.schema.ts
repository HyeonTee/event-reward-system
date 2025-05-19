import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardDocument = Reward & Document;

@Schema({ timestamps: true })
export class Reward {
    @Prop({ required: true })
    eventId: string;

    @Prop({ required: true })
    rewardType: string;

    @Prop({ required: true })
    recipientId: string;

    @Prop({ type: Object })
    payload: Record<string, any>;

    @Prop({ default: false })
    granted: boolean;

    @Prop()
    grantedAt: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
