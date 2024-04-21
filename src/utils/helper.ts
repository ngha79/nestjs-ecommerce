import { CartItems } from 'src/entities/cartItem.entity';

import { _ } from 'lodash';
import * as bcrypt from 'bcrypt';

export function extractShopAndProductInfo(cartItems: CartItems[]) {
  // Group cart items by shop ID
  const groupedByShop = _.groupBy(
    cartItems,
    'productAttribute.product.shop.id',
  );
  // Map over the grouped items and extract relevant information
  const resultArray = _.map(groupedByShop, (shopItems: CartItems) => {
    const firstItem = shopItems[0]; // Assuming the shop information is the same for all items in the group

    const shopInfo = _.pick(firstItem.productAttribute.product.shop, [
      'avatar',
      'id',
      'userName',
      'background',
    ]);

    const productInfoArray = _.map(shopItems, (cartItem) => {
      return _.pick(cartItem, [
        'productAttribute.product.name',
        'productAttribute.product.isPublish',
        'productAttribute.product.price',
        'productAttribute.product.id',
        'productAttribute.size',
        'productAttribute.picture',
        'productAttribute.material',
        'productAttribute.id',
        'total_product',
        'id',
      ]);
    });
    return { shop: shopInfo, products: productInfoArray };
  });

  return resultArray;
}

export async function hashPassword(rawPassword: string) {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(rawPassword, salt);
}

export async function compareHash(rawPassword: string, hashedPassword: string) {
  return await bcrypt.compare(rawPassword, hashedPassword);
}
