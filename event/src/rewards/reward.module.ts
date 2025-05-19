import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from './reward.schema';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { StrategyModule } from '../strategies/strategy.module';
import {
    RewardClaimLog,
    RewardClaimLogSchema,
} from './reward-claim-log.schema';
import { EventSchema } from '../events/event.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Reward.name, schema: RewardSchema },
            { name: Event.name, schema: EventSchema },
            { name: RewardClaimLog.name, schema: RewardClaimLogSchema },
        ]),
        StrategyModule,
    ],
    exports: [RewardService],
    controllers: [RewardController],
    providers: [RewardService],
})
export class RewardModule {}
