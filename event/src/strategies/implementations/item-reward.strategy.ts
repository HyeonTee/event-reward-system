import { Injectable } from '@nestjs/common';
import { RewardStrategy } from '../interfaces/reward-strategy.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ItemRewardStrategy implements RewardStrategy {
    readonly type = 'ITEM';

    constructor(private readonly http: HttpService) {}

    async give(userId: string, payload: { name: string; quantity: number }) {
        const url = `http://auth:3001/user/add-item`;
        await firstValueFrom(
            this.http.post(url, {
                userId,
                item: {
                    name: payload.name,
                    quantity: payload.quantity,
                },
            }),
        );
    }
}
