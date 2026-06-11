import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn
} from 'typeorm';

import { BranchEntity } from '../../salon/entities/branch.entity';
import { ConsumerService } from '../../consumer_service/entities/consumer_service.entity';
import { TeamMember } from '../../team_member/entities/team_member.entity';
import { CustomerEntity } from '../../customer/entities/create-customer.entity';
import { WorkingDays } from '../../salon/entities/working-days.entity';

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  IN_PROCESS = 'IN_PROCESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
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
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  status!: BookingStatus;

@Column({ type: 'date' })
bookingDate!: Date;

@Column({ type: 'time' })
bookingTime!: string;

@CreateDateColumn({
  type: 'timestamp',
})
createdAt!: Date;

}