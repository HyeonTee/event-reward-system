import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './event.schema';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { StrategyModule } from '../strategies/strategy.module';
import { RewardModule } from '../rewards/reward.module';
import { Reward, RewardSchema } from '../rewards/reward.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Event.name, schema: EventSchema },
            { name: Reward.name, schema: RewardSchema },
        ]),
        StrategyModule,
        RewardModule,
    ],
    providers: [EventService],
    controllers: [EventController],
})
export class EventModule {}
