import { IsNotEmpty } from 'class-validator';
import { User } from 'src/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.address)
  @JoinColumn()
  user: User;

  @Column()
  @IsNotEmpty()
  address: string;

  @Column({ default: false, type: Boolean })
  isAddressDefault: boolean;

  @Column()
  @IsNotEmpty()
  phoneNumber: string;

  @Column()
  @IsNotEmpty()
  userName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
