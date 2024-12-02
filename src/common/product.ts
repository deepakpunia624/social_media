import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  @Expose({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  @Expose({ name: 'updatedAt' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', nullable: true, default: null, name: 'created_by' })
  @Expose({ name: 'createdBy' })
  createdBy: number;

  @Column({ type: 'int', nullable: true, default: null, name: 'updated_by' })
  @Expose({ name: 'updatedBy' })
  updatedBy: number;
}
