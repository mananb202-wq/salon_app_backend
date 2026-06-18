import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';

import { BranchEntity } from '../../salon/entities/branch.entity';
import { ConsumerService } from '../../consumer_service/entities/consumer_service.entity';
import { DealTypeEntity } from '../entities/deal-type.entity';

@Entity('Deals')
export class DealsEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => BranchEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'branchId',
  })
  branch!: BranchEntity;

  

  @ManyToMany(() => ConsumerService)
  @JoinTable({
    name: 'deal_services',
    joinColumn: {
      name: 'dealId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'serviceId',
      referencedColumnName: 'id',
    },
  })
  services!: ConsumerService[];

   @ManyToOne(
    () => DealTypeEntity,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name:"dealType"
  })

  dealType!: DealTypeEntity;

 @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  totalPrice!: number;

    @Column('decimal', {
    precision: 5,
    scale: 2,
    nullable: true,
  })
  percentageDiscount?: number| null;

 
  @Column('decimal', {
  precision: 10,
  scale: 2,
  nullable: true,
  })
  maxDiscountAmount?:  number | null;

 
  @Column('decimal', {
  precision: 10,
  scale: 2,
  })
  finalPrice!: number;
 

  @Column({
    default: true,
  })
  isActive!: boolean;

  @Column('decimal', {
  precision: 10,
  scale: 2,
  nullable: true,
})
discountAmount?: number | null;

  @Column({
    type: 'timestamp',
  })
  startDate!: Date;

  @Column({
    type: 'timestamp',
  })
  endDate!: Date;
}


