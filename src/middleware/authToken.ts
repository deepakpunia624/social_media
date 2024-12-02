import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserAuthenticationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          throw new HttpException(
            'User is not authorized',
            HttpStatus.UNAUTHORIZED,
          );
        } else {
          req['user'] = decoded;
          next();
        }
      });
    } else {
      throw new HttpException('Token not found', HttpStatus.CONFLICT);
    }
  }
}
