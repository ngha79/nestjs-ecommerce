import { Inventory } from 'src/entities/inventories.entity';
import { Order } from 'src/entities/order.entity';

export class CreateReservationDto {
  order: Order;
  inventory: Inventory;
  quantity: number;
}
