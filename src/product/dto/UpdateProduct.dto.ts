import { BrandProduct } from 'src/utils/types';

export interface IUpdateProduct {
  name?: string;

  brand?: BrandProduct;

  detail?: string;

  price?: number;

  isPublish?: boolean;

  attributes: string;

  attributesDelete: string;

  attributesUpdate: string;

  pictureDelete: string;
}

export interface IUpdateAttributeProduct {
  picture: string;

  size: string;

  thumb: string;

  id: number;

  material: string;
}

export interface IProductId {
  productId: string;
}

export interface IPublishOrUnPublishProduct {
  productIds: string[];
}
