import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async findWithItems(userId: string) {
        const user = await this.userModel
            .findById(userId)
            .select('-password')
            .lean();
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async addItem(userId: string, item: { name: string; quantity: number }) {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('User not found');

        const existingItem = user.items.find((i) => i.name === item.name);

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            user.items.push({ name: item.name, quantity: item.quantity });
        }

        await user.save();
        return { message: 'Item updated successfully', items: user.items };
    }
}
