import { ApiProperty } from '@nestjs/swagger';

export class CreateCandidateDto {
  @ApiProperty({ example: 'Ana García', maxLength: 150 })
  fullName!: string;

  @ApiProperty({ example: 'ana@example.com', maxLength: 254 })
  email!: string;

  @ApiProperty({ example: 'Ingeniería de Sistemas', maxLength: 150 })
  career!: string;

  @ApiProperty({ example: 6, minimum: 1, maximum: 20 })
  semester!: number;
}