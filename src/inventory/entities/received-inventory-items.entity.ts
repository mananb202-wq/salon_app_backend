import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InventoryEnity } from "./inventory.entity";
import { ReceiveOrderEntity } from "./receive-inventory-order.entity";


@Entity('received_order_inventory_items')
export class ReceiveInventoryItemsEntity{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => ReceiveOrderEntity, {
    onDelete: 'CASCADE',
    })
    @JoinColumn({
         name: 'receiveId',
    })
    receiveOrder!: ReceiveOrderEntity;
   
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
    receivedQuantity!:number;

}