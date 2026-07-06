import{
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    JoinColumn
}from 'typeorm'

import { CustomerEntity } from '../../customer/entities/create-customer.entity';


@Entity('cart')
export class CartEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customerId' })
  customer!: CustomerEntity;

  @Column({
    default: true,
  })
  isActive!: boolean;

}
