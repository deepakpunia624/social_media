import {
  Controller,
  Post,
  Body,
  Patch,
  Request,
  ValidationPipe,
  Res,
  Logger,
  UseInterceptors,
  UploadedFile,
  applyDecorators,
  UseGuards,
  Get,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SignInUserDto } from './dto/signInUserDto';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UserAuthenticationGuard } from 'src/middleware/authToken';

@Controller('/users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) { }

  @Post('/register')
  async createUser(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    try {
      for (const key in createUserDto) {
        if (typeof createUserDto[key] === 'string') {
          createUserDto[key] = createUserDto[key].trim();
        }
      }

      if (createUserDto.password !== createUserDto.confirmPassword) {
        throw new Error('Password and confirmPassword do not match');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      createUserDto.password = hashedPassword;

      const addedUser = await this.userService.createUserService(createUserDto);

      this.logger.log('info', 'User added successfully');
      return res.status(201).json({
        success: true,
        message: 'User added successfully',
        user: addedUser,
      });
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Post('/signin')
  async signIn(@Res() res: Response, @Body() user: SignInUserDto) {
    try {
      const result = await this.userService.signin(user);

      this.logger.log('info', 'User login successfully');
      return res.status(200).json({
        success: true,
        message: 'User login successfully',
        token: result.token,
      });
    } catch (error) {
      this.logger.error(`Error During login: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Get('/get')
  @applyDecorators(ApiBearerAuth())
  @UseGuards(UserAuthenticationGuard)
  async getUserId(@Request() req, @Res() res: Response) {
    try {
      const user = await this.userService.getUserById(req.user.id);
      delete user.password
      return res.json(user);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Patch('/update')
  @applyDecorators(ApiBearerAuth())
  @UseGuards(UserAuthenticationGuard)
  @UseInterceptors(FileInterceptor('profilePic'))
  @ApiConsumes('multipart/form-data')
  async updateUser(
    @UploadedFile() profilePic: Express.Multer.File,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
    @Res() res: Response,
    @Request() req: any,
  ) {
    try {
      for (const key in updateUserDto) {
        if (typeof updateUserDto[key] === 'string') {
          updateUserDto[key] = updateUserDto[key].trim();
        }
      }

      const updatedUser = await this.userService.updateUser(
        profilePic,
        req.user.id,
        updateUserDto,
      );

      this.logger.log('info', 'User updated successfully');
      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
