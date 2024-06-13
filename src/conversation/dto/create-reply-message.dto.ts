import { PayloadToken } from 'src/auth/dto/payload-token.dto';

export class CreateReplyDto {
  messageId: number;
  user?: PayloadToken;
  shop?: PayloadToken;
  content: string;
  urls?: string[];
  conversationId: string;
}
