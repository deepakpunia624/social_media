import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateCommentDto {
  id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    description: 'The content of the comment',
    example: 'This is a sample comment.',
  })
  comment: string;
}
