import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { jwtVerify, SignJWT } from 'jose';
import { PrismaService } from '../prisma/prisma.service.js';
import { SessionUser } from './auth.types.js';

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class AuthService {
  private readonly jwtKey: Uint8Array;

  constructor(private readonly prisma: PrismaService) {
    const secret = process.env.JWT_SECRET;
    if (!secret && process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be configured in production.');
    }
    this.jwtKey = new TextEncoder().encode(
      secret ?? randomBytes(32).toString('base64url'),
    );
  }

  async register(input: { name: string; email: string; password: string }) {
    const passwordHash = await hash(input.password, 12);

    try {
      const user = await this.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash,
          role: UserRole.APPLICANT,
        },
        select: userSelect,
      });

      return { user, token: await this.createToken(user.id) };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya existe una cuenta con ese correo.');
      }
      throw error;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { ...userSelect, passwordHash: true },
    });

    if (!user || !(await compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: await this.createToken(user.id),
    };
  }

  async getSessionUser(token: string): Promise<SessionUser> {
    let userId: number;

    try {
      const { payload } = await jwtVerify(token, this.jwtKey);
      userId = Number(payload.sub);
    } catch {
      throw new UnauthorizedException('La sesión no es válida o expiró.');
    }

    if (!Number.isInteger(userId) || userId < 1) {
      throw new UnauthorizedException('La sesión no es válida o expiró.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });
    if (!user) {
      throw new UnauthorizedException('La sesión no es válida o expiró.');
    }

    return user;
  }

  private createToken(userId: number) {
    return new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(String(userId))
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(this.jwtKey);
  }
}