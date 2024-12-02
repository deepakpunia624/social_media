import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CloudinaryResponse } from './entities/cloudinary.response';
import { SignInUserDto } from './dto/signInUserDto';
const streamifier = require('streamifier');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUserService(user: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    } else {
      const createdUser = this.userRepository.create({
        ...user,
        profilePic:process.env.PROFILE_PIC
      });

      const savedUser = await this.userRepository.save(createdUser);

      return savedUser;
    }
  }

  async signin(user: SignInUserDto): Promise<any> {
    const foundUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (foundUser) {
      const { password } = foundUser;
      const checkPassword = await bcrypt.compare(user.password, password);
      if (checkPassword) {
        const payload = {
          email: foundUser.email,
          name: foundUser.fullName,
          id: foundUser.id,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
          // expiresIn: '15m',
        });
        return { token };
      } else {
        throw new Error('Incorrect email or password');
      }
    } else {
      throw new Error('User not found');
    }
  }

  async getUserById(userId: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateUser(
    profilePic: Express.Multer.File | undefined,
    userId: number,
    updatedUserData: UpdateUserDto,
  ): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!existingUser) {
        throw new Error('User not found');
      }

      if (profilePic) {
        const cloudinaryResponse = await new Promise<CloudinaryResponse>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { resource_type: 'auto' },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              },
            );

            streamifier.createReadStream(profilePic.buffer).pipe(uploadStream);
          },
        );
        const { secure_url } = cloudinaryResponse;

        existingUser.profilePic = secure_url || '';
      }
      if (
        updatedUserData.email &&
        updatedUserData.email === existingUser.email
      ) {
        throw new Error('Email is already in use by the same user');
      }

      if (
        updatedUserData.email &&
        updatedUserData.email !== existingUser.email
      ) {
        const existingUserWithEmail = await this.userRepository.findOne({
          where: { email: updatedUserData.email },
        });
        if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
          throw new Error('Email is already in use');
        }
      }

      existingUser.fullName = updatedUserData.fullName || existingUser.fullName;
      existingUser.email = updatedUserData.email || existingUser.email;
      existingUser.visibility =
        updatedUserData.visibility || existingUser.visibility;

      const updatedUser = await this.userRepository.save(existingUser);

      return updatedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
