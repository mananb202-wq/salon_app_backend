import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { PaymentEntity, PaymentStatus } from './entities/payment.entity';



@Injectable()
export class PaymentSchedulerService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepo: Repository<PaymentEntity>,
  ) {}

  @Cron('* * * * *') 
  async handlePendingPayments() {
    const now = new Date();

    const pendingPayments = await this.paymentRepo.find({
      where: {
        status: PaymentStatus.PENDING,
        reservedUntil: LessThan(now),
      },
    });

    if (pendingPayments.length === 0) {
    return;
   }

    for (const pendingPayment of pendingPayments) {
      pendingPayment.status = PaymentStatus.TIMEOUT;
    }

    await this.paymentRepo.save(pendingPayments);

    console.log(`Timeout ${pendingPayments.length} payments`);
  }

 
}