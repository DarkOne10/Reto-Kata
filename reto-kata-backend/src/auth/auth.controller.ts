import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { CookieOptions, Response } from 'express';
import { AuthGuard } from './auth.guard.js';
import type { AuthenticatedRequest } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

const COOKIE_NAME = 'reto_session';
const SESSION_MAX_AGE = 8 * 60 * 60 * 1000;

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Crea una cuenta de postulante' })
  @ApiBody({ type: RegisterDto })
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const name = this.requiredText(body?.name, 'El nombre');
    const email = this.validateEmail(body?.email);
    const password = this.validatePassword(body?.password);
    const result = await this.authService.register({ name, email, password });
    response.cookie(COOKIE_NAME, result.token, this.cookieOptions());
    return result.user;
  }

  @Post('login')
  @ApiOperation({ summary: 'Inicia sesión' })
  @ApiBody({ type: LoginDto })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const email = this.validateEmail(body?.email);
    if (typeof body?.password !== 'string' || !body.password) {
      throw new BadRequestException('La contraseña es obligatoria.');
    }
    const result = await this.authService.login(email, body.password);
    response.cookie(COOKIE_NAME, result.token, this.cookieOptions());
    return result.user;
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Consulta la sesión actual' })
  me(@Req() request: AuthenticatedRequest) {
    return request.user;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Cierra la sesión actual' })
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(COOKIE_NAME, this.cookieOptions());
    return { success: true };
  }

  private requiredText(value: unknown, label: string) {
    if (typeof value !== 'string' || value.trim().length < 2) {
      throw new BadRequestException(`${label} es obligatorio.`);
    }
    if (value.trim().length > 120) {
      throw new BadRequestException(`${label} no puede superar 120 caracteres.`);
    }
    return value.trim();
  }

  private validateEmail(value: unknown) {
    if (
      typeof value !== 'string' ||
      value.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ) {
      throw new BadRequestException('Ingresa un correo válido.');
    }
    return value.trim().toLowerCase();
  }

  private validatePassword(value: unknown) {
    if (
      typeof value !== 'string' ||
      value.length < 10 ||
      Buffer.byteLength(value, 'utf8') > 72
    ) {
      throw new BadRequestException(
        'La contraseña debe tener entre 10 y 72 bytes.',
      );
    }
    return value;
  }

  private cookieOptions(): CookieOptions {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    };
  }
}