import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CandidateStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { ResumeStorageService, type ResumeUpload } from './resume-storage.service.js';

@Injectable()
export class CandidatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly resumeStorage: ResumeStorageService,
  ) {}

  async create(data: {
    fullName: string;
    email: string;
    career: string;
    semester: number;
    userId: number;
    resume: ResumeUpload;
  }) {
    const resumePath = await this.resumeStorage.upload(data.resume);

    try {
      return await this.prisma.candidate.create({
        data: {
          fullName: data.fullName,
          email: data.email.toLowerCase(),
          career: data.career,
          semester: data.semester,
          userId: data.userId,
          resumePath,
        },
      });
    } catch (error) {
      await this.resumeStorage.remove(resumePath).catch(() => undefined);

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

  async getResumeUrl(id: number) {
    const candidate = await this.findOne(id);
    if (!candidate.resumePath) {
      throw new NotFoundException('El candidato no tiene una hoja de vida adjunta.');
    }

    return { url: await this.resumeStorage.createSignedUrl(candidate.resumePath) };
  }

  async updateStatus(id: number, status: CandidateStatus) {
    await this.findOne(id);
    return this.prisma.candidate.update({
      where: { id },
      data: { status, reviewedAt: new Date() },
    });
  }
}