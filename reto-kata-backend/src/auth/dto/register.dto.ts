import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'María Pérez', maxLength: 120 })
  name!: string;

  @ApiProperty({ example: 'maria@example.com', maxLength: 254 })
  email!: string;

  @ApiProperty({ example: 'UnaClaveSegura123!', minLength: 10 })
  password!: string;
}