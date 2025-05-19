export interface RewardStrategy {
    type: string;
    give(userId: string, payload: any): Promise<void>;
}
