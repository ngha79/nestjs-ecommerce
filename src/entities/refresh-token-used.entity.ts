import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { KeyToken } from './keytoken.entity';

@Entity('refresh_token_used')
export class RefreshTokenUsed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  refreshToken: string;

  @ManyToOne(() => KeyToken, (keyToken) => keyToken.refreshTokenUsed)
  @JoinColumn()
  keyToken: KeyToken;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
