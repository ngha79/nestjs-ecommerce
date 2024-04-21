import { User } from 'src/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Shop } from './shop.entity';

@Entity('follows_user')
export class FollowsUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Shop, (shop) => shop.followers)
  userFollow: Shop;

  @ManyToOne(() => User, (user) => user.following)
  user: User;
}
