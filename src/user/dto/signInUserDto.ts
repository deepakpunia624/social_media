import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignInUserDto {

  @IsNotEmpty()
  @ApiProperty({ type: 'string', example: 'example@gmail.com' })
  email: string;

  @ApiProperty({ type: 'string', example: 'example@123' })
  @IsNotEmpty()
  password: string;
}
