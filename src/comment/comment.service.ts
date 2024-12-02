import { Injectable } from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createCommentService(
    comment: CreateCommentDto,
    userId: number,
    postId: number,
  ): Promise<Comment> {
    try {
      const post = await this.postRepository.findOne({
        where: { id: postId },
      });

      if (!post) {
        throw new Error('Video not found');
      }

      const createComment: DeepPartial<Comment>[] = [
        {
          ...comment,
          post: post,
          user: { id: userId },
          createdBy: userId,
        },
      ];

      const savedComments = await this.commentRepository.save(createComment);

      return savedComments[0];
    } catch (error) {
      throw new Error(`Unable to create comment${error.message}`);
    }
  }

  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    try {
      const comments = await this.commentRepository.find({
        where: { post: { id: postId } },
        relations: ['user'],
      });

      return comments || [];
    } catch (error) {
      throw new Error('Unable to fetch comments by post ID');
    }
  }

  async deleteCommentService(
    commentId: number,
    userId: number,
  ): Promise<Comment> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
        relations: ['user'],
      });

      if (!comment) {
        throw new Error('Comment not found');
      }

      if (comment.user.id !== userId) {
        throw new Error('You do not have permission to delete this comment');
      }

      await this.commentRepository.remove(comment);

      return comment;
    } catch (error) {
      throw new Error(`Unable to delete comment: ${error.message}`);
    }
  }
}
