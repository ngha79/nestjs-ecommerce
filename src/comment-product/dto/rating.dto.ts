export class GetRatingShopDTO {
  shopId: string;
  star?: string;
  productId?: string;
  limit?: string;
  page?: string;
}

export class GetRatingProductDTO {
  productId?: string;
  star?: number;
}
