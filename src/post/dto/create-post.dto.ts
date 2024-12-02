import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
    required: false,
  })
  file?: string; 

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'Content of the post',
    example: 'This is a sample post content.',
  })
  content: string;
}
