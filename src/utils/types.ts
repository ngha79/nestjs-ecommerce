import { Conversation } from 'src/entities/conversation.entity';
import { MessageConversation } from 'src/entities/message.entity';
import { User } from 'src/entities/user.entity';

export enum StatusShop {
  ACTIVE = 'active',
  BAND = 'band',
  UNACTIVE = 'unactive',
}

export type ResultTotalFollow = {
  followers: number;
  following: number;
};

export type ProfileUser = {
  followers: number;
  following: number;
  user: User;
};

export type ResultDataSearch = {
  data: any;
  lastPage: number;
  nextPage: number;
  prevPage: number;
};

export type FindShopParams = {
  id?: string;
  search?: string;
  isActive?: StatusShop;
  page: string;
  limit: string;
  order?: 'userName' | 'email' | 'money' | 'phoneNumber' | 'followers';
};

export enum BrandProduct {
  FASHION = 'Thời trang',
  FOOTWEAR = 'Giày dép',
  BOOKS = 'Sách',
  ELECTRONICS = 'Thiết bị điện tử',
  BEAUTY = 'Sắc đẹp',
  HEALTH = 'Sức khỏe',
  TOYS = 'Đồ chơi',
  PETCARE = 'Chăm sóc thú cưng',
}

export type CreateMessageResponse = {
  message: MessageConversation;
  conversation?: Conversation;
};

export type UpdateMessageResponse = {
  message: MessageConversation;
  conversation: Conversation;
};

export type DeleteMessageResponse = {
  message: MessageConversation;
  conversation: Conversation;
};

export type NotificationResponse = {
  notification: Notification;
  userId: string;
  shopId: string;
};

export type CreateConversation = {
  conversation: Conversation;
  userId?: string;
  shopId?: string;
};
