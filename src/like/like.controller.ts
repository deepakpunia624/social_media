import {
  Controller,
  Get,
  Post,
  Request,
  Param,
  Delete,
  Res,
  Logger,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { Response } from 'express';

@Controller('/like')
export class LikeController {
  private readonly logger = new Logger(LikeController.name);
  constructor(private readonly likeService: LikeService) {}

  @Post('/:postId')
  async likePost(
    @Param('postId') postId: number,
    @Request() req: any,
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.id;
      const like = await this.likeService.likePost(postId, userId);

      this.logger.log('info', 'Like added successfully');
      return res.status(201).json({
        success: true,
        message: 'Post liked successfully',
        like,
      });
    } catch (err) {
      this.logger.error(`Error during creating like: ${err.message}`);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  @Delete('/unlike/:postId')
  async unlikePost(
    @Param('postId') postId: number,
    @Request() req: any,
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.id;
      await this.likeService.unlikePost(postId, userId);
      this.logger.log('info', 'Post unliked successfully');
      return res.status(200).json({
        success: true,
        message: 'Post unliked successfully',
      });
    } catch (err) {
      this.logger.error(`Error during unlike post: ${err.message}`);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  @Get('/count/:postId')
  async getLikeCount(@Param('postId') postId: number, @Res() res: Response) {
    try {
      const likeCount = await this.likeService.getLikesByPostId(postId);
      this.logger.log('info', 'Total like count retrive successfully');
      return res.status(200).json({
        success: true,
        likeCount,
      });
    } catch (err) {
      this.logger.error(`Error during retrive total like: ${err.message}`);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}
