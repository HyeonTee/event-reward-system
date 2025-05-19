import { Injectable, OnModuleInit } from '@nestjs/common';
import { RewardStrategyRegistry } from '../registries/reward-strategy.registry';
import { RewardStrategy } from '../interfaces/reward-strategy.interface';
import { ItemRewardStrategy } from '../implementations/item-reward.strategy';

@Injectable()
export class RewardStrategyFactory implements OnModuleInit {
    constructor(
        private readonly registry: RewardStrategyRegistry,
        private readonly itemReward: ItemRewardStrategy,
    ) {}

    onModuleInit() {
        this.registry.register(this.itemReward);
    }

    getStrategy(type: string): RewardStrategy {
        return this.registry.get(type);
    }
}
