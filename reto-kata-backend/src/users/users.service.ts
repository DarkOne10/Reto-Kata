import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: publicUserSelect,
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateRole(id: number, role: UserRole) {
    if (role === UserRole.ADMIN) {
      throw new BadRequestException('El rol ADMIN no se puede asignar desde aquí.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });
    if (!user) {
      throw new NotFoundException('No se encontró el usuario.');
    }
    if (user.role === UserRole.ADMIN) {
      throw new BadRequestException('No se puede cambiar el rol del administrador.');
    }

    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: publicUserSelect,
    });
  }
}