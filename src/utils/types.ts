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
