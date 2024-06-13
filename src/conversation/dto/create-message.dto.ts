import { PayloadToken } from 'src/auth/dto/payload-token.dto';

export class CreateMessage {
  user?: PayloadToken;
  shop?: PayloadToken;
  content: string;
  urls?: string[];
  conversationId?: string;
}
