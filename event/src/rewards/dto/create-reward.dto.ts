import { IsString, IsObject } from 'class-validator';

export class CreateRewardDto {
    @IsString()
    eventId: string;

    @IsString()
    rewardType: string;

    @IsString()
    recipientId: string;

    @IsObject()
    payload: Record<string, any>;
}
