import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reward, RewardDocument } from './reward.schema';
import { Model } from 'mongoose';
import { CreateRewardDto } from './dto/create-reward.dto';
import { RewardStrategyFactory } from '../strategies/factories/reward-strategy.factory';
import { Event, EventDocument } from '../events/event.schema';
import {
    RewardClaimLog,
    RewardClaimLogDocument,
} from './reward-claim-log.schema';
import { EventStrategyFactory } from '../strategies/factories/event-strategy.factory';

@Injectable()
export class RewardService {
    constructor(
        @InjectModel(Reward.name)
        private rewardModel: Model<RewardDocument>,

        @InjectModel(Event.name)
        private eventModel: Model<EventDocument>,

        @InjectModel(RewardClaimLog.name)
        private claimLogModel: Model<RewardClaimLogDocument>,

        private readonly rewardStrategyFactory: RewardStrategyFactory,
        private readonly eventStrategyFactory: EventStrategyFactory,
    ) {}

    async create(dto: CreateRewardDto) {
        const created = await this.rewardModel.create({
            ...dto,
            granted: false,
        });

        const strategy = this.rewardStrategyFactory.getStrategy(dto.rewardType);
        await strategy.give(dto.recipientId, dto.payload);

        created.granted = true;
        created.grantedAt = new Date();
        await created.save();

        return created;
    }

    async findAll() {
        return this.rewardModel.find().sort({ createdAt: -1 }).lean();
    }

    async findByRecipient(recipientId: string) {
        return this.rewardModel
            .find({ recipientId })
            .sort({ createdAt: -1 })
            .lean();
    }

    async claim(eventId: string, userId: string) {
        const exists = await this.rewardModel.findOne({
            eventId,
            recipientId: userId,
        });
        if (exists) {
            await this.claimLogModel.create({
                eventId,
                userId,
                success: false,
                message: 'Already claimed',
            });
            throw new Error('Reward already claimed');
        }

        const event = await this.eventModel.findById(eventId);
        if (!event) {
            await this.claimLogModel.create({
                eventId,
                userId,
                success: false,
                message: 'Event not found',
            });
            throw new Error('Event not found');
        }

        const strategy = this.eventStrategyFactory.getStrategy(event.eventType);
        const passed = await strategy.validate(event.config, userId);

        if (!passed) {
            await this.claimLogModel.create({
                eventId,
                userId,
                success: false,
                message: 'Condition not met',
            });
            throw new Error('Event conditions not satisfied');
        }

        const reward = await this.create({
            eventId,
            rewardType: event.config.rewardType,
            recipientId: userId,
            payload: event.config.payload,
        });

        await this.claimLogModel.create({ eventId, userId, success: true });

        return reward;
    }
}
