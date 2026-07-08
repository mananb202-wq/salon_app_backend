import {CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PurchaseOrderEntity } from "./purchase-orders.entity";


@Entity('received_inventory_orders')
export class ReceiveOrderEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => PurchaseOrderEntity, {
      onDelete: 'CASCADE',
      })
      @JoinColumn({
           name: 'orderId',
      })
      purchaseOrder!: PurchaseOrderEntity;

  @CreateDateColumn()
  receivedAt!: Date;

}

