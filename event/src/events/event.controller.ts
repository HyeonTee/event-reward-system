import { Controller, Post, Body, Headers, Get } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller()
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Post()
    async create(
        @Body() dto: CreateEventDto,
        @Headers('x-user-id') userId: string,
    ) {
        return this.eventService.create({ ...dto, creator: userId });
    }

    @Get()
    findAll() {
        return this.eventService.findAll();
    }

    // @Get('claimable')
    // async getClaimableEvents(@Headers('x-user-id') userId: string) {
    //     return this.eventService.findClaimableEvents(userId);
    // }
}
