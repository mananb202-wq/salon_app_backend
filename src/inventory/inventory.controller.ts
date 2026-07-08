import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { AddInventoryItemsDto } from './dto/add-inventory-items.dto';
import { UsedInventoryItemDto } from './dto/used-inventory-items.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ReceiveOrderDto } from './dto/receive-inventory-order.dto';


@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

@UseGuards(AuthGuard('jwt'))
@Post("add-items")
addInventoryItems(@Body() dto:AddInventoryItemsDto){
return this.inventoryService.addInventoryItems(dto);
};

@UseGuards(AuthGuard('jwt'))
@Post("Item-used")
inventoryItemUsed(@Body() dto:UsedInventoryItemDto[]){
  return this.inventoryService.inventoryItemUsed(dto);
}

@UseGuards(AuthGuard('jwt'))
@Post("place-order")
placeOrderInventory(@Body() dto:CreatePurchaseOrderDto){
  return this.inventoryService.placeOrderInventory(dto);
}

@UseGuards(AuthGuard('jwt'))
@Post("received-order")
receiveOrderInventory(@Body() dto:ReceiveOrderDto){
  return this.inventoryService.receiveOrderInventory(dto);
}

}
