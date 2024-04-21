import { BrandProduct } from 'src/utils/types';

export class SearchProduct {
  page: string;

  limit: string;

  search: string;

  shopId?: string;

  publish?: string;

  brand?: BrandProduct;

  order?: 'ASC' | 'DESC';

  searchBy: 'ctime' | 'price' | 'sales';

  ids?: string;
}

export class SearchProductShop {
  page: string;

  limit: string;

  search: string;

  shopId: string;

  publish?: string;

  brand?: BrandProduct;

  order?: 'ASC' | 'DESC';

  searchBy: 'ctime' | 'price' | 'sales';
}
