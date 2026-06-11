import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
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

  @ManyToOne(() => ConsumerService)
  @JoinColumn({
    name: 'serviceId',
  })
  services!: ConsumerService;

  @ManyToOne(() => DealTypeEntity)
  @JoinColumn({
    name: 'dealTypeId',
  })
  deal_type!: DealTypeEntity;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  originalPrice!: number;

  
  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: true,
  })
  value?: number;

  @Column('decimal', {
    precision: 5,
    scale: 2,
    nullable: true,
  })
  percentage?: number;

 
  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: true,
  })
  maxDiscountAmount?: number;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @Column({
    type: 'timestamp',
  })
  startDate!: Date;

  @Column({
    type: 'timestamp',
  })
  endDate!: Date;
}


