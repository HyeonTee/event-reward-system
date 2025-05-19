import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventStrategy } from '../interfaces/event-strategy.interface';
import { EventStrategyRegistry } from '../registries/event-strategy.registry';
import { SevenDayLoginStrategy } from '../implementations/seven-day-login.strategy';
import { ItemConditionStrategy } from '../implementations/item-condition.strategy';

@Injectable()
export class EventStrategyFactory implements OnModuleInit {
    constructor(
        private readonly registry: EventStrategyRegistry,
        private readonly sevenDayLogin: SevenDayLoginStrategy,
        private readonly itemCondition: ItemConditionStrategy,
    ) {}

    onModuleInit() {
        this.registry.register(this.sevenDayLogin);
        this.registry.register(this.itemCondition);
    }

    getStrategy(type: string): EventStrategy {
        return this.registry.get(type);
    }
}
