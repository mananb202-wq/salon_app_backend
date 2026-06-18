import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn
} from 'typeorm';

  export enum DurationType {
  DAYS = 'days',
  MONTHS = 'months',
  YEARS = 'years',
}

import { BranchEntity } from '../../salon/entities/branch.entity';
import { ConsumerService } from '../../consumer_service/entities/consumer_service.entity';
import { DealTypeEntity } from '../../deals/entities/deal-type.entity';
@Entity('Packages')
export class PackageEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(
    () => BranchEntity,
    
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name:"branchId"
  })
  branch!: BranchEntity;


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

  @ManyToMany(() => ConsumerService)
  @JoinTable({
    name: 'package_services',
  })
  services!: ConsumerService[];

@Column()
duration!: number;

@Column({
  type: 'enum',
  enum: DurationType,
})
durationType!: DurationType;

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
}
