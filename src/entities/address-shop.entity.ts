import { IsNotEmpty } from 'class-validator';
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

@Entity()
export class AddressShop {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Shop, (shop) => shop.address)
  @JoinColumn()
  shop: Shop;

  @Column()
  @IsNotEmpty()
  address: string;

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
