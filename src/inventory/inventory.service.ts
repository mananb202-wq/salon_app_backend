import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AddInventoryItemsDto } from './dto/add-inventory-items.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryEnity } from './entities/inventory.entity';
import { UsedInventoryItemDto } from './dto/used-inventory-items.dto';
import { InUseInventoryItemsEntity } from './entities/in-use-inventory-item.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { PurchaseOrderEntity, PurchaseOrderStatus } from './entities/purchase-orders.entity';
import { OrderInventoryItem } from './entities/order-inventory-items.entity';
import { ReceiveOrderDto } from './dto/receive-inventory-order.dto';
import { ReceiveOrderEntity } from './entities/receive-inventory-order.entity';
import { ReceiveInventoryItemsEntity } from './entities/received-inventory-items.entity';

@Injectable()
export class InventoryService {
 
   constructor(

    @InjectRepository(InventoryEnity)
    private inventoryRepo :Repository<InventoryEnity>,

    @InjectRepository(InUseInventoryItemsEntity)
    private inUseInventoryItemRepo :Repository<InUseInventoryItemsEntity>,

    @InjectRepository(PurchaseOrderEntity)
    private purchaseOrderRepo :Repository<PurchaseOrderEntity>,

    @InjectRepository(OrderInventoryItem)
    private orderInventoryItemRepo :Repository<OrderInventoryItem>,

      @InjectRepository(ReceiveOrderEntity)
    private receiveOrderRepo :Repository<ReceiveOrderEntity>,

       @InjectRepository(ReceiveInventoryItemsEntity)
    private receiveOrderItemsRepo :Repository<ReceiveInventoryItemsEntity>,
   ){}

    async addInventoryItems(dto:AddInventoryItemsDto){
     
        const itemAlreadyExist= await this.inventoryRepo.findOne({
            where:{
                name:dto.name,
                branch:{
                    id:dto.branchId
                }

            }
        })

        if(itemAlreadyExist){
            throw new BadRequestException("Item already exists in the inventory");
        }


        const addItem= await this.inventoryRepo.create({
           name:dto.name,
           quantity:dto.quantity,
           price:dto.price,
           brand:dto.brand,
           expiryDate: new Date(dto.expiryDate),
           branch:{
            id:dto.branchId
           },
        })

     await this.inventoryRepo.save(addItem);

     return{
        success:true,
        message:"item is added in inventory",
        data:addItem
     }
   
    }


    async inventoryItemUsed(dtos:UsedInventoryItemDto[]){
       
        for(const dto of dtos){
        const isExistingInventoryItemInUse= await this.inUseInventoryItemRepo.findOne({
            where:{
                inventory:{
                id:dto.inventoryItemId
                }
            }
        })

        if(!isExistingInventoryItemInUse && dto.isFinished === false){
            const addUsedItem = await this.inUseInventoryItemRepo.create({
                inventory:{
                id:dto.inventoryItemId
                },
                usedCount:1

            });
           await this.inUseInventoryItemRepo.save(addUsedItem)

        }

        
       if (!isExistingInventoryItemInUse && dto.isFinished) {
           throw new BadRequestException(
           'Inventory item cannot be marked as finished before it has been used.',
          );
         }

        if(isExistingInventoryItemInUse){

        if(dto.isFinished === false){
            isExistingInventoryItemInUse.usedCount++;
            await this.inUseInventoryItemRepo.save(isExistingInventoryItemInUse);
        }

        if (dto.isFinished) {
          isExistingInventoryItemInUse.usedCount = 0;
          await this.inUseInventoryItemRepo.save(isExistingInventoryItemInUse);

        const inventoryItem = await this.inventoryRepo.findOne({
        where: {
         id: dto.inventoryItemId,
        },
        });

        if (!inventoryItem) {
        throw new NotFoundException('Inventory item not found');
        }

        if (inventoryItem.quantity <= 0) {
         throw new BadRequestException('Inventory quantity is already zero');
        }

        inventoryItem.quantity--;

        await this.inventoryRepo.save(inventoryItem);
        }

        }

    }

    return{
        success:true,
        message:"in use inventory items updated",
    }
}


async placeOrderInventory(dto:CreatePurchaseOrderDto){
     
    for (const inventoryItem of dto.items) {
    const inventory = await this.inventoryRepo.findOne({
      where: {
        id: inventoryItem.ItemId,
      },
    });

    if (!inventory) {
      throw new NotFoundException(
        `Inventory item with id ${inventoryItem.ItemId} not found`,
      );
    }

    if (inventoryItem.quantity <= 0) {
      throw new BadRequestException(
        'Quantity must be greater than 0',
      );
    }

    if (inventoryItem.price <= 0) {
      throw new BadRequestException(
        'Price must be greater than 0',
      );
    }
  }

    const purchaseOrder = this.purchaseOrderRepo.create();
    await this.purchaseOrderRepo.save(purchaseOrder);
    

    for(const inventoryItem of dto.items){
    
    const orderItem = this.orderInventoryItemRepo.create({
    purchaseOrder: {
      id: purchaseOrder.id,
    },
    inventory: {
      id: inventoryItem.ItemId,
    },
     quantity: inventoryItem.quantity,
     price: inventoryItem.price,
    });
    await this.orderInventoryItemRepo.save(orderItem);
    }

    return{
        success:true,
        message:"ordered placed",
        orderId: purchaseOrder.id
    }

}


async receiveOrderInventory(dto:ReceiveOrderDto){
  
  const purchaseOrder = await this.purchaseOrderRepo.findOne({
  where: {
    id: dto.OrderId,
  },
});

if (!purchaseOrder) {
  throw new NotFoundException(
    `Purchase order with id ${dto.OrderId} not found`,
  );
}

const existingReceiveOrder = await this.receiveOrderRepo.findOne({
  where: {
    purchaseOrder: {
      id: dto.OrderId,
    },
  },
});

if (existingReceiveOrder) {
  throw new BadRequestException(
    'This purchase order has already been received.',
  );
}

for (const inventoryItem of dto.items) {
const inventory = await this.inventoryRepo.findOne({
      where: {
        id: inventoryItem.ItemId,
      },
    });
if (!inventory) {
  throw new NotFoundException(
    `Inventory item not found`,
  );
}

if (inventoryItem.receivedQuantity <= 0) {
  throw new BadRequestException(
    'Received quantity must be greater than 0',
  );
}

if (inventoryItem.price <= 0) {
  throw new BadRequestException(
    'Price must be greater than 0',
  );
}

}

for (const inventoryItem of dto.items) {

  const orderedItem = await this.orderInventoryItemRepo.findOne({
  where: {
    purchaseOrder: {
      id: dto.OrderId,
    },
    inventory: {
      id: inventoryItem.ItemId,
    },
  },
});

if (!orderedItem) {
  throw new BadRequestException(
    `Inventory item ${inventoryItem.ItemId} is not part of this purchase order.`,
  );
}

if (inventoryItem.receivedQuantity > orderedItem.quantity) {
  throw new BadRequestException(
    'Received quantity cannot exceed ordered quantity.',
  );
}
}

  const receiveOrder = this.receiveOrderRepo.create({
    purchaseOrder:{
      id:dto.OrderId
    }
  }
  );
  await this.receiveOrderRepo.save(receiveOrder);
for (const inventoryItem of dto.items) {

  const addReceivedOrderItems= this.receiveOrderItemsRepo.create({
    receiveOrder:{
      id:receiveOrder.id
    },
    inventory:{
      id:inventoryItem.ItemId
    },
    price:inventoryItem.price,
    receivedQuantity:inventoryItem.receivedQuantity

  })

   const inventory = await this.inventoryRepo.findOne({
      where: {
        id: inventoryItem.ItemId,
      },
    });
if (!inventory) {
  throw new NotFoundException(
    `Inventory item not found`,
  );
}

inventory.quantity += inventoryItem.receivedQuantity;

await this.inventoryRepo.save(inventory);
await this.receiveOrderItemsRepo.save(addReceivedOrderItems);
}

purchaseOrder.status = PurchaseOrderStatus.RECEIVED;
await this.purchaseOrderRepo.save(purchaseOrder);

return {
  success:true,
  message:"order is received",

}

}




}
