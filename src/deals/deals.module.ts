import { Module } from '@nestjs/common';
import { DealsService } from './deals.service';
import { DealsController } from './deals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthModule} from "../auth/auth.module"
import {DealTypeEntity} from './entities/deal-type.entity';
import {DealsEntity} from './entities/create-deals.entity'
import { BuyDealEntity } from './entities/buy-deal.entity';
import { CustomerEntity } from '../customer/entities/create-customer.entity';
import { ConsumerService } from '../consumer_service/entities/consumer_service.entity';
import { PaymentEntity } from '../payment/entities/payment.entity';
import { RazorpayService } from '../payment/razorpay.service';
import { PaymentModule } from '../payment/payment.module';



@Module({

   imports: [
        TypeOrmModule.forFeature([DealTypeEntity,DealsEntity,BuyDealEntity,CustomerEntity,ConsumerService,PaymentEntity]),
          AuthModule,
            PaymentModule,
      ],
  controllers: [DealsController],
  providers: [DealsService],
   exports:[DealsService]
})
export class DealsModule {}
