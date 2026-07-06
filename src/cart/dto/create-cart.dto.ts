import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';


import { CartItemType } from '../entities/cart-items.entity';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsEnum(CartItemType)
  itemType!: CartItemType;

  @IsOptional()
  @IsNumber()
  serviceId?: number;

  @IsOptional()
  @IsNumber()
  dealId?: number;

  @IsOptional()
  @IsNumber()
  packageId?: number;

  @IsNumber()
  branchId?:number;
}