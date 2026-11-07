import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CandidatesController } from './candidates.controller.js';
import { CandidatesService } from './candidates.service.js';
import { ResumeStorageService } from './resume-storage.service.js';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [CandidatesController],
  providers: [CandidatesService, ResumeStorageService],
})
export class CandidatesModule {}