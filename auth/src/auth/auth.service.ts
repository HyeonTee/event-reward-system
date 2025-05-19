// src/auth/auth.service.ts
import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/user.schema';
import { LoginHistory, LoginHistoryDocument } from './login-history.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(LoginHistory.name)
        private loginHistoryModel: Model<LoginHistoryDocument>,
        private jwtService: JwtService,
    ) {}

    async register(username: string, password: string, role: string) {
        if (role !== 'USER') {
            throw new ForbiddenException(
                'Only USER role is allowed to register',
            );
        }

        const existing = await this.userModel.findOne({ username });
        if (existing) {
            throw new ConflictException('Username already exists');
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = new this.userModel({ username, password: hashed, role });
        return user.save();
    }

    async login(username: string, password: string) {
        const user = await this.userModel.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        await this.loginHistoryModel.create({ userId: user._id.toString() });

        const payload = {
            sub: user._id.toString(),
            username: user.username,
            role: user.role,
        };

        return { access_token: this.jwtService.sign(payload) };
    }

    async getLoginHistory(userId: string) {
        return this.loginHistoryModel
            .find({ userId })
            .sort({ loginDate: -1 })
            .lean();
    }
}
