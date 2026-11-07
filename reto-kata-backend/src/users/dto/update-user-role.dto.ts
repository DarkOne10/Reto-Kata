import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({ enum: [UserRole.ANALYST, UserRole.APPLICANT] })
  role!: UserRole;
}