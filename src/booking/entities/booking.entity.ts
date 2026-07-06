import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  OneToOne
} from 'typeorm';

import { BranchEntity } from '../../salon/entities/branch.entity';
import { ConsumerService } from '../../consumer_service/entities/consumer_service.entity';
import { TeamMember } from '../../team_member/entities/team_member.entity';
import { CustomerEntity } from '../../customer/entities/create-customer.entity';
import { WorkingDays } from '../../salon/entities/working-days.entity';
import { PackageEntity } from '../../packages/entities/package.entity';
import { DealsEntity } from '../../deals/entities/create-deals.entity';
import { PaymentEntity } from '../../payment/entities/payment.entity';

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  IN_PROCESS = 'IN_PROCESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum BookingItemType {
  SERVICE = 'service',
  DEAL = 'deal',
  PACKAGE = 'package',
}

@Entity('Bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => BranchEntity)
  @JoinColumn({ name: 'branchId' })
  branch!: BranchEntity;

  @ManyToOne(() => ConsumerService)
  @JoinColumn({ name: 'serviceId' })
  service!: ConsumerService;

  @ManyToOne(() => TeamMember)
  @JoinColumn({ name: 'teamMemberId' })
  teamMember!: TeamMember;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customerId' })
  customer!: CustomerEntity;

  @ManyToOne(() => WorkingDays)
  @JoinColumn({ name: "dayId" })
  dayId!: WorkingDays;

  @Column({
    type: 'enum',
    enum: BookingItemType
  })
  bookingItemType!: BookingItemType;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  status!: BookingStatus;

@ManyToOne(() => PackageEntity ,{
  nullable: true,
})
@JoinColumn({ name: 'packageId' })
package!: PackageEntity;
  

@ManyToOne(() => DealsEntity,{
  nullable: true,
}
)
@JoinColumn({ name: 'DealId' }
)
deal!: DealsEntity;

@Column({ type: 'date' })
bookingDate!: Date;

@Column({ type: 'time' })
bookingTime!: string;

@CreateDateColumn({
  type: 'timestamp',
})
createdAt!: Date;

@ManyToOne(()=>PaymentEntity)
@JoinColumn({name:"paymentId"})
payment!:PaymentEntity

}