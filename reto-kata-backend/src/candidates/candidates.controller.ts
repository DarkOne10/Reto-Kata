import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidateStatus, UserRole } from '@prisma/client';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCandidateDto } from './dto/create-candidate.dto.js';
import { UpdateCandidateStatusDto } from './dto/update-candidate-status.dto.js';
import { CandidatesService } from './candidates.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import type { AuthenticatedRequest } from '../auth/auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import type { ResumeUpload } from './resume-storage.service.js';

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

@ApiTags('candidates')
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.APPLICANT)
  @UseInterceptors(
    FileInterceptor('resume', {
      limits: { fileSize: MAX_RESUME_SIZE },
      fileFilter: (_request, file, callback) => {
        callback(
          null,
          file.mimetype === 'application/pdf' && /\.pdf$/i.test(file.originalname),
        );
      },
    }),
  )
  @ApiOperation({ summary: 'Registra un candidato' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string', maxLength: 150 },
        email: { type: 'string', maxLength: 254 },
        career: { type: 'string', maxLength: 150 },
        semester: { type: 'integer', minimum: 1, maximum: 20 },
        resume: { type: 'string', format: 'binary' },
      },
      required: ['fullName', 'email', 'career', 'semester', 'resume'],
    },
  })
  @ApiCreatedResponse({ description: 'Candidato creado.' })
  create(
    @Body() body: CreateCandidateDto,
    @UploadedFile() file: ResumeUpload | undefined,
    @Req() request: AuthenticatedRequest,
  ) {
    const fullName = this.requiredText(body?.fullName, 'El nombre');
    const email = this.requiredText(body?.email, 'El correo').toLowerCase();
    const career = this.requiredText(body?.career, 'La carrera');
    const semester = Number(body?.semester);

    if (fullName.length > 150) {
      throw new BadRequestException('El nombre no puede superar 150 caracteres.');
    }
    if (career.length > 150) {
      throw new BadRequestException('La carrera no puede superar 150 caracteres.');
    }
    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      throw new BadRequestException('El correo no tiene un formato válido.');
    }
    if (!Number.isInteger(semester) || semester < 1 || semester > 20) {
      throw new BadRequestException('El semestre debe ser un entero entre 1 y 20.');
    }
    if (
      !file ||
      file.mimetype !== 'application/pdf' ||
      file.size > MAX_RESUME_SIZE ||
      file.buffer.subarray(0, 5).toString('ascii') !== '%PDF-'
    ) {
      throw new BadRequestException('Adjunta una hoja de vida PDF válida de máximo 5 MB.');
    }

    const userId = request.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Inicia sesión para continuar.');
    }
    if (email !== request.user?.email) {
      throw new BadRequestException(
        'El correo debe coincidir con el de la cuenta autenticada.',
      );
    }

    return this.candidatesService.create({
      fullName,
      email,
      career,
      semester,
      userId,
      resume: file,
    });
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ANALYST)
  @ApiOperation({ summary: 'Lista los candidatos registrados' })
  @ApiOkResponse({ description: 'Lista de candidatos.' })
  findAll() {
    return this.candidatesService.findAll();
  }

  @Get('mine')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.APPLICANT)
  @ApiOperation({ summary: 'Lista las postulaciones del usuario actual' })
  @ApiOkResponse({ description: 'Postulaciones del usuario autenticado.' })
  findMine(@Req() request: AuthenticatedRequest) {
    const userId = request.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Inicia sesión para continuar.');
    }
    return this.candidatesService.findMine(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ANALYST)
  @ApiOperation({ summary: 'Consulta un candidato por id' })
  @ApiOkResponse({ description: 'Detalle del candidato.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.candidatesService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ANALYST)
  @ApiOperation({ summary: 'Actualiza la decisión de selección' })
  @ApiBody({ type: UpdateCandidateStatusDto })
  @ApiOkResponse({ description: 'Estado del candidato actualizado.' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCandidateStatusDto,
  ) {
    const status = body?.status;
    if (
      status !== CandidateStatus.VIABLE &&
      status !== CandidateStatus.NOT_VIABLE
    ) {
      throw new BadRequestException('El estado debe ser VIABLE o NOT_VIABLE.');
    }

    return this.candidatesService.updateStatus(id, status);
  }

  private requiredText(value: unknown, label: string) {
    if (typeof value !== 'string' || value.trim().length < 2) {
      throw new BadRequestException(`${label} es obligatorio.`);
    }
    return value.trim();
  }
}