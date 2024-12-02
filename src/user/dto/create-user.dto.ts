import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  id: number;

  @IsNotEmpty()
  @ApiProperty({ type: 'string', example: 'john' })
  fullName: string;

  @IsNotEmpty()
  @MinLength(10)
  @Transform(({ value }: TransformFnParams) => value.toString())
  @ApiProperty({ type: 'number', example: '9999999999' })
  phoneNumber: number;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format.' })
  @ApiProperty({ type: 'string', example: 'example@gmail.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z]).{6,}$/, {
    message: 'Password must contain at least one uppercase letter.',
  })
  @Matches(/^(?=.*[0-9]).{6,}$/, {
    message: 'Password must contain at least one number.',
  })
  @Matches(/^(?=.*[^A-Za-z0-9]).{6,}$/, {
    message: 'Password must contain at least one special character.',
  })
  @ApiProperty({ type: 'string', example: 'example@123' })
  password: string;

  profilePic: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', example: 'example@123' })
  confirmPassword: string;
}
