import { Inventory } from 'src/entities/inventories.entity';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { UpdateResult, DeleteResult } from 'typeorm';
import { FindAllInventoryByShop } from '../dto/find-all-inventory-shop';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';
import { UpdateWhenOrder } from '../dto/update-when-order';

export interface IInventoriesService {
  create(createInventoryDto: CreateInventoryDto): Promise<Inventory>;
  findAllByShop(findAllInventoryByShop: FindAllInventoryByShop): Promise<any>;
  findOne(id: number): Promise<Inventory>;
  addStockToInventory(
    id: number,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<UpdateResult>;
  remove(id: number): Promise<DeleteResult>;
  updateInventoryWhenUserOrder(
    updateWhenOrder: UpdateWhenOrder,
  ): Promise<boolean>;
  updateInventoryWhenOrderCancel(
    updateWhenOrder: UpdateWhenOrder,
  ): Promise<any>;
  checkInventory(productId: number): Promise<Inventory>;
}
