import {
  IsArray,
  ArrayMinSize,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderInventoryItemDto } from './order-inventory-item.dto';


export class CreatePurchaseOrderDto {

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderInventoryItemDto)
  items!: OrderInventoryItemDto[];
}