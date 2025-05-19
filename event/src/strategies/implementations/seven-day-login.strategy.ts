import { Injectable } from '@nestjs/common';
import { EventStrategy } from '../interfaces/event-strategy.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SevenDayLoginStrategy implements EventStrategy {
    readonly type = 'SEVEN_DAY_LOGIN';

    constructor(private readonly http: HttpService) {}

    async validate(config: any, userId: string): Promise<boolean> {
        const url = `http://auth:3001/login-history?userId=${userId}`;
        const { data } = await firstValueFrom(this.http.get(url));

        const dates = new Set(
            data.map((entry: any) => new Date(entry.loginDate).toDateString()),
        );

        let count = 0;
        for (let i = 0; i < config.days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            if (dates.has(date.toDateString())) {
                count++;
            } else {
                break;
            }
        }

        return count === config.days;
    }
}
