import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { CloudinaryResponse } from 'src/user/entities/cloudinary.response';
import { FriendRequest } from 'src/friend_request/entities/friend_request.entity';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
  ) {}

  async uploadPost(file: Express.Multer.File, userId: number, content: string) {
    try {
      const cloudinaryResponse = await new Promise<CloudinaryResponse>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            },
          );

          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        },
      );

      const { secure_url } = cloudinaryResponse;

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      const newPost = new Post();
      newPost.createdBy = userId;
      newPost.user = user;
      newPost.content = content;
      newPost.imageUrl = secure_url || '';

      await this.postRepository.save(newPost);

      return cloudinaryResponse;
    } catch (error) {
      this.logger.error(`Error during upload post: ${error.message}`);
      throw new InternalServerErrorException(
        'Error uploading file to Cloudinary',
      );
    }
  }

  async getAllMyPostsService(userId: number): Promise<any> {
    try {
      const posts = await this.postRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
        order: {
          createdAt: 'DESC',
        },
      });

      return posts;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deletePost(postId: number): Promise<boolean> {
    try {
      const post = await this.postRepository.findOne({
        where: { id: postId },
      });
      if (!post) {
        return false;
      }
      await this.postRepository.delete(postId);
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getPostsByUser(userId: number, viewerId: number): Promise<Post[]> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.visibility === 'private') {
        const isFriend = await this.friendRequestRepository.findOne({
          where: [
            {
              sender: { id: viewerId },
              receiver: { id: userId },
              status: 'accepted',
            },
            {
              sender: { id: userId },
              receiver: { id: viewerId },
              status: 'accepted',
            },
          ],
        });

        if (!isFriend) {
          throw new Error(
            'You do not have permission to view this user’s posts',
          );
        }
      }

      return this.postRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
