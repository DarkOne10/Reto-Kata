import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CandidateStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CandidatesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    fullName: string;
    email: string;
    career: string;
    semester: number;
    userId: number;
  }) {
    try {
      return await this.prisma.candidate.create({
        data: {
          ...data,
          email: data.email.toLowerCase(),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya existe un candidato con ese correo.');
      }

      throw error;
    }
  }

  findAll() {
    return this.prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findMine(userId: number) {
    return this.prisma.candidate.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const candidate = await this.prisma.candidate.findUnique({ where: { id } });
    if (!candidate) {
      throw new NotFoundException('No se encontró el candidato.');
    }
    return candidate;
  }

  async updateStatus(id: number, status: CandidateStatus) {
    await this.findOne(id);
    return this.prisma.candidate.update({
      where: { id },
      data: { status, reviewedAt: new Date() },
    });
  }
}