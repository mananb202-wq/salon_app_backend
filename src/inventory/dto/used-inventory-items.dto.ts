import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class UsedInventoryItemDto{
  @IsNotEmpty()
  @IsNumber()
  inventoryItemId!: number;

  @IsNotEmpty()
  @IsBoolean()
  isFinished!: boolean;  

}