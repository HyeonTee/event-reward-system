import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('me')
    getMe(@Headers('x-user-id') userId: string) {
        return this.userService.findWithItems(userId);
    }

    @Post('add-item')
    async addItem(
        @Body()
        body: {
            userId: string;
            item: { name: string; quantity: number };
        },
    ) {
        return this.userService.addItem(body.userId, body.item);
    }
}
