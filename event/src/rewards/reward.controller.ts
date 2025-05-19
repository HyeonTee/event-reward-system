import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { ClaimRewardDto } from './dto/claim-reward.dto';

@Controller('reward')
export class RewardController {
    constructor(private readonly rewardService: RewardService) {}

    @Post()
    async create(@Body() dto: CreateRewardDto) {
        return this.rewardService.create(dto);
    }

    @Get('history')
    async findAll(
        @Headers('x-user-role') role: string,
        @Headers('x-user-id') userId: string,
    ) {
        if (role === 'AUDITOR' || role === 'ADMIN') {
            return this.rewardService.findAll();
        }
        return this.rewardService.findByRecipient(userId);
    }

    @Post('claim')
    async claim(
        @Body() dto: ClaimRewardDto,
        @Headers('x-user-id') userId: string,
    ) {
        return this.rewardService.claim(dto.eventId, userId);
    }
}
