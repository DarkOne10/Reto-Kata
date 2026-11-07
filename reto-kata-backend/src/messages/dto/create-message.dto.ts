import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ example: 'Texto de prueba desde Next.js', maxLength: 500 })
  content!: string;
}