import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, enum: ['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'] })
    role: string;

    @Prop({
        type: [{ name: String, quantity: Number }],
        default: [],
    })
    items: { name: string; quantity: number }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
