import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy/proxy.service';

@Controller('proxy')
export class AppController {
    constructor(private readonly proxyService: ProxyService) {}

    @All(':service')
    async proxyRoot(@Req() req: Request, @Res() res: Response) {
        return this.proxyService.handle(req, res);
    }

    @All(':service/*')
    async proxySub(@Req() req: Request, @Res() res: Response) {
        return this.proxyService.handle(req, res);
    }
}
