import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderInventoryItemDto {
  @IsNotEmpty()
  @IsNumber()
  ItemId!: number;

  @IsNotEmpty()
  @IsNumber()
  quantity!: number;

  @IsNotEmpty()
  @IsNumber()
  price!: number;
}