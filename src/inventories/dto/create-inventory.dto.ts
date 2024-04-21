export class CreateInventoryDto {
  shopId: string;

  productAttributeId: number;

  productId: string;

  reservation?: [];

  stock: number;

  location?: string;
}
