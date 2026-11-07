import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CandidateStatus, UserRole } from '@prisma/client';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCandidateDto } from './dto/create-candidate.dto.js';
import { UpdateCandidateStatusDto } from './dto/update-candidate-status.dto.js';
import { CandidatesService } from './candidates.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';

@ApiTags('candidates')
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.APPLICANT)
  @ApiOperation({ summary: 'Registra un candidato' })
  @ApiBody({ type: CreateCandidateDto })
  @ApiCreatedResponse({ description: 'Candidato creado.' })
  create(@Body() body: CreateCandidateDto) {
    const fullName = this.requiredText(body?.fullName, 'El nombre');
    const email = this.requiredText(body?.email, 'El correo').toLowerCase();
    const career = this.requiredText(body?.career, 'La carrera');
    const semester = body?.semester;

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

    return this.candidatesService.create({ fullName, email, career, semester });
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ANALYST)
  @ApiOperation({ summary: 'Lista los candidatos registrados' })
  @ApiOkResponse({ description: 'Lista de candidatos.' })
  findAll() {
    return this.candidatesService.findAll();
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