import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { FriendRequest } from 'src/friend_request/entities/friend_request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, FriendRequest])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
