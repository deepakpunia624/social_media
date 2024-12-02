import { IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {

    @IsOptional()
    @ApiProperty({ type: 'string', description: 'Full name of the user', example: 'John Doe' })
    fullName: string;

    @IsOptional()
    @ApiPropertyOptional({ type: 'string', description: 'Email address of the user', example: 'john.doe@example.com' })
    email?: string;

    @IsOptional()
    @IsIn(['public', 'private'])
    @ApiPropertyOptional({
        type: 'string',
        description: 'Visibility status of the user profile',
        enum: ['public', 'private'],
        example: 'public',
    })
    visibility?: 'public' | 'private';

    @IsOptional()
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Profile picture file',
    })
    profilePic?: string;
}
