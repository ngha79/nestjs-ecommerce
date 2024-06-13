import { Product } from 'src/entities/product.entity';
import { CreateProductDTO } from '../dto/product.dto';
import {
  IPublishOrUnPublishProduct,
  IUpdateAttributeProduct,
  IUpdateProduct,
} from '../dto/UpdateProduct.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { SearchProduct, SearchProductShop } from '../dto/SearchProduct.dto';
import { ProductAttribute } from 'src/entities/productAttribute.entity';
import { ItemProduct } from '../dto/checkout-product';
import { Shop } from 'src/entities/shop.entity';
import { LikeProduct } from 'src/entities/like-product.entity';

export interface IProductService {
  createProduct(productDTO: CreateProductDTO, shop: Shop): Promise<Product>;
  getProductById(productId: string): Promise<Product>;
  getProductPublish(productId: string): Promise<Product>;
  getProductAttributeById(productId: number): Promise<ProductAttribute>;
  updateProductById(
    productId: string,
    updateProduct: IUpdateProduct,
  ): Promise<UpdateResult>;
  publishProducts(
    productDTO: IPublishOrUnPublishProduct,
  ): Promise<UpdateResult>;
  unpublishProduct(
    productDTO: IPublishOrUnPublishProduct,
  ): Promise<UpdateResult>;
  updateAttributeProduct(
    productId: string,
    updateAttributeProduct: IUpdateAttributeProduct,
  ): Promise<ProductAttribute>;
  deleteProductById(productId: string): Promise<boolean>;
  allProduct(productSearch: SearchProduct): Promise<any>;
  allProductShop(productSearch: SearchProductShop): Promise<any>;
  checkProductByServer(products: ItemProduct[]): Promise<ItemProduct[]>;
  likeProduct(
    id: string,
    productId: string,
    shopId: string,
  ): Promise<LikeProduct>;
  unlikeProduct(id: string, productId: string): Promise<DeleteResult>;
}
