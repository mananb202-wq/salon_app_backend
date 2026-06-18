import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { DealsEntity } from './create-deals.entity';
import { CustomerEntity } from '../../customer/entities/create-customer.entity';

@Entity('Buy_deal')
export class BuyDealEntity {

        @PrimaryGeneratedColumn()
        id!:number;
    
        @ManyToOne(() => DealsEntity)
        @JoinColumn({ name: 'DealId' })
        deal!: DealsEntity;

        @ManyToOne(() => CustomerEntity)
        @JoinColumn({
        name: 'customerId',
        })
        customer!:CustomerEntity;

        @CreateDateColumn()
        boughtAt!: Date;
        
         @Column({
          type: 'timestamptz',
          nullable: true,
         })
         usedAt!: Date;

          @Column({
          type: 'timestamptz',
          nullable: true,
         })
         expiresAt!: Date;
       
}
