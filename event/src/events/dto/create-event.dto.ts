import {
    IsString,
    IsObject,
    IsDateString,
    IsOptional,
    IsBoolean,
} from 'class-validator';

export class CreateEventDto {
    @IsString()
    title: string;

    @IsString()
    eventType: string;

    @IsObject()
    config: Record<string, any>;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
