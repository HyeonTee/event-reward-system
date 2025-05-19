import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './event.schema';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { EventStrategyFactory } from '../strategies/factories/event-strategy.factory';
import { RewardService } from '../rewards/reward.service';
// import { RewardDocument } from '../rewards/reward.schema';

@Injectable()
export class EventService {
    constructor(
        @InjectModel(Event.name)
        private readonly eventModel: Model<EventDocument>,
        // private readonly rewardModel: Model<RewardDocument>,
        private readonly eventStrategyFactory: EventStrategyFactory,
        private readonly rewardService: RewardService,
    ) {}

    async create(dto: CreateEventDto & { creator: string }) {
        const created = await this.eventModel.create(dto);

        const strategy = this.eventStrategyFactory.getStrategy(dto.eventType);
        const passed = await strategy.validate(dto.config, dto.creator);

        if (passed) {
            await this.rewardService.create({
                eventId: created._id.toString(),
                rewardType: dto.config.rewardType,
                recipientId: dto.creator,
                payload: dto.config.payload,
            });
        }

        return {
            event: created,
            rewardGranted: passed,
        };
    }

    async findAll() {
        return this.eventModel.find().sort({ createdAt: -1 }).lean();
    }

    // async findClaimableEvents(userId: string) {
    //     const now = new Date();
    //
    //     const allEvents = await this.eventModel
    //         .find({
    //             startDate: { $lte: now },
    //             endDate: { $gte: now },
    //         })
    //         .lean();
    //
    //     const rewards = await this.rewardModel
    //         .find({ recipientId: userId })
    //         .lean();
    //     const claimedEventIds = new Set(
    //         rewards.map((r) => r.eventId.toString()),
    //     );
    //
    //     const claimable: any[] = [];
    //
    //     for (const event of allEvents) {
    //         if (claimedEventIds.has(event._id.toString())) continue;
    //
    //         const strategy = this.eventStrategyFactory.getStrategy(
    //             event.eventType,
    //         );
    //         const passed = await strategy.validate(event.config, userId);
    //
    //         if (passed) {
    //             claimable.push(event);
    //         }
    //     }
    //
    //     return claimable;
    // }
}
