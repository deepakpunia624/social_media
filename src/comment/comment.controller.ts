import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  Res,
  ValidationPipe,
  Logger,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Response } from 'express';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Controller('/comment')
export class CommentController {
  private readonly logger = new Logger(CommentController.name);
  constructor(private readonly commentService: CommentService) {}

  @Post('/create/:postId')
  async createComment(
    @Param('postId') postId: number,
    @Request() req: any,
    @Body(new ValidationPipe()) createCommentDto: CreateCommentDto,
    @Res() res: Response,
  ) {
    try {
      const addedComment = await this.commentService.createCommentService(
        createCommentDto,
        req.user.id,
        postId,
      );

      this.logger.log('info', 'Comment added successfully');
      return res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        comment: addedComment,
      });
    } catch (err) {
      this.logger.error(`Error during creating comment: ${err.message}`);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  @Get('/:postId')
  async getCommentsByPostId(
    @Param('postId') postId: number,
  ): Promise<Comment[]> {
    try {
      const comments: Comment[] =
        await this.commentService.getCommentsByPostId(postId);
      this.logger.log('info', 'Comment retrived successfully');
      return comments;
    } catch (error) {
      this.logger.error(
        `Error during Unable to retrieve comments for the given post ID: ${error.message}`,
      );
      throw new Error('Unable to retrieve comments for the given post ID');
    }
  }

  @Delete('/delete/:id')
  async deleteComment(
    @Param('id') commentId: number,
    @Request() req: any,
    @Res() res: Response,
  ) {
    try {
      await this.commentService.deleteCommentService(commentId, req.user.id);

      this.logger.log('info', 'Comment deleted successfully');
      return res.status(200).json({
        success: true,
        message: 'Comment deleted successfully',
      });
    } catch (err) {
      this.logger.error(`Error during deleting comment: ${err.message}`);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}
