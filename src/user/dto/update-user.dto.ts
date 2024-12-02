import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {

   
    @IsString()
    fullName: string;

    @IsOptional()
    email:string

    @IsOptional()
    @IsIn(['public', 'private'])
    visibility?: 'public' | 'private';
  
}
