import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';

import { PackageEntity } from './package.entity';
import { ConsumerService } from '../../consumer_service/entities/consumer_service.entity';
import { CustomerEntity } from '../../customer/entities/create-customer.entity';


@Entity('Buy_Package')
export class BuyPackageEntity{

    @PrimaryGeneratedColumn()
    id!:number;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({
      type: 'timestamptz',
      nullable: true,
    })
    usedAt!: Date;

    @ManyToOne(() => PackageEntity)
    @JoinColumn({ name: 'packageId' })
    package!: PackageEntity;

    
    @ManyToOne(() => ConsumerService)
    @JoinColumn({
        name: 'servicesId',
    })
    services!:ConsumerService;

   @ManyToOne(() => CustomerEntity)
    @JoinColumn({
        name: 'customerId',
    })
    costomer!:CustomerEntity;
    
}