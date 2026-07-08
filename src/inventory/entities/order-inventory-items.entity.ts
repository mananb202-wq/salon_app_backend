import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InventoryEnity } from "./inventory.entity";
import { PurchaseOrderEntity } from "./purchase-orders.entity";

@Entity('order_inventory_items')
export class OrderInventoryItem{

    @ManyToOne(() => PurchaseOrderEntity, {
     onDelete: 'CASCADE',
     })
    @JoinColumn({
     name: 'orderId',
    })
    purchaseOrder!: PurchaseOrderEntity;

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => InventoryEnity, {
      onDelete: 'CASCADE',
      },
      )
     @JoinColumn({
        name: 'itemId',
      })
    inventory!: InventoryEnity;


    @Column()
    price!:number;

    @Column()
    quantity!:number;

}