import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  create(content: string) {
    return this.prisma.message.create({ data: { content } });
  }

  latest() {
    return this.prisma.message.findFirst({
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
  }
}