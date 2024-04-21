import { User } from 'src/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Shop } from './shop.entity';

@Entity('conversation')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user, { createForeignKeyConstraints: false })
  @JoinColumn()
  user: User;

  @Column()
  conversation_name: string;

  @Column()
  conversation_status: string;

  @Column()
  conversation_block: string;

  @Column()
  conversation_slug: string;

  @OneToOne(() => Shop, (shop) => shop, { createForeignKeyConstraints: false })
  @JoinColumn()
  shop: Shop;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAts: Date;
}
