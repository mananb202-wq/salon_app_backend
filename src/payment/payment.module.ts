import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { RazorpayService } from './razorpay.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PaymentEntity } from './entities/payment.entity';
import { BookingReservation } from '../booking/entities/booking_reservation.entity';
import { PaymentSchedulerService } from './payment.scheduler';
import { BookingEntity } from '../booking/entities/booking.entity';
import { PackageEntity } from '../packages/entities/package.entity';
import { BuyPackageEntity } from '../packages/entities/buy-package.entity';
import { BuyDealEntity } from '../deals/entities/buy-deal.entity';
import { DealsEntity } from '../deals/entities/create-deals.entity';

@Module({
  imports: [
            TypeOrmModule.forFeature([PaymentEntity,BookingReservation,BookingEntity,PackageEntity,BuyPackageEntity,BuyDealEntity,DealsEntity]),
              AuthModule,
          ],

  controllers: [PaymentController],
  providers: [PaymentService,RazorpayService,PaymentSchedulerService],
  exports: [RazorpayService],
})
export class PaymentModule {}
