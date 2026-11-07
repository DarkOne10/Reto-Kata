import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { UpdateUserRoleDto } from './dto/update-user-role.dto.js';
import { UsersService } from './users.service.js';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Lista usuarios para administración de roles' })
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Asigna rol de analista o postulante' })
  @ApiBody({ type: UpdateUserRoleDto })
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserRoleDto,
  ) {
    if (
      body?.role !== UserRole.ANALYST &&
      body?.role !== UserRole.APPLICANT
    ) {
      throw new BadRequestException('El rol debe ser ANALYST o APPLICANT.');
    }
    return this.usersService.updateRole(id, body.role);
  }
}