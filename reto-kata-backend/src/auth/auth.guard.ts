import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SessionUser } from './auth.types.js';
import { AuthService } from './auth.service.js';

export type AuthenticatedRequest = Request & {
  user?: SessionUser;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.cookies?.reto_session;
    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('Inicia sesión para continuar.');
    }

    request.user = await this.authService.getSessionUser(token);
    return true;
  }
}