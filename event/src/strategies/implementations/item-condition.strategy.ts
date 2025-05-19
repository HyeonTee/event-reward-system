import { Injectable } from '@nestjs/common';
import { EventStrategy } from '../interfaces/event-strategy.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ItemConditionStrategy implements EventStrategy {
    readonly type = 'ITEM_CONDITION';

    constructor(private readonly http: HttpService) {}

    async validate(config: any, userId: string): Promise<boolean> {
        const url = `http://auth:3001/user/me?id=${userId}`;
        const { data } = await firstValueFrom(this.http.get(url));

        const userItems = data.items || [];

        if (!Array.isArray(config.items)) {
            throw new Error('Invalid config: items is not an array');
        }

        return config.items.every(
            (condition: { name: string; quantity: number }) => {
                const owned = userItems.find(
                    (item: any) => item.name === condition.name,
                );
                return owned && owned.quantity >= condition.quantity;
            },
        );
    }
}
