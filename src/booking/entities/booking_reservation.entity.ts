import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn
} from 'typeorm';
import { CustomerEntity } from '../../customer/entities/create-customer.entity';
import { BranchEntity } from '../../salon/entities/branch.entity';
import { TeamMember } from '../../team_member/entities/team_member.entity';

export enum ReservationStatus {
  RESERVED = 'RESERVED',
  CONFIRMED = 'CONFIRMED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

@Entity('booking_reservations')
export class BookingReservation {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn()
  customer!: CustomerEntity;

  @ManyToOne(() => BranchEntity)
  @JoinColumn()
  branch!: BranchEntity;

 @Column({ type: 'time' })
slotStartTime!: string;

@Column({ type: 'time' })
slotEndTime!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(
    () => TeamMember,
    {
      onDelete: 'CASCADE',
          },
        )
    @JoinColumn({
          name: 'teamMemberId',
    })
    teamMember!: TeamMember;
    
  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.RESERVED,
  })
  status!: ReservationStatus;

@Column({ type: 'timestamp' })
reservedUntil!: Date;

@Column({ type: 'date' })
bookingDate!: string;
}





