import { Comment } from 'src/comment/entities/comment.entity';
import { BaseEntity } from 'src/common/product';
import { Like } from 'src/like/entities/like.entity';
import { Post } from 'src/post/entities/post.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  fullName: string;

  @Column({ type: 'varchar', length: 30 })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber: number;

  @Column({ type: 'varchar', nullable: true })
  profilePic: string;

  @Column({ type: 'varchar', length: 256, nullable: true, default: null })
  password: string;

  confirmPassword: string;

  @Column({ default: 'public' })
  visibility: 'public' | 'private';

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];
}
