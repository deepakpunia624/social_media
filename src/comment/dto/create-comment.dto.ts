import { IsNotEmpty, IsString } from 'class-validator';
export class CreateCommentDto {
  id: number;

  @IsNotEmpty()
  @IsString()
  comment: string;
}
