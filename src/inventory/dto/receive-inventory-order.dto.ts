import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReceiveInventoryItemDto } from './receive-inventory-items.dto';

export class ReceiveOrderDto {
  @IsNotEmpty()
  @IsNumber()
  OrderId!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReceiveInventoryItemDto)
  items!: ReceiveInventoryItemDto[];
}