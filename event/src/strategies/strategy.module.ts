import { Module, OnModuleInit } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EventStrategyRegistry } from './registries/event-strategy.registry';
import { RewardStrategyRegistry } from './registries/reward-strategy.registry';
import { EventStrategyFactory } from './factories/event-strategy.factory';
import { RewardStrategyFactory } from './factories/reward-strategy.factory';
import { SevenDayLoginStrategy } from './implementations/seven-day-login.strategy';
import { ItemRewardStrategy } from './implementations/item-reward.strategy';
import { ItemConditionStrategy } from './implementations/item-condition.strategy';

@Module({
    imports: [HttpModule],
    providers: [
        SevenDayLoginStrategy,
        ItemRewardStrategy,
        ItemConditionStrategy,
        EventStrategyRegistry,
        RewardStrategyRegistry,
        EventStrategyFactory,
        RewardStrategyFactory,
    ],
    exports: [EventStrategyFactory, RewardStrategyFactory],
})
export class StrategyModule implements OnModuleInit {
    constructor(
        private readonly eventRegistry: EventStrategyRegistry,
        private readonly rewardRegistry: RewardStrategyRegistry,
        private readonly sevenDayLogin: SevenDayLoginStrategy,
        private readonly itemCondition: ItemConditionStrategy,
    ) {}

    onModuleInit() {
        this.eventRegistry.register(this.sevenDayLogin);
        this.eventRegistry.register(this.itemCondition);
    }
}
