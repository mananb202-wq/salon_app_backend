import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { InventoryEnity } from "./inventory.entity";

@Entity('in_use_inventory_items')
export class InUseInventoryItemsEntity{
 
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
  usedCount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

}