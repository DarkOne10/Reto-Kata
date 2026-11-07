import { CandidateStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCandidateStatusDto {
  @ApiProperty({
    enum: [CandidateStatus.VIABLE, CandidateStatus.NOT_VIABLE],
    example: CandidateStatus.VIABLE,
  })
  status!: CandidateStatus;
}