import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Param,
  Res,
  Logger,
  Put,
  Req,
} from '@nestjs/common';
import { FriendRequestService } from './friend_request.service';
import { Response } from 'express';

@Controller('/friend-request')
export class FriendRequestController {
  private readonly logger = new Logger(FriendRequestController.name);
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post('/send')
  async sendFriendRequest(
    @Body('receiverId') receiverId: number,
    @Request() req: any,
    @Res() res: Response,
  ) {
    try {
      const senderId = req.user.id;
      const friendRequest = await this.friendRequestService.sendFriendRequest(
        senderId,
        receiverId,
      );
      delete friendRequest.sender.password;
      delete friendRequest.receiver.password;
      this.logger.log('info', 'Friend request send successfully');
      return res.status(200).json({
        success: true,
        message: 'Friend request sent successfully',
        friendRequest,
      });
    } catch (error) {
      this.logger.error(`Error during sending request: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Put('/:id')
  async updateRequestStatus(
    @Param('id') id: number,
    @Body('status') status: 'pending' | 'accepted' | 'rejected',
  ) {
    try {
      const updatedRequest =
        await this.friendRequestService.updateRequestStatus(id, status);
      this.logger.log('info', 'Request status updated successfully');
      return {
        success: true,
        message: `Request status updated to ${status}`,
        updatedRequest,
      };
    } catch (error) {
      this.logger.error(
        `Error during request status update : ${error.message}`,
      );
      return { success: false, message: error.message };
    }
  }

  @Get('/requests')
  async getAllFriendRequests(@Req() req: any) {
    try {
      const receiverId = req.user.id;
      this.logger.log('info', 'All request retrive successfully');
      return await this.friendRequestService.getAllFriendRequests(receiverId);
    } catch (error) {
      this.logger.error(`Error during all request retrive : ${error.message}`);
      return { message: error.message };
    }
  }
}
