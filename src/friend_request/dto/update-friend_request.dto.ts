import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateFriendRequestDto {
  @IsNotEmpty()
  @IsIn(['pending', 'accepted', 'rejected'])
  @ApiProperty({
    type: 'string',
    description: 'Status of the friend request',
    enum: ['pending', 'accepted', 'rejected'],
    example: 'accepted',
  })
  status: 'pending' | 'accepted' | 'rejected';
}
