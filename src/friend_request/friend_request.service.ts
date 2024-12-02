import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequest } from './entities/friend_request.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async sendFriendRequest(
    senderId: number,
    receiverId: number,
  ): Promise<FriendRequest> {
    if (senderId === receiverId) {
      throw new Error('Sender and receiver cannot be the same');
    }

    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });
    const receiver = await this.userRepository.findOne({
      where: { id: receiverId },
    });

    if (!sender || !receiver) {
      throw new Error('Sender or receiver not found');
    }

    const existingRequest = await this.friendRequestRepository
      .createQueryBuilder('friendRequest')
      .leftJoinAndSelect('friendRequest.sender', 'sender')
      .leftJoinAndSelect('friendRequest.receiver', 'receiver')
      .where('sender.id = :senderId AND receiver.id = :receiverId', {
        senderId: sender.id,
        receiverId: receiver.id,
      })
      .orWhere('sender.id = :receiverId AND receiver.id = :senderId', {
        senderId: sender.id,
        receiverId: receiver.id,
      })
      .andWhere('friendRequest.status = :status', { status: 'pending' })
      .getOne();

    if (existingRequest) {
      throw new Error('Friend request already sent or exists');
    }

    const friendRequest = this.friendRequestRepository.create({
      sender,
      receiver,
      status: 'pending',
    });

    return await this.friendRequestRepository.save(friendRequest);
  }

  async updateRequestStatus(
    requestId: number,
    status: 'pending' | 'accepted' | 'rejected',
  ): Promise<FriendRequest> {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { id: requestId },
    });

    if (!friendRequest) {
      throw new Error('Friend request not found');
    }

    friendRequest.status = status;

    return await this.friendRequestRepository.save(friendRequest);
  }

  async getAllFriendRequests(receiverId: number): Promise<FriendRequest[]> {
    const friendRequests = await this.friendRequestRepository.find({
      where: { receiver: { id: receiverId } },
      relations: ['sender', 'receiver'],
    });

    return friendRequests;
  }
}
