import {
  Controller,
  Post,
  Body,
  Request,
  UploadedFile,
  UseInterceptors,
  Logger,
  Res,
  Get,
  Req,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
import { Response } from 'express';

@Controller('/post')
export class PostController {
  private readonly logger = new Logger(PostController.name);
  constructor(private readonly postService: PostService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async createPost(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Res() res: Response,
    @Request() req: any,
  ) {
    try {
      const { content } = body;

      const createPost = await this.postService.uploadPost(
        file,
        req.user.id,
        content,
      );

      this.logger.log('info', 'Post created successfully');
      return res.status(200).json({
        success: true,
        message: 'Post created successfully',
        data: createPost,
      });
    } catch (error) {
      this.logger.error(`Error creating post: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Get('/me')
  async getAllMyPosts(@Res() res: Response, @Request() req: any) {
    try {
      const userId = req.user.id;
      const posts = await this.postService.getAllMyPostsService(userId);

      if (posts && Array.isArray(posts)) {
        posts.forEach((post) => {
          if (post.user) {
            delete post.user.password;
          }
        });
      }
      this.logger.log('info', 'Posts retrieved successfully');

      return res.status(200).json({
        success: true,
        postLists: posts,
      });
    } catch (error) {
      this.logger.error(`Error during retrieving all post: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Delete('/:id')
  async deletePost(
    @Param('id') id: number,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      const result = await this.postService.deletePost(id);
      if (result) {
        this.logger.log('info', 'Post deleted successfully');
        return res.status(200).json({
          success: true,
          message: 'Post deleted successfully',
        });
      } else {
        this.logger.log('info', 'Post not found');
        return res.status(404).json({
          success: false,
          message: 'Post not found',
        });
      }
    } catch (error) {
      this.logger.error(`Error during delete post: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Get('friends/:id')
  async getPostsByUser(
    @Param('id') userId: number,
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      const viewerId = req.user.id;

      const posts = await this.postService.getPostsByUser(userId, viewerId);
      this.logger.log('info', 'Friends post retrive successfully');
      return res.status(200).json({
        success: true,
        message: 'Posts retrieved successfully',
        data: posts,
      });
    } catch (error) {
      this.logger.error(
        `Error during retrive post based on friends: ${error.message}`,
      );
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
