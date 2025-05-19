import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from './events/event.module';
import { ConfigModule } from '@nestjs/config';
import { RewardModule } from './rewards/reward.module';
import { StrategyModule } from './strategies/strategy.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGO_URI),
        EventModule,
        RewardModule,
        StrategyModule,
    ],
})
export class AppModule {}
