import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReceiveInventoryItemDto {
  @IsNotEmpty()
  @IsNumber()
  ItemId!: number;

  @IsNotEmpty()
  @IsNumber()
  receivedQuantity!: number;

  @IsNotEmpty()
  @IsNumber()
  price!: number;
}