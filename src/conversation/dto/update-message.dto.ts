import { MessageConversation } from 'src/entities/message.entity';

export class UpdateMessage {
  message: MessageConversation;
}

export class DeleteMessage {
  userId?: string;
  shopId?: string;
}

export class FindAllMessageDto {
  page: string | number;
  limit: string | number;
  conversationId: string;
}
