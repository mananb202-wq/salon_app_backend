import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PaymentModule } from '../payment/payment.module';
import { BookingEntity } from '../booking/entities/booking.entity';

@Module({
   imports: [
   TypeOrmModule.forFeature([BookingEntity]),
            AuthModule,
              PaymentModule,
        ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
