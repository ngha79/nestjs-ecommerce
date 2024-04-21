import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards,
  Query,
} from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Services } from 'src/utils/constants';
import { Inventory } from 'src/entities/inventories.entity';
import { ShopGuard } from 'src/guards/shop.guard';
import { FindAllInventoryByShop } from './dto/find-all-inventory-shop';

@Controller('inventories')
export class InventoriesController {
  constructor(
    @Inject(Services.INVENTORIES)
    private readonly inventoriesService: InventoriesService,
  ) {}

  @UseGuards(ShopGuard)
  @Post()
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoriesService.create(createInventoryDto);
  }

  @Get()
  @UseGuards(ShopGuard)
  findAll(
    @Query()
    findAllInventoryByShop: FindAllInventoryByShop,
  ) {
    return this.inventoriesService.findAllByShop(findAllInventoryByShop);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Inventory> {
    return this.inventoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ShopGuard)
  update(
    @Param('id') id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoriesService.addStockToInventory(id, updateInventoryDto);
  }

  @UseGuards(ShopGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.inventoriesService.remove(id);
  }
}
