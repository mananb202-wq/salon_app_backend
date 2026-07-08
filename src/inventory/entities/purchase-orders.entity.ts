import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum PurchaseOrderStatus {
  PLACED = 'PLACED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

@Entity('purchase_orders')
export class PurchaseOrderEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
     type: 'enum',
     enum: PurchaseOrderStatus,
     default: PurchaseOrderStatus.PLACED,
     })
     status!: PurchaseOrderStatus;

  @CreateDateColumn()
  orderedAt!: Date;
}