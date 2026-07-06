import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn
} from 'typeorm';
import { BookingReservation } from '../../booking/entities/booking_reservation.entity';
import { DealsEntity } from '../../deals/entities/create-deals.entity';
import { PackageEntity } from '../../packages/entities/package.entity';
import { ConsumerService } from '../../consumer_service/entities/consumer_service.entity';

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  TIMEOUT='TIMEOUT'
}
@Entity("Payments")
export class PaymentEntity {
 @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => BookingReservation,
    { nullable: true })
  reservation!: BookingReservation;

  @Column()
  razorpayOrderId!: string;

  @Column({ nullable: true })
  razorpayPaymentId!: string;

  @Column('decimal')
  amount!: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status!: PaymentStatus;

  @Column({ type: 'timestamp' ,
     nullable: true} 
  )
  reservedUntil!: Date;


  @ManyToOne(() => DealsEntity,{
    nullable: true,
  }
  )
  @JoinColumn({ name: 'DealId' }
  )
  deal!: DealsEntity;

@ManyToOne(() => PackageEntity ,{
  nullable: true,
})
@JoinColumn({ name: 'packageId' })
package!: PackageEntity;


@ManyToOne(() => ConsumerService)
  @JoinColumn({ name: 'serviceId' })
  service!: ConsumerService;

}


