import{
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
}from 'typeorm'

export enum CartItemType {
  SERVICE = 'service',
  DEAL = 'deal',
  PACKAGE = 'package',
}

import { CartEntity } from './cart.entity';
import { ConsumerService } from '../../consumer_service/entities/consumer_service.entity';
import { DealsEntity } from '../../deals/entities/create-deals.entity';
import { PackageEntity } from '../../packages/entities/package.entity';
import { BranchEntity } from '../../salon/entities/branch.entity';


@Entity('cart_Items')
export class CartItemEntity {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => CartEntity)
  cart!: CartEntity;

  @ManyToOne(() => ConsumerService, {
    nullable: true,
  })
  service!: ConsumerService;

  @ManyToOne(() => DealsEntity, {
    nullable: true,
  })
  @JoinColumn({ name: 'DealId' })
  deal!: DealsEntity;

  @ManyToOne(() => PackageEntity, {
    nullable: true,
  })
  @JoinColumn({ name: 'PackageId' })
  package!: PackageEntity;

  @ManyToOne(() => BranchEntity, {
    nullable: true,
  })
  @JoinColumn({ name: 'BranchId' })
  branch!: BranchEntity;
}
