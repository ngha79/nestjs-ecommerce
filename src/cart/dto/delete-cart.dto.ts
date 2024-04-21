import { PartialType } from '@nestjs/swagger';
import { CreateCartDto } from './create-cart.dto';

export class DeleteCartDto extends PartialType(CreateCartDto) {
  isDeleteAll: number;
  ids: number[];
}
