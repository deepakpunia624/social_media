import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserAuthenticationMiddleware } from './middleware/authToken';
import { PostModule } from './post/post.module';
import { FriendRequestModule } from './friend_request/friend_request.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PG_HOST'),
        port: configService.get<number>('PG_PORT', 5432),
        username: configService.get<string>('PG_USERNAME'),
        password: configService.get<string>('PG_PASSWORD'),
        database: configService.get<string>('PG_DATABASE'),
        entities: [ 'dist/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: false,
      }),
    }),
    UserModule,
    PostModule,
    FriendRequestModule,
    CommentModule,
    LikeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAuthenticationMiddleware)
      .forRoutes(
        'users/update',
        'post/create',
        'post/me',
        'post/:id',
        'friend-request/send',
        'friend-request/:id',
        'friend-request/requests',
        'friend-request/friends/:id',
        'comment/create/:postId',
        'comment/:postId',
        'comment/delete/:id',
        'like/:postId',
        'like/unlike/:postId',
        'like/count/:postId'
      );
  }
}
