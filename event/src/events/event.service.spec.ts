import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { getModelToken } from '@nestjs/mongoose';
import { Event } from './event.schema';
import { Reward } from '../rewards/reward.schema';
import { EventStrategyFactory } from '../strategies/factories/event-strategy.factory';
import { RewardService } from '../rewards/reward.service';

describe('EventService', () => {
    let service: EventService;
    let eventModel: any;
    let rewardModel: any;
    let strategyFactory: any;

    beforeEach(async () => {
        const mockEventModel = {
            find: jest.fn().mockReturnThis(),
            lean: jest.fn(),
        };

        const mockRewardModel = {
            find: jest.fn().mockReturnThis(),
            lean: jest.fn(),
        };

        const mockStrategyFactory = {
            getStrategy: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventService,
                {
                    provide: getModelToken(Event.name),
                    useValue: mockEventModel,
                },
                {
                    provide: getModelToken(Reward.name),
                    useValue: mockRewardModel,
                },
                {
                    provide: EventStrategyFactory,
                    useValue: mockStrategyFactory,
                },
                {
                    provide: RewardService,
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<EventService>(EventService);
        eventModel = module.get(getModelToken(Event.name));
        rewardModel = module.get(getModelToken(Reward.name));
        strategyFactory = module.get(EventStrategyFactory);
    });

    it('should return claimable events', async () => {
        const mockEvents = [
            {
                _id: '1',
                eventType: 'SEVEN_DAY_LOGIN',
                config: {},
                startDate: new Date('2020-01-01'),
                endDate: new Date('2099-01-01'),
            },
        ];

        const mockRewards = [{ eventId: '2', recipientId: 'user1' }];

        const strategy = {
            validate: jest.fn().mockResolvedValue(true),
        };

        eventModel.find.mockReturnValue({
            lean: () => Promise.resolve(mockEvents),
        });
        rewardModel.find.mockReturnValue({
            lean: () => Promise.resolve(mockRewards),
        });
        strategyFactory.getStrategy.mockReturnValue(strategy);

        const result = await service.findClaimableEvents('user1');

        expect(result).toHaveLength(1);
        expect(result[0]._id).toBe('1');
        expect(strategy.validate).toHaveBeenCalledWith({}, 'user1');
    });

    it('should filter out already claimed events', async () => {
        const mockEvents = [
            {
                _id: '1',
                eventType: 'SEVEN_DAY_LOGIN',
                config: {},
                startDate: new Date('2020-01-01'),
                endDate: new Date('2099-01-01'),
            },
        ];

        const mockRewards = [{ eventId: '1', recipientId: 'user1' }];

        eventModel.find.mockReturnValue({
            lean: () => Promise.resolve(mockEvents),
        });
        rewardModel.find.mockReturnValue({
            lean: () => Promise.resolve(mockRewards),
        });

        const strategy = {
            validate: jest.fn().mockResolvedValue(true),
        };
        strategyFactory.getStrategy.mockReturnValue(strategy);

        const result = await service.findClaimableEvents('user1');

        expect(result).toHaveLength(0);
    });
});
