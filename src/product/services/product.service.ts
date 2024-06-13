import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import {
  DataSource,
  DeleteResult,
  In,
  Like,
  Not,
  Repository,
  UpdateResult,
} from 'typeorm';
import { ProductDTO } from '../dto/product.dto';
import { ProductAttribute } from 'src/entities/productAttribute.entity';
import slugify from 'slugify';
import {
  IPublishOrUnPublishProduct,
  IUpdateAttributeProduct,
  IUpdateProduct,
} from '../dto/UpdateProduct.dto';
import { SearchProduct, SearchProductShop } from '../dto/SearchProduct.dto';
import { Services } from 'src/utils/constants';
import { Inventory } from 'src/entities/inventories.entity';
import { IProductService } from '../interfaces/product';
import { ShopService } from 'src/shops/services/shop.service';
import { BrandProduct } from 'src/utils/types';
import { CartService } from 'src/cart/cart.service';
import { DiscountsService } from 'src/discounts/discounts.service';
import {
  ICheckOut,
  ItemProduct,
  ItemProductCheckout,
} from '../dto/checkout-product';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Shop } from 'src/entities/shop.entity';
import { InventoriesService } from 'src/inventories/inventories.service';
import { LikeProduct } from 'src/entities/like-product.entity';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductAttribute)
    private readonly productAttributeRepository: Repository<ProductAttribute>,
    @InjectRepository(LikeProduct)
    private readonly likeProductRepo: Repository<LikeProduct>,
    @Inject(Services.SHOPS)
    private readonly shopService: ShopService,
    @Inject(Services.CARTS)
    private readonly cartService: CartService,
    @Inject(Services.INVENTORIES)
    private readonly inventoriesService: InventoriesService,
    @Inject(Services.DISCOUNT)
    private readonly discountService: DiscountsService,
    private dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createProduct(
    productDTO: ProductDTO,
    checkShopIsActive: Shop,
  ): Promise<Product> {
    const slugProduct = slugify(productDTO.name, { lower: true });
    productDTO['slug'] = slugProduct;
    productDTO['shop'] = checkShopIsActive;
    productDTO['sold'] = 0;
    productDTO['isPublish'] = false;
    productDTO['picture'] = [];
    productDTO['attributes'] = [];
    const newProduct = await this.productRepository.save(productDTO);
    return newProduct;
  }

  async addProductAttribute(product: Product): Promise<Product> {
    return await this.productRepository.save(product);
  }

  async createProductAttributeAndInventory(
    attribute: {
      size: string;
      material: string;
    },
    product: Product,
    shop: Shop,
    image: string,
  ): Promise<ProductAttribute> {
    const newProduct = await this.productAttributeRepository.save({
      ...attribute,
      product,
      shop,
      thumb: image,
      picture: image,
    });
    const inventory = await this.inventoriesService.create({
      stock: 0,
      location: '',
      productId: product.id,
      productAttributeId: newProduct.id,
      shopId: shop.id,
      reservation: [],
    });
    newProduct.inventory = inventory;
    await this.productAttributeRepository.save({ ...newProduct });
    return newProduct;
  }

  async getProductById(productId: string): Promise<Product> {
    const productCache: Product = await this.cacheManager.get(
      `product${productId}`,
    );
    if (!productCache) {
      const product = await this.productRepository.findOne({
        where: { id: productId },
        relations: ['attributes', 'picture'],
      });

      if (!product) throw new NotFoundException('Không tìm thấy sản phẩm.');
      await this.cacheManager.set(
        `product${productId}`,
        JSON.stringify(product),
        1000 * 60,
      );
      return product;
    }
    return productCache;
  }

  async getProductPublish(productId: string): Promise<Product> {
    const productCache: Product = await this.cacheManager.get(
      `product${productId}`,
    );
    if (!productCache) {
      const product = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.attributes', 'attributes')
        .leftJoinAndSelect('product.picture', 'picture')
        .where('product.id = :id', { id: productId })
        .andWhere('product.isPublish = true')
        .getOne();
      if (!product) throw new NotFoundException('Không tìm thấy sản phẩm.');
      await this.cacheManager.set(
        `product${productId}`,
        JSON.stringify(product),
        1000 * 60,
      );
      return product;
    }
    return productCache;
  }

  async getProductAttributeById(productId: number): Promise<ProductAttribute> {
    return this.productAttributeRepository.findOne({
      where: { id: productId, product: { isPublish: true } },
      relations: ['product'],
    });
  }

  async updateSoldProduct(
    quantity: number,
    productId: string,
  ): Promise<UpdateResult> {
    const product = await this.productRepository.findOneBy({ id: productId });
    return await this.productRepository.update(
      { id: product.id },
      { sold: product.sold + quantity },
    );
  }

  async updateProductById(
    productId: string,
    updateProduct: IUpdateProduct,
  ): Promise<UpdateResult> {
    const product = await this.getProductById(productId);
    if (!product) {
      throw new NotFoundException("Product doesn't exist.");
    }
    const { name, brand, detail, isPublish, price } = updateProduct;

    return this.productRepository.update(
      { id: productId },
      {
        name,
        brand,
        detail,
        price,
        isPublish,
        slug: name ? slugify(name, { lower: true }) : product.slug,
      },
    );
  }

  async publishProducts({
    productIds,
  }: IPublishOrUnPublishProduct): Promise<UpdateResult> {
    return this.productRepository.update(
      { id: In(productIds) },
      { isPublish: true },
    );
  }

  async unpublishProduct({
    productIds,
  }: IPublishOrUnPublishProduct): Promise<UpdateResult> {
    return this.productRepository.update(
      { id: In(productIds) },
      { isPublish: false },
    );
  }

  async updateAttributeProduct(
    productId: string,
    updateAttributeProduct: IUpdateAttributeProduct,
  ): Promise<ProductAttribute> {
    const product = await this.getProductById(productId);
    if (!product) {
      throw new NotFoundException("Product doesn't exist.");
    }
    return this.productAttributeRepository.save({ ...updateAttributeProduct });
  }

  async deleteProductById(productId: string): Promise<any> {
    return await this.productRepository.delete({ id: productId });
  }

  async deleteProductAttribute(productId: number): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(Inventory, {
        productAttribute: { id: productId },
      });
      await queryRunner.manager.delete(ProductAttribute, {
        id: productId,
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
    return true;
  }

  async deleteProductAttributes(productIds: number[]): Promise<boolean[]> {
    return await Promise.all(
      productIds.map(async (item) => {
        return this.deleteProductAttribute(item);
      }),
    );
  }

  async allProduct(productSearch: SearchProduct): Promise<any> {
    const {
      page,
      limit,
      search,
      shopId,
      publish,
      brand,
      order,
      searchBy,
      ids,
    } = productSearch;
    const take = parseInt(limit);
    const takePage = parseInt(page);
    const skip = take * (takePage - 1);
    const orderBy = {};
    if (searchBy === 'sales') {
      orderBy['sold'] = 'DESC';
    }
    if (searchBy === 'ctime') {
      orderBy['createdAt'] = 'DESC';
    }
    if (searchBy === 'price') {
      orderBy['price'] = order;
    }
    const nameSearch = slugify(search, { lower: true });
    const listIds = ids?.split(',') || [];
    const [res, total] = await this.productRepository.findAndCount({
      where: [
        {
          slug: Like('%' + nameSearch + '%'),
          isPublish: publish ? false : true,
          shop: { id: shopId },
          brand,
          id: listIds?.length > 0 ? Not(In([listIds])) : undefined,
        },
      ],
      relations: ['attributes', 'attributes.inventory', 'picture'],
      take: take,
      skip: skip,
      order: orderBy,
    });
    const lastPage = Math.ceil(total / take);
    const nextPage = takePage + 1 > lastPage ? null : takePage + 1;
    const prevPage = takePage - 1 < 1 ? null : takePage - 1;
    return {
      data: res,
      lastPage,
      nextPage,
      prevPage,
    };
  }

  async allProductShop(productSearch: SearchProductShop): Promise<any> {
    const { page, limit, search, shopId, publish, brand, order, searchBy } =
      productSearch;
    const take = parseInt(limit);
    const takePage = parseInt(page) - 1;
    const skip = take * takePage;
    const orderBy = {};
    if (searchBy === 'sales') {
      orderBy['sold'] = 'DESC';
    }
    if (searchBy === 'ctime') {
      orderBy['createdAt'] = 'DESC';
    }
    if (searchBy === 'price') {
      orderBy['price'] = order;
    }

    const whereOptions = {
      slug: Like('%' + search + '%'),
      shop: { id: shopId },
      brand: BrandProduct[brand?.toUpperCase()],
    };
    if (publish === 'true') whereOptions['isPublish'] = 1;
    if (publish === 'false') whereOptions['isPublish'] = 0;
    const [res, total] = await this.productRepository.findAndCount({
      where: {
        ...whereOptions,
      },
      relations: ['picture'],
      take: take,
      skip: skip,
      order: orderBy,
    });
    const lastPage = Math.floor(total / take);
    const nextPage = takePage + 1 > lastPage ? null : takePage + 1;
    const prevPage = takePage - 1 < 1 ? null : takePage - 1;

    return {
      data: res,
      lastPage,
      nextPage,
      prevPage,
    };
  }

  async checkProductByServer(products: ItemProduct[]) {
    return await Promise.all(
      products.map(async (product) => {
        const foundProduct = await this.getProductAttributeById(
          product.productAttribute.id,
        );
        if (foundProduct) {
          return {
            ...product,
          };
        }
      }),
    );
  }

  async checkProductByServerCheckout(products: ItemProductCheckout[]) {
    return await Promise.all(
      products.map(async (product) => {
        const foundProduct = await this.getProductAttributeById(
          product.productAttribute,
        );
        if (foundProduct) {
          return {
            ...product,
            productAttribute: foundProduct,
          };
        }
      }),
    );
  }

  async checkoutReview({ cartId, id, shop_order_ids = [] }: ICheckOut) {
    const foundCart = await this.cartService.findOne(cartId);
    if (!foundCart) {
      throw new BadRequestException('Cart does not exist!');
    }

    const checkout_order = {
      total_price: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };
    const shop_order_ids_new = [];

    for (const {
      shopId,
      shop_discounts,
      item_products = [],
    } of shop_order_ids) {
      const shopActive = await this.shopService.checkShopIsActive(shopId);
      // Kiểm tra sự tồn tại của sản phẩm trên máy chủ
      const checkProductServer = await this.checkProductByServerCheckout(
        item_products,
      );
      if (!checkProductServer) {
        throw new BadRequestException('Order wrong!');
      }

      const checkoutPrice = checkProductServer.reduce(
        (acc, product) => acc + product.quantity * product.price,
        0,
      );
      checkout_order.total_price += checkoutPrice;

      const itemCheckout = {
        shop: shopActive,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };
      if (shop_discounts.length > 0) {
        const {
          total_price = 0,
          total_price_apply_discount = 0,
          product_new,
        } = await this.discountService.applyDiscountToProduct({
          codeId: shop_discounts,
          id,
          shopId,
          products: checkProductServer,
        });
        checkout_order.totalCheckout +=
          total_price - total_price_apply_discount;
        if (total_price_apply_discount > 0) {
          itemCheckout.priceApplyDiscount =
            checkoutPrice - total_price_apply_discount;
          itemCheckout.item_products = product_new;
        }
        checkout_order.totalDiscount += total_price_apply_discount;
      } else {
        checkout_order.totalCheckout += itemCheckout.priceRaw;
      }
      shop_order_ids_new.push(itemCheckout);
    }
    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  async likeProduct(
    id: string,
    productId: string,
    shopId: string,
  ): Promise<LikeProduct> {
    return await this.likeProductRepo.save({
      product: { id: productId },
      user: { id: id },
      shop: { id: shopId },
    });
  }

  async unlikeProduct(id: string, productId: string): Promise<DeleteResult> {
    return await this.likeProductRepo.delete({
      product: { id: productId },
      user: { id: id },
    });
  }

  async getLikeProduct(productId: string): Promise<any> {
    const res = await this.likeProductRepo
      .createQueryBuilder('like_product')
      .where('like_product.productId = :productId', { productId })
      .getCount();
    return res;
  }

  async checkLikeProduct(id: string, productId: string): Promise<any> {
    const isLikeProduct = await this.likeProductRepo.findOne({
      where: { product: { id: productId }, user: { id: id } },
    });
    const totalLike = await this.getLikeProduct(productId);
    return { isLike: isLikeProduct, totalLike };
  }
}
