import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { ProductAttribute } from 'src/entities/productAttribute.entity';
import { BrandProduct } from 'src/utils/types';

export class ProductDTO {
  @ApiProperty({ description: 'name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'brand' })
  @IsString()
  brand: BrandProduct;

  @ApiProperty({ description: 'detail' })
  @IsString()
  detail: string;

  @ApiProperty({ description: 'price' })
  @IsString()
  price: number;
}

export class CreateProductDTO {
  @ApiProperty({ description: 'name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'brand' })
  @IsString()
  brand: BrandProduct;

  @ApiProperty({ description: 'detail' })
  @IsString()
  detail: string;

  @ApiProperty({ description: 'price' })
  @IsString()
  price: number;

  @ApiProperty({ description: 'attributes' })
  @IsString()
  attributes: string;
}
