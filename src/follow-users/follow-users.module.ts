import { Module, forwardRef } from '@nestjs/common';
import { FollowUsersService } from './follow-users.service';
import { FollowUsersController } from './follow-users.controller';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowsUser } from 'src/entities/followsUser.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/entities/user.entity';
import { Shop } from 'src/entities/shop.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FollowsUser, User, Shop]),
    forwardRef(() => UserModule),
  ],
  controllers: [FollowUsersController],
  providers: [{ provide: Services.FOLLOW_USERS, useClass: FollowUsersService }],
  exports: [{ provide: Services.FOLLOW_USERS, useClass: FollowUsersService }],
})
export class FollowUsersModule {}
