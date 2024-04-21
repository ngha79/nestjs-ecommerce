export class QuerySearchDTO {
  limit: string;

  page: string;

  productId?: string;

  userId?: string;

  shopId?: string;

  rating?: number;

  order?: 'recent' | 'oldest' | 'highest' | 'lowest';
}
