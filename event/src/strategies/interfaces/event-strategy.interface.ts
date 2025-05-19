export interface EventStrategy {
    type: string;
    validate(config: any, userId: string): Promise<boolean>;
}
