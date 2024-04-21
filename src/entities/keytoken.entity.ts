import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { RefreshTokenUsed } from './refresh-token-used.entity';

@Entity()
export class KeyToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: string;

  @Column()
  publicKey: string;

  @Column()
  privateKey: string;

  @OneToMany(() => RefreshTokenUsed, (token) => token.keyToken)
  @JoinColumn()
  refreshTokenUsed: RefreshTokenUsed[];

  @Column()
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
