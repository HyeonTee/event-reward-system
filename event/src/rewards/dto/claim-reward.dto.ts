import { IsString } from 'class-validator';

export class ClaimRewardDto {
    @IsString()
    eventId: string;
}
