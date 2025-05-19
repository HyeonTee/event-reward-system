import { Injectable } from '@nestjs/common';
import { EventStrategy } from '../interfaces/event-strategy.interface';

@Injectable()
export class EventStrategyRegistry {
    private strategies = new Map<string, EventStrategy>();

    register(strategy: EventStrategy) {
        this.strategies.set(strategy.type, strategy);
    }

    get(type: string): EventStrategy {
        const strategy = this.strategies.get(type);
        if (!strategy) {
            throw new Error(`No event strategy found for type: ${type}`);
        }
        return strategy;
    }
}
