import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './auth/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { ProxyService } from './proxy/proxy.service';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
    controllers: [AppController], // ✅ 반드시 필요
    providers: [
        JwtStrategy,
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
        ProxyService,
    ],
})
export class AppModule {}
