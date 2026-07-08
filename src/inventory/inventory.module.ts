import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { InventoryEnity } from './entities/inventory.entity';
import { InUseInventoryItemsEntity } from './entities/in-use-inventory-item.entity';
import { PurchaseOrderEntity } from './entities/purchase-orders.entity';
import { OrderInventoryItem } from './entities/order-inventory-items.entity';
import { ReceiveOrderEntity } from './entities/receive-inventory-order.entity';
import { ReceiveInventoryItemsEntity } from './entities/received-inventory-items.entity';

@Module({
  imports: [
          TypeOrmModule.forFeature([InventoryEnity,InUseInventoryItemsEntity,PurchaseOrderEntity,OrderInventoryItem,ReceiveOrderEntity,ReceiveInventoryItemsEntity]),
            AuthModule,
        ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
