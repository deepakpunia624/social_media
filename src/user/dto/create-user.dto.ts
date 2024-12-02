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
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @MinLength(10)
  @Transform(({ value }: TransformFnParams) => value.toString())
  phoneNumber: number;

  @IsNotEmpty()
  @IsEmail()
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
  password: string;

  profilePic: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
