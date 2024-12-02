import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFriendRequestDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: 'number',
    description: 'ID of the receiver to whom the friend request is sent',
    example: 123,
  })
  receiverId: number;
}
