import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { BranchEntity } from './branch.entity';

import { ConsumerService } from '../../consumer_service/entities/consumer_service.entity';

@Entity('branch_services')
export class BranchService {

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => BranchEntity,

    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'branchId',
  })
  branch!: BranchEntity;

  @ManyToOne(
    () => ConsumerService,
  )
  @JoinColumn({
    name: 'serviceId',
  })
  service!: ConsumerService;
}