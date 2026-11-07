import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'maria@example.com' })
  email!: string;

  @ApiProperty({ example: 'UnaClaveSegura123!' })
  password!: string;
}