import { Injectable, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ProxyService {
    constructor(
        private readonly http: HttpService,
        private readonly config: ConfigService,
    ) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const { service, subPath, baseUrl } = this.extractRoute(req);
        const isPublic = this.isPublicRoute(service, subPath);

        if (!baseUrl) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json({ message: 'Invalid service name' });
        }

        const headers: Record<string, string> = {
            'Content-Type': req.headers['content-type'] || 'application/json',
            Authorization: req.headers.authorization || '',
        };

        if (!isPublic) {
            const token = this.getToken(req);
            try {
                const payload = this.verifyToken(token);
                this.checkAccess(service, subPath, req.method, payload.role);

                headers['X-User-Id'] = payload.sub;
                headers['X-User-Role'] = payload.role;
            } catch (err) {
                return res
                    .status(HttpStatus.UNAUTHORIZED)
                    .json({ message: err.message });
            }
        }

        const targetUrl = `${baseUrl.replace(/\/$/, '')}/${subPath.replace(/^\//, '')}`;

        try {
            const response = await firstValueFrom(
                this.http.request({
                    method: req.method,
                    url: targetUrl,
                    data: req.body,
                    headers,
                    params: req.query,
                }),
            );
            return res.status(response.status).send(response.data);
        } catch (err) {
            console.error('[Gateway Error]', err);
            const status = err.response?.status || 500;
            const data = err.response?.data || { message: 'Gateway Error' };
            return res.status(status).send(data);
        }
    }

    private extractRoute(req: Request) {
        const pathParts = req.path.split('/');
        const service = pathParts[2];
        const subPath = pathParts.slice(3).join('/');
        const baseUrl = {
            auth: this.config.get<string>('AUTH_SERVER_URL'),
            event: this.config.get<string>('EVENT_SERVER_URL'),
        }[service];

        return { service, subPath, baseUrl };
    }

    private isPublicRoute(service: string, subPath: string): boolean {
        return service === 'auth' && ['login', 'register'].includes(subPath);
    }

    private getToken(req: Request): string {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new Error('Missing token');
        const token = authHeader.split(' ')[1];
        if (!token) throw new Error('Invalid token format');
        return token;
    }

    private verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.config.get<string>('JWT_SECRET'));
        } catch {
            throw new Error('Invalid token');
        }
    }

    private checkAccess(
        service: string,
        subPath: string,
        method: string,
        role: string,
    ): void {
        const allowedRoles = ['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'];
        if (!allowedRoles.includes(role)) {
            throw new Error('Unauthorized role');
        }

        if (service === 'event' && !subPath && method === 'POST') {
            if (!['OPERATOR', 'ADMIN'].includes(role)) {
                throw new Error('Only operators can create events');
            }
        }

        if (service === 'event' && subPath === 'reward' && method === 'POST') {
            if (!['OPERATOR', 'ADMIN'].includes(role)) {
                throw new Error('Only operators can register rewards');
            }
        }

        if (subPath === 'reward/history' && method === 'GET') {
            if (!['AUDITOR', 'ADMIN'].includes(role)) {
                throw new Error('Only auditors can view reward history');
            }
        }
    }
}
