import { Module } from '@nestjs/common';
import { ConversationController } from './controllers/conversation.controller';
import { ConversationService } from './services/conversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageConversation } from 'src/entities/message.entity';
import { Conversation } from 'src/entities/conversation.entity';
import { ImageMessage } from 'src/entities/image-message.entity';
import { JwtModule } from '@nestjs/jwt';
import { KeyToken } from 'src/entities/keytoken.entity';
import { Shop } from 'src/entities/shop.entity';
import { User } from 'src/entities/user.entity';
import { ReplyMessage } from 'src/entities/reply_message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageConversation,
      Conversation,
      ImageMessage,
      KeyToken,
      Shop,
      User,
      ReplyMessage,
    ]),
    JwtModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
