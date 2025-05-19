import { Injectable } from '@nestjs/common';
import { RewardStrategy } from '../interfaces/reward-strategy.interface';

@Injectable()
export class RewardStrategyRegistry {
    private strategies = new Map<string, RewardStrategy>();

    register(strategy: RewardStrategy) {
        this.strategies.set(strategy.type, strategy);
    }

    get(type: string): RewardStrategy {
        const strategy = this.strategies.get(type);
        if (!strategy) {
            throw new Error(`No reward strategy found for type: ${type}`);
        }
        return strategy;
    }
}
