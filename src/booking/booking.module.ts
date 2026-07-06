import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthModule} from "../auth/auth.module"
import {BranchSchedule} from '../salon/entities/branch-schedule.entity'
import { CustomerEntity } from '../customer/entities/create-customer.entity';
import { TeamMember } from '../team_member/entities/team_member.entity';
import { ConsumerService } from '../consumer_service/entities/consumer_service.entity';
import { BranchEntity } from '../salon/entities/branch.entity';
import { TeamMemberScheduleEntity } from '../team_member/entities/team_member-schedule.entity';
import { BookingEntity } from './entities/booking.entity';
import { ReservationSchedulerService } from './reservation.scheduler';
import { BookingReservation } from './entities/booking_reservation.entity';
import { PackageEntity } from '../packages/entities/package.entity';
import { PaymentEntity } from '../payment/entities/payment.entity';
import { DealsEntity } from '../deals/entities/create-deals.entity';
import { PaymentModule } from '../payment/payment.module';
import { OtpEntity } from '../salon/entities/otp.entity';


@Module({
    imports: [
          TypeOrmModule.forFeature([BranchSchedule,CustomerEntity,TeamMember,ConsumerService,BranchEntity,TeamMemberScheduleEntity,BookingEntity,BookingReservation,PackageEntity,PaymentEntity,DealsEntity,OtpEntity]),
            AuthModule,
             PaymentModule,
        ],
  controllers: [BookingController],
  providers: [BookingService,ReservationSchedulerService],
})
export class BookingModule {}
